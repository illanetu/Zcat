/**
 * Формирование PDF: превью, этикетка, описание (с поддержкой кириллицы)
 */
import { jsPDF } from 'jspdf'
import { ROBOTO_REGULAR_BASE64 } from './roboto-font-base64'

const MARGIN = 20
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const IMAGE_MAX_WIDTH = 120
const IMAGE_MAX_HEIGHT = 160
const LINE_HEIGHT = 6
const TITLE_FONT_SIZE = 14
const BODY_FONT_SIZE = 11
const LABEL_FONT_SIZE = 10

const FONT_VFS_NAME = 'Roboto-Regular.ttf'
const FONT_ID = 'Roboto'

/**
 * Возвращает base64 шрифта с кириллицей (встроенный Roboto, без загрузки по сети)
 * @returns {Promise<string>} - base64 шрифта
 */
export async function loadCyrillicFont() {
  return ROBOTO_REGULAR_BASE64
}

/**
 * Регистрирует шрифт с кириллицей в документе jsPDF
 * @param {import('jspdf').jsPDF} doc
 * @param {string} fontBase64
 */
function setCyrillicFont(doc, fontBase64) {
  doc.addFileToVFS(FONT_VFS_NAME, fontBase64)
  doc.addFont(FONT_VFS_NAME, FONT_ID, 'normal', undefined, 'Identity-H')
  doc.setFont(FONT_ID, 'normal')
}

/**
 * Создаёт PDF с превью, этикеткой и описанием, возвращает blob для скачивания
 * @param {string} imageDataUrl - data URL изображения (превью)
 * @param {Object} label - данные этикетки: { title, author, size, techniqueAndMaterial, year }
 * @param {string} description - текст описания
 * @param {string} descriptionTitle - заголовок блока описания (например "Описание")
 * @returns {Promise<Blob>} - PDF в виде Blob
 */
export async function buildArtworkPdf(imageDataUrl, label, description, descriptionTitle = 'Описание') {
  const fontBase64 = await loadCyrillicFont()
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  setCyrillicFont(doc, fontBase64)
  let y = MARGIN

  // 1. Превью
  if (imageDataUrl) {
    try {
      const format = imageDataUrl.indexOf('image/png') !== -1 ? 'PNG' : 'JPEG'
      const imgW = IMAGE_MAX_WIDTH
      const imgH = IMAGE_MAX_HEIGHT
      doc.addImage(imageDataUrl, format, MARGIN, y, imgW, imgH, undefined, 'FAST')
      y += imgH + 12
    } catch (e) {
      console.warn('Не удалось вставить изображение в PDF:', e)
      y += 5
    }
  }

  // 2. Этикетка
  if (label && label.title) {
    doc.setFontSize(TITLE_FONT_SIZE)
    doc.setFont(FONT_ID, 'normal')
    if (label.author) {
      doc.text(label.author, MARGIN, y)
      y += LINE_HEIGHT
    }
    doc.text(label.title, MARGIN, y)
    y += LINE_HEIGHT + 2
    doc.setFontSize(LABEL_FONT_SIZE)
    if (label.techniqueAndMaterial) {
      doc.text(label.techniqueAndMaterial, MARGIN, y)
      y += LINE_HEIGHT
    }
    if (label.size) {
      doc.text(label.size, MARGIN, y)
      y += LINE_HEIGHT
    }
    if (label.year) {
      doc.text(label.year, MARGIN, y)
      y += LINE_HEIGHT
    }
    y += 8
  }

  // 3. Описание
  if (descriptionTitle) {
    doc.setFontSize(TITLE_FONT_SIZE)
    doc.setFont(FONT_ID, 'normal')
    doc.text(descriptionTitle, MARGIN, y)
    y += LINE_HEIGHT + 2
  }
  doc.setFontSize(BODY_FONT_SIZE)
  if (description && description.trim()) {
    const lines = doc.splitTextToSize(description.trim(), CONTENT_WIDTH)
    for (const line of lines) {
      if (y > PAGE_HEIGHT - MARGIN - LINE_HEIGHT) {
        doc.addPage()
        y = MARGIN
      }
      doc.text(line, MARGIN, y)
      y += LINE_HEIGHT
    }
  }

  return doc.output('blob')
}

/**
 * Скачивает PDF с предложенным именем файла
 * @param {Blob} blob - PDF Blob
 * @param {string} filename - имя файла (без расширения или с .pdf)
 */
export function downloadPdf(blob, filename) {
  const name = filename && filename.trim() ? filename.replace(/[<>:"/\\|?*]/g, '_') : 'artwork'
  const withExt = name.endsWith('.pdf') ? name : `${name}.pdf`
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = withExt
  a.click()
  URL.revokeObjectURL(url)
}
