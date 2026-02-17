import { NextResponse } from 'next/server'

/**
 * API Route для генерации названий произведений искусства с помощью AI
 * POST /api/generate-titles
 */
export async function POST(request) {
  try {
    const { image, locale = 'ru' } = await request.json()
    const langInstruction = locale === 'en'
      ? 'Respond in English only.'
      : 'Отвечай только на русском.'

    if (!image) {
      return NextResponse.json(
        { error: 'Изображение не предоставлено' },
        { status: 400 }
      )
    }

    // Определение API провайдера (OpenRouter или OpenAI)
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    const apiKey = (process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '').trim()
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API ключ не настроен. Добавьте OPENROUTER_API_KEY или OPENAI_API_KEY в .env.local' },
        { status: 500 }
      )
    }

    // Подготовка изображения для Vision API
    const imageUrl = `data:image/jpeg;base64,${image}`

    // Подготовка заголовков
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }

    // Для OpenRouter добавляем заголовок HTTP-Referer (опционально)
    if (process.env.OPENROUTER_API_KEY) {
      headers['HTTP-Referer'] = process.env.OPENROUTER_REFERER_URL || 'http://localhost:3000'
      // X-Title должен быть в ASCII, используем латиницу
      headers['X-Title'] = 'Zcat - Artwork Card Generator'
    }

    // Запрос к AI API (OpenRouter или OpenAI)
    // Формируем правильный URL в зависимости от baseUrl
    let apiUrl
    if (baseUrl.includes('openrouter.ai')) {
      // OpenRouter использует формат: https://openrouter.ai/api/v1/chat/completions
      apiUrl = baseUrl.endsWith('/v1') 
        ? `${baseUrl}/chat/completions` 
        : baseUrl.endsWith('/v1/')
        ? `${baseUrl}chat/completions`
        : `${baseUrl}/chat/completions`
    } else {
      // OpenAI использует формат: https://api.openai.com/v1/chat/completions
      apiUrl = baseUrl.endsWith('/v1') 
        ? `${baseUrl}/chat/completions` 
        : `${baseUrl}/v1/chat/completions`
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        // Модель: для названий можно задать OPENROUTER_MODEL_TITLES, иначе та же что для описаний
        model: process.env.OPENROUTER_API_KEY
          ? (process.env.OPENROUTER_MODEL_TITLES || process.env.OPENROUTER_MODEL || 'qwen/qwen3-vl-30b-a3b-thinking')
          : 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Эксперт по искусству. Предложи 5 кратких названий (1-2 слова) для произведения. Стиль: символичный, эмоциональный, для каталога галереи. Только список, без нумерации. ${langInstruction}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: locale === 'en' ? '5 titles for the catalog:' : '5 названий для каталога:'
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
        max_tokens: 150,
        temperature: 0.8,
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
    const message = data.choices?.[0]?.message
    // У моделей с "thinking" текст может быть в content или в reasoning
    const content = (message?.content ?? message?.reasoning ?? '').trim()

    if (!content) {
      console.error('Generate titles: пустой ответ от AI', JSON.stringify({ choices: data.choices?.[0], usage: data.usage }))
      return NextResponse.json(
        { error: 'Не удалось получить ответ от AI. Попробуйте другое изображение или повторите позже.' },
        { status: 500 }
      )
    }

    // Парсинг ответа - извлекаем названия из текста
    const titles = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Убираем нумерацию и маркеры списка (1., 2., -, • и т.д.)
        return line.replace(/^[\d\.\-\•\*]\s*/, '').trim()
      })
      .filter(title => title.length > 0)
      .slice(0, 5) // Берем максимум 5 названий

    if (titles.length === 0) {
      return NextResponse.json(
        { error: 'Не удалось извлечь названия из ответа AI' },
        { status: 500 }
      )
    }

    return NextResponse.json({ titles })
  } catch (error) {
    console.error('Ошибка при генерации названий:', error)
    return NextResponse.json(
      { error: error.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
