// Captures project screenshots from the live sites into public/projects/<slug>/ as WebP.
// Usage: node scripts/capture-projects.mjs [slug ...]
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const OUT = path.resolve('public/projects')

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 }
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
const PHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'

const targets = [
  // Causeline publishes its own product image of the trace UI; use it as-is.
  { slug: 'causeline', asset: 'https://causeline.dev/img/trace-slow.webp', name: 'trace' },
  { slug: 'ambisprout', url: 'https://ambisprout.com/', wait: 6000 },
  { slug: 'tigws', url: 'https://www.tigworldschools.com/', wait: 6000 },
  // Hero is a video: freeze it on the frame at 2s (a player holding a ball)
  { slug: 'tigmancity', url: 'https://www.tigmancity.com/', wait: 6000, videoAt: 2 },
  { slug: 'hatchlab', url: 'https://hatchlabinnovations.com/', wait: 5000 },
]

const only = process.argv.slice(2)

async function saveWebp(buffer, file, width) {
  await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(file)
  const { size } = await import('node:fs').then((fs) => fs.promises.stat(file))
  console.log(`  ${path.relative(process.cwd(), file)}  ${(size / 1024).toFixed(0)} KB`)
}

async function shoot(browser, { url, wait, videoAt }, viewport, fullPage = false) {
  const page = await browser.newPage()
  try {
    // Some embeds (Instagram) refuse to render for a "HeadlessChrome" user agent
    await page.setUserAgent(viewport.isMobile ? PHONE_UA : (await browser.userAgent()).replace('HeadlessChrome', 'Chrome'))
    await page.setViewport(viewport)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
    await new Promise((r) => setTimeout(r, wait))
    if (!fullPage && videoAt != null) await freeze(page, videoAt) // same hero frame as the desktop shot
    return fullPage ? await stitchedShot(page, viewport, videoAt) : await page.screenshot({ type: 'png' })
  } finally {
    await page.close().catch(() => {})
  }
}

// Whole page, one screen at a time. A single fullPage shot leaves sections blank on sites whose
// content reveals on scroll (and hides again off-screen), so each screen is shot while in view.
// 1. A first pass scrolls through and waits on every screen, so lazy images, embeds and maps load.
// 2. Then the page is frozen (timers cleared, videos paused) so auto-advancing carousels can't move
//    between two screens and leave a seam where a section crosses the join.
// 3. The second pass shoots. Fixed and sticky bars are hidden after the first screen so they don't
//    repeat down the page. Third-party embeds keep playing inside their own frames (Instagram reels
//    can't be paused from the page) and images can be mid-reveal, so a screen never cuts through an
//    embed, image or video: if one would cross the bottom edge, the next screen starts just above
//    it instead, and is drawn over the overlap.
async function stitchedShot(page, viewport, videoAt) {
  const vh = viewport.height
  const scrollTo = async (y) => {
    // 'instant' overrides a site's scroll-behavior: smooth, which would leave scrollY mid-animation
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y)
    await new Promise((r) => setTimeout(r, 1200))
  }

  for (let y = 0; y < (await pageHeight(page)); y += vh) {
    await scrollTo(y)
    await settle(page, { embeds: true })
  }
  await scrollTo(0)
  await freeze(page, videoAt)

  const height = await pageHeight(page)
  const tiles = []
  for (let y = 0; y < height; ) {
    await scrollTo(y)
    await settle(page, { embeds: false })
    const top = await page.evaluate(() => window.scrollY) // the last screen stops short at the bottom
    tiles.push({ input: await page.screenshot({ type: 'png' }), top })
    const cut = await page.evaluate(
      (edge) =>
        // Embeds keep playing and images may still be mid-reveal, so neither is split across two screens
        [...document.querySelectorAll('iframe, img, video')]
          .map((f) => {
            const r = f.getBoundingClientRect()
            return { top: r.top + scrollY, bottom: r.bottom + scrollY, h: r.height }
          })
          .filter((f) => f.h > 0 && f.h < innerHeight - 80 && f.top < edge && f.bottom > edge)
          .reduce((min, f) => Math.min(min, f.top), Infinity),
      top + vh,
    )
    // Only move the join for something that starts well down this screen; one that starts near its
    // top (a full-height hero) is split as usual, or the next screen would be drawn over this one
    y = Number.isFinite(cut) && cut - 40 > top + vh / 4 ? cut - 40 : top + vh
    if (tiles.length === 1) {
      await page.evaluate(() => {
        for (const el of document.querySelectorAll('body *')) {
          const { position } = getComputedStyle(el)
          if (position === 'fixed' || position === 'sticky') el.style.visibility = 'hidden'
        }
      })
    }
  }
  const total = tiles.at(-1).top + vh
  return sharp({ create: { width: viewport.width, height: total, channels: 3, background: '#ffffff' } })
    .composite(tiles.map((t) => ({ input: t.input, left: 0, top: t.top })))
    .png()
    .toBuffer()
}

// Before shooting a screen: wait for the images on it to finish loading, and give third-party
// embeds on it (Instagram posts) time to load their content. Capped so one slow asset can't hang the run.
const IMAGE_WAIT_MAX = 8000
const EMBED_WAIT = 10000

const pageHeight = (page) => page.evaluate(() => document.documentElement.scrollHeight)

// Stop everything that changes on its own: JS timers (carousel autoplay) and videos. Videos are
// held on the frame at `videoAt` seconds when given, otherwise wherever they are.
async function freeze(page, videoAt) {
  await page.evaluate(async (videoAt) => {
    const last = setTimeout(() => {}, 0)
    for (let id = 0; id <= last; id++) {
      clearTimeout(id)
      clearInterval(id)
    }
    await Promise.all(
      [...document.querySelectorAll('video')].map(
        (v) =>
          new Promise((done) => {
            v.pause()
            if (videoAt == null || v.readyState < 1) return done()
            v.onseeked = () => done()
            v.currentTime = Math.min(videoAt, v.duration - 0.1)
            setTimeout(done, 5000) // don't hang on a video that never seeks
          }),
      ),
    )
  }, videoAt ?? null)
  await new Promise((r) => setTimeout(r, 500))
}

async function settle(page, { embeds }) {
  // Only images that are visible count: hidden ones (an unused logo variant, a closed menu) may
  // never load and would hold up every screen
  await page
    .waitForFunction(
      () =>
        [...document.images].every((img) => {
          const r = img.getBoundingClientRect()
          const onScreen = r.bottom > 0 && r.top < innerHeight && r.width > 0 && img.checkVisibility({ visibilityProperty: true, opacityProperty: true })
          return !onScreen || img.complete
        }),
      { timeout: IMAGE_WAIT_MAX, polling: 250 },
    )
    .catch(() => console.log('  (some images on this screen were still loading)'))

  if (!embeds) return
  const embedOnScreen = await page.evaluate(() =>
    [...document.querySelectorAll('.instagram-media, iframe[src*="instagram.com"], iframe[src*="google.com/maps"]')].some((el) => {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < innerHeight
    }),
  )
  if (embedOnScreen) await new Promise((r) => setTimeout(r, EMBED_WAIT))
}

const launch = () =>
  puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    // Cross-site iframes (Instagram reels) can crash to a grey "sad face" in headless Chrome when
    // GPU compositing is on; software rendering keeps them stable.
    args: ['--hide-scrollbars', '--disable-gpu'],
    protocolTimeout: 60000,
  })

// Headless Chrome now and then stalls on a heavy page (several playing reels). A stalled capture is
// retried from scratch in a fresh browser rather than failing the whole run.
const ATTEMPTS = 3

async function capture(t, dir) {
  // Whole page, for the screenshot that scrolls inside the browser frame. 1080px wide keeps it
  // sharp in the ~700px frame on retina screens and well under WebP's 16,383px height limit.
  // The first-screen shot is cut from the same capture, so the swap between them is seamless
  // even on sites with a rotating hero. Nothing is written until all three shots succeed.
  const full = await shoot(browser, t, DESKTOP, true)
  const phone = await shoot(browser, t, PHONE)
  const first = await sharp(full).extract({ left: 0, top: 0, width: DESKTOP.width, height: DESKTOP.height }).png().toBuffer()
  await saveWebp(first, path.join(dir, 'desktop.webp'), 1440)
  await saveWebp(full, path.join(dir, 'full.webp'), 1080)
  await saveWebp(phone, path.join(dir, 'phone.webp'), 600)
}

let browser = await launch()
try {
  for (const t of targets) {
    if (only.length && !only.includes(t.slug)) continue
    const dir = path.join(OUT, t.slug)
    await mkdir(dir, { recursive: true })
    console.log(t.slug)

    if (t.asset) {
      const res = await fetch(t.asset)
      if (!res.ok) throw new Error(`${t.asset} -> ${res.status}`)
      await saveWebp(Buffer.from(await res.arrayBuffer()), path.join(dir, `${t.name}.webp`), 1600)
      continue
    }

    for (let attempt = 1; ; attempt++) {
      try {
        await capture(t, dir)
        break
      } catch (err) {
        if (attempt === ATTEMPTS) throw err
        console.log(`  attempt ${attempt} failed (${err.message.split('.')[0]}); retrying in a fresh browser`)
        await browser.close().catch(() => {})
        browser = await launch()
      }
    }
  }
} finally {
  await browser.close()
}
