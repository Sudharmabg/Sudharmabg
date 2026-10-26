// Injects server-rendered HTML into dist/: the homepage into dist/index.html and each project page
// into dist/projects/<slug>/index.html (Vercel serves those files before the SPA rewrite), then
// removes the SSR bundle. Runs as the last step of `npm run build`; needs no browser, so it works on Vercel.
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { projectsInOrder } from '../src/data/projects.js'

const SITE = 'https://sudharmabg.vercel.app'
const serverEntry = path.resolve('dist-server/entry-server.js')
const indexFile = path.resolve('dist/index.html')

const { render } = await import(pathToFileURL(serverEntry).href)
const template = await fs.readFile(indexFile, 'utf8')
if (!template.includes('<!--app-html-->')) throw new Error('dist/index.html is missing the <!--app-html--> marker')

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

async function write(url, file, head) {
  let html = template.replace('<!--app-html-->', render(url))
  if (head) {
    // Swap the homepage's title, description and canonical for the page's own
    html = html
      .replace(/<title>[^<]*<\/title>/, `<title>${escape(head.title)}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, `$1${escape(head.description)}"`)
      .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${SITE}${url}"`)
  }
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, html)
  console.log(`prerendered ${url} → ${path.relative(process.cwd(), file)}`)
}

for (const p of projectsInOrder) {
  const name = p.titleAccent ? `${p.title}${p.titleSpaced ? ' ' : ''}${p.titleAccent}` : p.title
  await write(`/projects/${p.slug}`, path.resolve(`dist/projects/${p.slug}/index.html`), {
    title: `${name} — Sudharma BG`,
    description: p.summary,
  })
}
// Homepage last: it overwrites the template file the others were built from
await write('/', indexFile)

await fs.rm(path.resolve('dist-server'), { recursive: true, force: true })
