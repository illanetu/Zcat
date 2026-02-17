/**
 * Формирование PDF: превью, этикетка, описание (с поддержкой кириллицы)
 */
import { jsPDF } from 'jspdf'
import { ROBOTO_REGULAR_BASE64 } from './roboto-font-base64'
import { stripTitleQuotes } from './card-utils'

const MARGIN = 20
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
// Превью слева (45×60 мм +15%), сохраняем пропорции
const IMAGE_MAX_WIDTH = 45 * 1.15
const IMAGE_MAX_HEIGHT = 60 * 1.15
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
 * Загружает изображение и возвращает { width, height } в пикселях
 * @param {string} imageDataUrl
 * @returns {Promise<{ width: number, height: number }>}
 */
function getImageDimensions(imageDataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = imageDataUrl
  })
}

/**
 * Вычисляет размер превью в мм с сохранением пропорций (вписывается в maxW×maxH мм)
 */
function fitImageSize(imgW, imgH, maxW, maxH) {
  const aspectRatio = imgW / imgH
  if (maxW / maxH > aspectRatio) {
    return { width: maxH * aspectRatio, height: maxH }
  }
  return { width: maxW, height: maxW / aspectRatio }
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
  let labelBottom = y
  let previewWidth = IMAGE_MAX_WIDTH
  let previewHeight = IMAGE_MAX_HEIGHT

  // 1. Слева — превью (50% меньше, без искажения пропорций)
  if (imageDataUrl) {
    try {
      const format = imageDataUrl.indexOf('image/png') !== -1 ? 'PNG' : 'JPEG'
      const { width: imgW, height: imgH } = await getImageDimensions(imageDataUrl)
      const fitted = fitImageSize(imgW, imgH, IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT)
      previewWidth = fitted.width
      previewHeight = fitted.height
      doc.addImage(imageDataUrl, format, MARGIN, y, previewWidth, previewHeight, undefined, 'FAST')
    } catch (e) {
      console.warn('Не удалось вставить изображение в PDF:', e)
      previewWidth = IMAGE_MAX_WIDTH
      previewHeight = IMAGE_MAX_HEIGHT
    }
  }

  const labelLeft = MARGIN + previewWidth + 10
  // Смещение по Y: в jsPDF text(x,y) — y это базовая линия, верх текста выше; чтобы верх этикетки совпадал с верхом превью
  const textTopOffset = (TITLE_FONT_SIZE * 25.4) / 72

  // 2. Этикетка справа — выравнивание по верхнему краю с превью
  if (label && label.title) {
    let labelY = y + textTopOffset
    doc.setFontSize(TITLE_FONT_SIZE)
    doc.setFont(FONT_ID, 'normal')
    if (label.author) {
      doc.text(label.author, labelLeft, labelY)
      labelY += LINE_HEIGHT
    }
    doc.text(`«${stripTitleQuotes(label.title)}»`, labelLeft, labelY)
    labelY += LINE_HEIGHT + 2
    doc.setFontSize(LABEL_FONT_SIZE)
    if (label.techniqueAndMaterial) {
      doc.text(label.techniqueAndMaterial, labelLeft, labelY)
      labelY += LINE_HEIGHT
    }
    if (label.size) {
      doc.text(label.size, labelLeft, labelY)
      labelY += LINE_HEIGHT
    }
    if (label.year) {
      doc.text(label.year, labelLeft, labelY)
      labelY += LINE_HEIGHT
    }
    labelBottom = Math.max(y + previewHeight, labelY)
  } else {
    labelBottom = y + previewHeight
  }

  y = labelBottom + 12

  // 3. Описание (ниже) — только если есть текст описания
  if (description && description.trim()) {
    if (descriptionTitle) {
      doc.setFontSize(TITLE_FONT_SIZE)
      doc.setFont(FONT_ID, 'normal')
      doc.text(descriptionTitle, MARGIN, y)
      y += LINE_HEIGHT + 2
    }
    doc.setFontSize(BODY_FONT_SIZE)
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

export function isMobileDevice() {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}

function getSafePdfFilename(filename) {
  const name = filename && filename.trim() ? filename.replace(/[<>:"/\\|?*]/g, '_') : 'artwork'
  return name.endsWith('.pdf') ? name : `${name}.pdf`
}

/**
 * Скачивает PDF с предложенным именем файла.
 * На мобильных программный a.click() после async часто блокируется, поэтому
 * открываем PDF в новой вкладке — пользователь может сохранить из меню браузера.
 * @param {Blob} blob - PDF Blob
 * @param {string} filename - имя файла (без расширения или с .pdf)
 */
export function downloadPdf(blob, filename) {
  const withExt = getSafePdfFilename(filename)
  const url = URL.createObjectURL(blob)

  if (isMobileDevice()) {
    // На мобильных не вызываем программное скачивание здесь — вызывающий компонент
    // покажет видимую ссылку для нажатия (реальный жест пользователя).
    return { url, filename: withExt }
  }

  const a = document.createElement('a')
  a.href = url
  a.download = withExt
  a.style.display = 'none'
  a.setAttribute('rel', 'noopener noreferrer')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return null
}
