// Renders the social preview (public/og.png, 1200×630) and iOS icon (public/apple-touch-icon.png)
// from HTML in the site's style. Re-run after changing name/title: npm run og
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const fonts = `
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@600&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@500&display=swap">`

const base = `* { margin: 0; box-sizing: border-box } body { background: #0b0b0b; color: #f2f2f2; font-family: Inter, sans-serif }`

const og = `<!doctype html><html><head>${fonts}<style>${base}
  .card { position: relative; width: 1200px; height: 630px; padding: 72px 80px; overflow: hidden;
    background-image: radial-gradient(rgb(242 242 242 / .09) 1.2px, transparent 1.2px); background-size: 26px 26px }
  .glow { position: absolute; right: -120px; top: -80px; width: 620px; height: 620px; border-radius: 50%;
    background: radial-gradient(circle, rgb(198 255 61 / .16), transparent 65%) }
  .fade { position: absolute; inset: 0; background: radial-gradient(ellipse 70% 80% at 25% 60%, #0b0b0b 35%, transparent 80%) }
  .content { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: space-between }
  .badge { display: inline-flex; align-items: center; gap: 12px; padding: 10px 18px; border-radius: 999px;
    border: 1px solid rgb(198 255 61 / .35); background: rgb(198 255 61 / .07); font-size: 20px; font-weight: 500 }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: #c6ff3d; box-shadow: 0 0 14px #c6ff3d }
  h1 { font-family: 'Clash Display', sans-serif; font-weight: 600; font-size: 132px; line-height: .86; letter-spacing: -.035em; text-transform: uppercase }
  .role { margin-top: 26px; font-family: 'Clash Display', sans-serif; font-weight: 600; font-size: 44px; letter-spacing: -.02em; word-spacing: .12em }
  .role em { font-family: 'Instrument Serif', serif; font-weight: 400; color: #c6ff3d; letter-spacing: 0 }
  .meta { display: flex; justify-content: space-between; align-items: flex-end; font-family: 'JetBrains Mono', monospace;
    font-size: 19px; letter-spacing: .12em; text-transform: uppercase; color: #8a8a8a }
  .meta b { color: #f2f2f2; font-weight: 500 }
  .url { color: #c6ff3d }
</style></head><body><div class="card"><div class="glow"></div><div class="fade"></div><div class="content">
  <div><span class="badge"><span class="dot"></span>Available for senior roles & consulting</span></div>
  <div><h1>Sudharma<br>BG</h1><p class="role">Full Stack & AI <em>Engineer</em></p></div>
  <div class="meta"><span><b>6 years</b> · Spring Boot · React · LLMs · Bengaluru</span><span class="url">sudharmabg.vercel.app</span></div>
</div></div></body></html>`

const icon = `<!doctype html><html><head>${fonts}<style>${base}
  .icon { position: relative; width: 180px; height: 180px; display: grid; place-items: center; background: #0b0b0b }
  .c { position: absolute; width: 34px; height: 34px; border-color: #c6ff3d; border-style: solid; border-width: 0 }
  .tl { top: 30px; left: 30px; border-top-width: 6px; border-left-width: 6px }
  .tr { top: 30px; right: 30px; border-top-width: 6px; border-right-width: 6px }
  .bl { bottom: 30px; left: 30px; border-bottom-width: 6px; border-left-width: 6px }
  .br { bottom: 30px; right: 30px; border-bottom-width: 6px; border-right-width: 6px }
  .s { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 104px; line-height: 1; transform: translateY(4px) }
</style></head><body><div class="icon"><span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span class="c br"></span><span class="s">S</span></div></body></html>`

async function render(browser, html, selector, width, height, file) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  const el = await page.$(selector)
  await el.screenshot({ path: file })
  await page.close()
  console.log('  ' + path.relative(process.cwd(), file))
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
try {
  await render(browser, og, '.card', 1200, 630, path.resolve('public/og.png'))
  await render(browser, icon, '.icon', 180, 180, path.resolve('public/apple-touch-icon.png'))
} finally {
  await browser.close()
}
