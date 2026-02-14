/**
 * Утилиты для работы с карточками произведений искусства
 */

/**
 * Проверяет, заполнены ли все обязательные поля для карточки параметров
 * @param {Object} formData - Данные формы
 * @param {string} formData.title - Название произведения
 * @param {string} formData.width - Ширина
 * @param {string} formData.height - Высота
 * @param {string} formData.technique - Техника
 * @returns {boolean} - true, если все поля заполнены
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
 * Собирает данные для карточки параметров
 * @param {Object} formData - Данные формы
 * @returns {Object|null} - Данные карточки или null, если не все поля заполнены
 */
export function buildParameterCard(formData) {
  if (!isParameterCardReady(formData)) {
    return null
  }
  
  return {
    title: formData.title.trim(),
    size: formatSize(formData.width, formData.height),
    technique: formData.technique.trim()
  }
}
