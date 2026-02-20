/**
 * Скачивает Roboto-Italic.ttf и создаёт lib/roboto-font-italic-base64.js для встраивания в PDF.
 * Запуск: node scripts/download-roboto-italic-font.js
 */
const fs = require('fs')
const path = require('path')
const https = require('https')

const FONT_URL = 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Italic.ttf'
const OUT_FILE = path.join(__dirname, '..', 'lib', 'roboto-font-italic-base64.js')

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return download(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

download(FONT_URL)
  .then((buffer) => {
    const base64 = buffer.toString('base64')
    const content = `/**
 * Base64 шрифта Roboto Italic (кириллица) для jsPDF. Сгенерировано scripts/download-roboto-italic-font.js
 */
export const ROBOTO_ITALIC_BASE64 = ${JSON.stringify(base64)}
`
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
    fs.writeFileSync(OUT_FILE, content, 'utf8')
    console.log('Готово: lib/roboto-font-italic-base64.js')
  })
  .catch((err) => {
    console.error('Ошибка загрузки шрифта:', err.message)
    process.exit(1)
  })
