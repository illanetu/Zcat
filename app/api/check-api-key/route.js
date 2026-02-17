import { NextResponse } from 'next/server'

/**
 * GET /api/check-api-key
 * Проверяет наличие и валидность API ключа (OpenRouter или OpenAI).
 * Не возвращает сам ключ. Для отладки 401: откройте в браузере http://localhost:3000/api/check-api-key
 */
export async function GET() {
  const rawKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
  const provider = process.env.OPENROUTER_API_KEY ? 'OpenRouter' : 'OpenAI'

  if (!rawKey || typeof rawKey !== 'string') {
    return NextResponse.json({
      ok: false,
      error: 'Ключ не найден',
      hint: 'Добавьте OPENROUTER_API_KEY или OPENAI_API_KEY в .env.local и перезапустите сервер.',
    })
  }

  const apiKey = rawKey.trim()
  if (apiKey.length < 20) {
    return NextResponse.json({
      ok: false,
      error: 'Ключ слишком короткий',
      hint: 'Возможно, скопирован не полностью. Проверьте .env.local (без кавычек и пробелов).',
    })
  }

  if (provider === 'OpenRouter') {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data.error?.message || data.message || `HTTP ${res.status}`
        return NextResponse.json({
          ok: false,
          error: msg,
          hint: res.status === 401
            ? 'Ключ отклонён OpenRouter. Проверьте ключ на https://openrouter.ai/keys и перезапишите OPENROUTER_API_KEY в .env.local (без лишних пробелов и переносов).'
            : 'Перезапустите dev-сервер после изменения .env.local.',
        })
      }
      return NextResponse.json({ ok: true, provider: 'OpenRouter' })
    } catch (err) {
      return NextResponse.json({
        ok: false,
        error: err.message || 'Ошибка сети',
        hint: 'Проверьте интернет и доступность openrouter.ai',
      })
    }
  }

  return NextResponse.json({
    ok: true,
    provider: 'OpenAI',
    hint: 'Проверка только наличия ключа. Валидация OpenAI не выполняется.',
  })
}
