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
  { slug: 'hatchlab', url: 'https://hatchlabinnovations.com/', wait: 5000 },
]

const only = process.argv.slice(2)

async function saveWebp(buffer, file, width) {
  await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(file)
  const { size } = await import('node:fs').then((fs) => fs.promises.stat(file))
  console.log(`  ${path.relative(process.cwd(), file)}  ${(size / 1024).toFixed(0)} KB`)
}

async function shoot(browser, url, viewport, wait) {
  const page = await browser.newPage()
  if (viewport.isMobile) await page.setUserAgent(PHONE_UA)
  await page.setViewport(viewport)
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, wait))
  const buf = await page.screenshot({ type: 'png' })
  await page.close()
  return buf
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] })
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

    await saveWebp(await shoot(browser, t.url, DESKTOP, t.wait), path.join(dir, 'desktop.webp'), 1440)
    await saveWebp(await shoot(browser, t.url, PHONE, t.wait), path.join(dir, 'phone.webp'), 600)
  }
} finally {
  await browser.close()
}
