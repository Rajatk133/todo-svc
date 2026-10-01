/**
 * Minimal static server for production (Heroku, or `npm start` locally).
 *
 * The app is a client-rendered SPA, so every unknown path must fall through to
 * index.html — otherwise a hard refresh on /settings would return a 404.
 */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('./dist', import.meta.url)))
const port = Number(process.env.PORT) || 5173

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
}

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])

  // Resolve inside root only, so `../` cannot escape the dist directory.
  const candidate = resolve(join(root, normalize(urlPath)))
  const isInsideRoot = candidate === root || candidate.startsWith(root + '/')

  let filePath = isInsideRoot ? candidate : join(root, 'index.html')

  if (!isInsideRoot || urlPath === '/' || !existsSync(filePath) || urlPath.endsWith('/')) {
    filePath = join(root, 'index.html')
  }

  try {
    const body = await readFile(filePath)
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': filePath.endsWith('index.html')
        ? 'no-cache'
        : 'public, max-age=31536000, immutable',
    })
    res.end(body)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Build not found. Run `npm run build` first.')
  }
})

server.listen(port, () => {
  console.log(`Serving ${root} on http://0.0.0.0:${port}`)
})