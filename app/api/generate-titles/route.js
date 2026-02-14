import { NextResponse } from 'next/server'

/**
 * API Route для генерации названий произведений искусства с помощью AI
 * POST /api/generate-titles
 */
export async function POST(request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Изображение не предоставлено' },
        { status: 400 }
      )
    }

    // Определение API провайдера (OpenRouter или OpenAI)
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
    
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
        // Используем модель в зависимости от провайдера
        model: process.env.OPENROUTER_API_KEY 
          ? (process.env.OPENROUTER_MODEL || 'openai/gpt-4o')
          : 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Ты эксперт по искусству. Твоя задача - предложить краткие, выразительные названия для произведений искусства на основе изображения. Названия должны быть лаконичными (1-2 слова), отражать эмоциональную суть произведения и быть подходящими для каталогов галерей. Отвечай только списком названий, по одному на строку, без нумерации и дополнительных комментариев.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Проанализируй это изображение произведения искусства и предложи 5 кратких названий (по 1-2 слова каждое), которые подходят для каталога галереи. Названия должны быть выразительными и отражать эмоциональную суть произведения.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
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
      return NextResponse.json(
        { error: `Ошибка ${provider} API: ${errorData.error?.message || 'Неизвестная ошибка'}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'Не удалось получить ответ от AI' },
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
