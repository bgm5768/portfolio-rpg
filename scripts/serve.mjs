import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.argv.includes('--dist') ? 'dist' : '.');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp' };
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!(path === '/' || path === '/index.html' || path.startsWith('/src/') || path.startsWith('/assets/')) || path.split('/').some(segment => segment.startsWith('.'))) { res.writeHead(404).end('Not found'); return; }
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const body = await readFile(file); res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' }); res.end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
