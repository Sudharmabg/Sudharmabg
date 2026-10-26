// Injects the server-rendered homepage into dist/index.html, then removes the SSR bundle.
// Runs as the last step of `npm run build`; needs no browser, so it works on Vercel.
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const serverEntry = path.resolve('dist-server/entry-server.js')
const indexFile = path.resolve('dist/index.html')

const { render } = await import(pathToFileURL(serverEntry).href)
const template = await fs.readFile(indexFile, 'utf8')
if (!template.includes('<!--app-html-->')) throw new Error('dist/index.html is missing the <!--app-html--> marker')

const appHtml = render('/')
await fs.writeFile(indexFile, template.replace('<!--app-html-->', appHtml))
await fs.rm(path.resolve('dist-server'), { recursive: true, force: true })

console.log(`prerendered / → dist/index.html (${(appHtml.length / 1024).toFixed(0)} KB of HTML)`)
