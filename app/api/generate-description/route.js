import { NextResponse } from 'next/server'
import { getDescriptionStyle, getPromptForStyle } from '../../../lib/description-styles'

/**
 * Извлекает текст после маркера до конца (один блок описания).
 */
function parseSection(text, startMarker) {
  const startIdx = text.indexOf(startMarker)
  if (startIdx === -1) return text.trim()
  const contentStart = startIdx + startMarker.length
  return text.slice(contentStart).trim()
}

/**
 * API Route для генерации описания произведения искусства с помощью AI
 * POST /api/generate-description
 * Body: { image, artworkData, locale, descriptionStyle }
 * Возвращает: { description, descriptionStyleId }
 */
const SECTION_MARKERS = {
  ru: 'ОПИСАНИЕ:',
  en: 'DESCRIPTION:'
}

export async function POST(request) {
  try {
    const { image, artworkData, locale = 'ru', descriptionStyle: styleId } = await request.json()
    const lang = locale === 'en' ? 'английском' : 'русском'
    const style = getDescriptionStyle(styleId)
    const stylePrompt = getPromptForStyle(style.id, locale)
    const sectionMarker = SECTION_MARKERS[locale] || SECTION_MARKERS.ru

    if (!image) {
      return NextResponse.json(
        { error: 'Изображение не предоставлено' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    const apiKey = (process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '').trim()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API ключ не настроен. Добавьте OPENROUTER_API_KEY или OPENAI_API_KEY в .env.local' },
        { status: 500 }
      )
    }

    const imageUrl = `data:image/jpeg;base64,${image}`

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }

    if (process.env.OPENROUTER_API_KEY) {
      headers['HTTP-Referer'] = process.env.OPENROUTER_REFERER_URL || 'http://localhost:3000'
      headers['X-Title'] = 'Zcat - Artwork Card Generator'
    }

    let apiUrl
    if (baseUrl.includes('openrouter.ai')) {
      apiUrl = baseUrl.endsWith('/v1')
        ? `${baseUrl}/chat/completions`
        : baseUrl.endsWith('/v1/')
          ? `${baseUrl}chat/completions`
          : `${baseUrl}/chat/completions`
    } else {
      apiUrl = baseUrl.endsWith('/v1')
        ? `${baseUrl}/chat/completions`
        : `${baseUrl}/v1/chat/completions`
    }

    const contextParts = []
    if (artworkData?.title) contextParts.push(`Название: ${artworkData.title}`)
    if (artworkData?.author) contextParts.push(`Автор: ${artworkData.author}`)
    if (artworkData?.width && artworkData?.height) {
      contextParts.push(`Размер: ${artworkData.height} × ${artworkData.width} см`)
    }
    if (artworkData?.technique) contextParts.push(`Техника: ${artworkData.technique}`)
    if (artworkData?.material) contextParts.push(`Материал: ${artworkData.material}`)
    if (artworkData?.year) contextParts.push(`Год: ${artworkData.year}`)
    const contextText = contextParts.length > 0
      ? `Контекст произведения:\n${contextParts.join('\n')}\n\n`
      : ''

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: process.env.OPENROUTER_API_KEY
          ? (process.env.OPENROUTER_MODEL || 'qwen/qwen3-vl-30b-a3b-thinking') // 'openai/gpt-4o' - платная
          : 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Эксперт по искусству. Одно описание в формате (заголовок секции пиши точно так):

${sectionMarker}
[${stylePrompt}]

Весь текст описания пиши на ${lang} языке.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: contextText ? `${contextText}Опиши произведение в указанном стиле.` : 'Опиши произведение в указанном стиле.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'low'
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.6,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('AI API error:', errorData)
      const provider = process.env.OPENROUTER_API_KEY ? 'OpenRouter' : 'OpenAI'
      const rawMessage = errorData.error?.message || 'Неизвестная ошибка'
      let userMessage = `Ошибка ${provider} API: ${rawMessage}`
      if (response.status === 401) {
        userMessage = process.env.OPENROUTER_API_KEY
          ? 'Неверный или просроченный API ключ OpenRouter. Проверьте OPENROUTER_API_KEY в .env.local и ключ на https://openrouter.ai/keys'
          : 'Неверный или просроченный API ключ. Проверьте OPENAI_API_KEY в .env.local'
      }
      return NextResponse.json(
        { error: userMessage },
        { status: response.status }
      )
    }

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content?.trim()

    if (!raw) {
      return NextResponse.json(
        { error: 'Не удалось получить описание от AI' },
        { status: 500 }
      )
    }

    const description = parseSection(raw, sectionMarker) || raw

    return NextResponse.json({
      description: description.trim(),
      descriptionStyleId: style.id
    })
  } catch (error) {
    console.error('Ошибка при генерации описания:', error)
    return NextResponse.json(
      { error: error.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
