/**
 * Утилита для работы с AI API (OpenAI)
 */

/**
 * Генерирует варианты названий для произведения искусства на основе изображения
 * @param {string} imageBase64 - Изображение в формате base64
 * @returns {Promise<string[]>} - Массив из 3-5 вариантов названий
 */
export async function generateTitles(imageBase64) {
  try {
    // Удаляем префикс data:image/...;base64, если он есть
    const base64Data = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64

    const response = await fetch('/api/generate-titles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Data,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.titles || []
  } catch (error) {
    console.error('Ошибка при генерации названий:', error)
    throw error
  }
}

/**
 * Генерирует описание произведения искусства на основе изображения и данных
 * @param {string} imageBase64 - Изображение в формате base64
 * @param {Object} artworkData - Данные о произведении
 * @param {string} artworkData.title - Название произведения
 * @param {string} artworkData.width - Ширина
 * @param {string} artworkData.height - Высота
 * @param {string} artworkData.technique - Техника
 * @returns {Promise<string>} - Краткое описание произведения
 */
export async function generateDescription(imageBase64, artworkData) {
  try {
    // Удаляем префикс data:image/...;base64, если он есть
    const base64Data = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64

    const response = await fetch('/api/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Data,
        artworkData,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.description || ''
  } catch (error) {
    console.error('Ошибка при генерации описания:', error)
    throw error
  }
}
