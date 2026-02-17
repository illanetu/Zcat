/**
 * Утилита для работы с AI API (OpenAI)
 */

/**
 * Генерирует варианты названий для произведения искусства на основе изображения
 * @param {string} imageBase64 - Изображение в формате base64
 * @param {string} [locale='ru'] - Язык интерфейса (ru, en) — названия будут на этом языке
 * @returns {Promise<string[]>} - Массив из 3-5 вариантов названий
 */
export async function generateTitles(imageBase64, locale = 'ru') {
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
        locale: locale === 'en' ? 'en' : 'ru',
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
 * @param {string} [locale='ru'] - Язык интерфейса (ru, en) — описание будет на этом языке
 * @param {string} [descriptionStyleId] - id стиля из lib/description-styles (если не передан, берётся из localStorage на клиенте)
 * @returns {Promise<{ description: string, descriptionStyleId: string }>} - Описание и id стиля
 */
export async function generateDescription(imageBase64, artworkData, locale = 'ru', descriptionStyleId) {
  try {
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
        locale: locale === 'en' ? 'en' : 'ru',
        descriptionStyle: descriptionStyleId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      description: data.description || '',
      descriptionStyleId: data.descriptionStyleId || '',
    }
  } catch (error) {
    console.error('Ошибка при генерации описания:', error)
    throw error
  }
}
