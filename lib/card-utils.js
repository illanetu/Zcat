/**
 * Утилиты для работы с этикетками произведений искусства
 */

/**
 * Проверяет, заполнены ли все обязательные поля для этикетки параметров
 * @param {Object} formData - Данные формы
 * @param {string} formData.title - Название произведения
 * @param {string} formData.author - Автор (необязательно)
 * @param {string} formData.width - Ширина
 * @param {string} formData.height - Высота
 * @param {string} formData.technique - Техника
 * @param {string} formData.material - Материал
 * @param {string} formData.year - Год (необязательно)
 * @returns {boolean} - true, если все обязательные поля заполнены
 */
export function isParameterCardReady(formData) {
  if (!formData) return false
  
  const { title, width, height, technique, material } = formData
  
  return !!(
    title && title.trim().length > 0 &&
    width && width.trim().length > 0 &&
    height && height.trim().length > 0 &&
    technique && technique.trim().length > 0 &&
    material && material.trim().length > 0
  )
}

/**
 * Форматирует размер произведения в читаемый формат (высота × ширина)
 * @param {string} width - Ширина в см
 * @param {string} height - Высота в см
 * @returns {string} - Отформатированный размер (например, "70 × 50 см")
 */
export function formatSize(width, height) {
  const w = parseFloat(width)
  const h = parseFloat(height)
  
  if (isNaN(w) || isNaN(h)) {
    return `${height} × ${width} см`
  }
  
  // Округляем до целых, если это целые числа, иначе до 1 знака после запятой
  const formattedWidth = Number.isInteger(w) ? w.toString() : w.toFixed(1)
  const formattedHeight = Number.isInteger(h) ? h.toString() : h.toFixed(1)
  
  return `${formattedHeight} × ${formattedWidth} см`
}

/** Символы кавычек и пробелов, которые убираем с краёв названия */
const TITLE_QUOTE_CHARS = new Set([
  ' ', '\t', '\n', '\r',
  '\u00AB', '\u00BB',           // « »
  '\u201C', '\u201D', '\u201E', '\u201F',  // “ ” „ ‟
  '\u2033', '\u2036',           // ″ ‶
  '"', '\u0022', '\uFF02'      // " " ＂
])

/** Удаляет все кавычки и пробелы с начала и конца строки (для названия). Один экземпляр « » добавляется при выводе. */
export function stripTitleQuotes(s) {
  if (!s || typeof s !== 'string') return s
  let start = 0
  let end = s.length
  while (start < end && TITLE_QUOTE_CHARS.has(s[start])) start++
  while (end > start && TITLE_QUOTE_CHARS.has(s[end - 1])) end--
  return s.slice(start, end)
}

/**
 * Собирает данные для этикетки параметров
 * @param {Object} formData - Данные формы
 * @returns {Object|null} - Данные этикетки или null, если не все обязательные поля заполнены
 */
export function buildParameterCard(formData) {
  if (!isParameterCardReady(formData)) {
    return null
  }
  
  // Форматируем технику и материал через "/"
  const techniqueAndMaterial = `${formData.technique.trim()} / ${formData.material.trim()}`

  const rawTitle = (formData.title || '').trim()
  return {
    title: stripTitleQuotes(rawTitle) || rawTitle,
    author: formData.author ? formData.author.trim() : '',
    size: formatSize(formData.width, formData.height),
    techniqueAndMaterial: techniqueAndMaterial,
    year: formData.year ? formData.year.trim() : ''
  }
}
