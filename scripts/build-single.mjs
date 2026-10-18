/**
 * Tek dosya build: dist/index.html içine CSS'i, JS paketini (base64 + UTF-8 çözümü) ve
 * /brand/* varlıklarını (data URI haritası) gömer. Çıktı çift tıklayınca (file://) açılır.
 *
 *   node scripts/build-single.mjs [hafif-varlik-dizini] [cikti.html]
 *   (hafif dizinde aynı adlı dosya varsa dist/brand yerine o kullanılır)
 *
 * Not: String.replace yerine split/join kullanılır; JS içindeki "$&" gibi diziler
 * aksi halde HTML'i bozar. JS raw gömülmez (<!-- ve <script dizileri HTML ayrıştırıcıyı bozar).
 */
import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const light = process.argv[2] ? path.resolve(process.argv[2]) : null
const out = path.resolve(process.argv[3] || 'nialora.html')

const mime = { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', mp4: 'video/mp4' }
const pick = (rel) => {
  const clean = rel.split('?')[0]
  const alt = light && path.join(light, path.basename(clean))
  return alt && fs.existsSync(alt) ? alt : path.join(dist, clean)
}
const dataUri = (rel) => {
  const file = pick(rel)
  const ext = file.split('.').pop().toLowerCase()
  return `data:${mime[ext]};base64,${fs.readFileSync(file).toString('base64')}`
}
const splitJoin = (s, a, b) => s.split(a).join(b)

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

// CSS → <style>
const cssTag = html.match(/<link[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]+)"[^>]*>/)
if (!cssTag) throw new Error('css link bulunamadı')
html = splitJoin(html, cssTag[0], `<style>${fs.readFileSync(path.join(dist, cssTag[1]), 'utf8')}</style>`)

// JS paketi
const jsTag = html.match(/<script type="module"[^>]*src="(\/assets\/[^"]+)"[^>]*><\/script>/)
if (!jsTag) throw new Error('bundle script bulunamadı')
let js = fs.readFileSync(path.join(dist, jsTag[1]), 'utf8')

// "/brand/x" | '/brand/x' | `/brand/x` sabitleri → __NIALORA_ASSETS__["/brand/x"]
const refs = [...new Set([...js.matchAll(/(["'`])\/brand\/[\w.-]+\1/g)].map((m) => m[0]))]
const assets = {}
const sizes = []
for (const quoted of refs) {
  const ref = quoted.slice(1, -1)
  if (!assets[ref]) {
    assets[ref] = dataUri(ref)
    sizes.push([ref, Math.round(assets[ref].length / 1024)])
  }
  js = splitJoin(js, quoted, `__NIALORA_ASSETS__[${JSON.stringify(ref)}]`)
}
if (!refs.length) throw new Error('pakette /brand/ referansı bulunamadı')
// HTML içindeki /brand/* (preload vb.) → kaldır/çevir
html = html.replace(/\s*<link rel="preload" as="image"[^>]*>/, '')
// (JSON-LD içindeki https://nialora.com/brand/… mutlak URL'lere dokunma)
html = html.replace(/(?<![\w.])\/brand\/[\w.-]+/g, (m) => dataUri(m))
// ikonlar
html = html.replace(/href="\/favicon\.svg[^"]*"/, () => `href="${dataUri('/favicon.svg')}"`)
html = html.replace(/href="\/apple-touch-icon\.png[^"]*"/, () => `href="${dataUri('/apple-touch-icon.png')}"`)
// Varlık haritası (base64 → '<' içermez) + JS (UTF-8 → base64, çalışma anında çözülür)
const assetsTag = `<script>window.__NIALORA_ASSETS__=${JSON.stringify(assets)}</script>`
const jsB64 = Buffer.from(js, 'utf8').toString('base64')
// Vite script'i <head>'e koyar; klasik script DOM hazır olmadan çalışmasın
const runnerTag = `<script>(function(){function run(){var b=atob("${jsB64}");var u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);(0,eval)(new TextDecoder().decode(u))}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run()})()</script>`
html = splitJoin(html, jsTag[0], assetsTag + runnerTag)
html = html.replace(/ crossorigin(="[^"]*")?/g, '')

fs.writeFileSync(out, html)
const mb = (fs.statSync(out).size / 1048576).toFixed(1)
console.log(`${out} → ${mb} MB  (js ${Math.round(js.length / 1024)} KB, ${refs.length} varlık)`)
for (const [r, kb] of sizes.sort((a, b) => b[1] - a[1])) console.log(`  ${r} ${kb} KB`)
