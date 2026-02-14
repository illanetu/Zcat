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
 * @param {string} formData.year - Год (необязательно)
 * @returns {boolean} - true, если все обязательные поля заполнены
 */
export function isParameterCardReady(formData) {
  if (!formData) return false
  
  const { title, width, height, technique } = formData
  
  return (
    title && title.trim().length > 0 &&
    width && width.trim().length > 0 &&
    height && height.trim().length > 0 &&
    technique && technique.trim().length > 0
  )
}

/**
 * Форматирует размер произведения в читаемый формат
 * @param {string} width - Ширина в см
 * @param {string} height - Высота в см
 * @returns {string} - Отформатированный размер (например, "50 × 70 см")
 */
export function formatSize(width, height) {
  const w = parseFloat(width)
  const h = parseFloat(height)
  
  if (isNaN(w) || isNaN(h)) {
    return `${width} × ${height} см`
  }
  
  // Округляем до целых, если это целые числа, иначе до 1 знака после запятой
  const formattedWidth = Number.isInteger(w) ? w.toString() : w.toFixed(1)
  const formattedHeight = Number.isInteger(h) ? h.toString() : h.toFixed(1)
  
  return `${formattedWidth} × ${formattedHeight} см`
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
  let techniqueAndMaterial = formData.technique.trim()
  if (formData.material && formData.material.trim()) {
    techniqueAndMaterial = `${techniqueAndMaterial} / ${formData.material.trim()}`
  }

  return {
    title: formData.title.trim(),
    author: formData.author ? formData.author.trim() : '',
    size: formatSize(formData.width, formData.height),
    techniqueAndMaterial: techniqueAndMaterial,
    year: formData.year ? formData.year.trim() : ''
  }
}
