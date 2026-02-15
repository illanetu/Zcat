import { NextResponse } from 'next/server'

/**
 * Извлекает текст между двумя маркерами (или до конца строки, если endMarker === null)
 */
function parseSection(text, startMarker, endMarker) {
  const startIdx = text.indexOf(startMarker)
  if (startIdx === -1) return ''
  const contentStart = startIdx + startMarker.length
  const slice = text.slice(contentStart).trimStart()
  if (!endMarker) return slice.trim()
  const endIdx = slice.indexOf(endMarker)
  if (endIdx === -1) return slice.trim()
  return slice.slice(0, endIdx).trim()
}

/**
 * API Route для генерации описания произведения искусства с помощью AI
 * POST /api/generate-description
 * Возвращает: { description, descriptionPoetic }
 */
export async function POST(request) {
  try {
    const { image, artworkData } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Изображение не предоставлено' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY

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
      contextParts.push(`Размер: ${artworkData.width} × ${artworkData.height} см`)
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
          ? (process.env.OPENROUTER_MODEL || 'openai/gpt-4o')
          : 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Эксперт по искусству. Два описания в формате:

ОПИСАНИЕ:
[2–5 предложений для каталога: композиция, цвет, настроение.]

АТМОСФЕРНОЕ ОПИСАНИЕ:
[Поэтичное описание, метафоры, образный язык.]`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: contextText ? `${contextText}Опиши произведение в указанном формате.` : 'Опиши произведение в указанном формате.'
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
        max_tokens: 400,
        temperature: 0.6,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('AI API error:', errorData)
      const provider = process.env.OPENROUTER_API_KEY ? 'OpenRouter' : 'OpenAI'
      return NextResponse.json(
        { error: `Ошибка ${provider} API: ${errorData.error?.message || 'Неизвестная ошибка'}` },
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

    const description = parseSection(raw, 'ОПИСАНИЕ:', 'АТМОСФЕРНОЕ ОПИСАНИЕ:')
    const descriptionPoetic = parseSection(raw, 'АТМОСФЕРНОЕ ОПИСАНИЕ:', null)

    return NextResponse.json({
      description: description || raw,
      descriptionPoetic: descriptionPoetic || ''
    })
  } catch (error) {
    console.error('Ошибка при генерации описания:', error)
    return NextResponse.json(
      { error: error.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
