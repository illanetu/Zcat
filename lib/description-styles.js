/**
 * Стили описания произведения искусства для генерации.
 * Используются в настройках и в API generate-description.
 */

const STORAGE_KEY = 'zcat_description_style'
const DEFAULT_STYLE_ID = 'catalog'

/** Подсказки для AI (русский и английский) */
const DESCRIPTION_STYLES = [
  {
    id: 'catalog',
    labelKey: 'settings.styleCatalog',
    promptRu: 'Лаконичное описание для каталога галереи, 2–5 предложений. Стиль нейтральный, профессиональный. Композиция, цвет, настроение.',
    promptEn: 'Concise catalog description, 2–5 sentences. Neutral, professional style. Composition, color, mood.',
  },
  {
    id: 'poetic',
    labelKey: 'settings.stylePoetic',
    promptRu: 'Атмосферное, поэтичное, литературное описание. 2–5 предложений. Образный язык, метафоры, настроение — как в тексте для альбома или эссе об искусстве.',
    promptEn: 'Atmospheric, poetic, literary description. 2–5 sentences. Figurative language, metaphors, mood — as in an art album or essay.',
  },
  {
    id: 'neutral',
    labelKey: 'settings.styleNeutral',
    promptRu: 'Нейтральное описание, 2–4 предложения. Сухой профессиональный тон, факты о композиции и технике без оценочных эпитетов.',
    promptEn: 'Neutral description, 2–4 sentences. Dry professional tone, facts about composition and technique without evaluative language.',
  },
  {
    id: 'brief',
    labelKey: 'settings.styleBrief',
    promptRu: 'Очень краткое описание: 1–2 предложения. Только суть — что изображено, ключевые формальные признаки.',
    promptEn: 'Very brief description: 1–2 sentences. Only the essence — what is depicted, key formal features.',
  },
  {
    id: 'academic',
    labelKey: 'settings.styleAcademic',
    promptRu: 'Академическое, искусствоведческое описание. 3–5 предложений. Термины, анализ композиции и колорита, контекст техники и материала.',
    promptEn: 'Academic, art-historical description. 3–5 sentences. Terminology, analysis of composition and color, context of technique and material.',
  },
  {
    id: 'emotional',
    labelKey: 'settings.styleEmotional',
    promptRu: 'Эмоциональное описание, 2–4 предложения. Акцент на настроении и впечатлении зрителя, образные сравнения, без сухого каталога.',
    promptEn: 'Emotional description, 2–4 sentences. Focus on mood and viewer impression, figurative comparisons, not dry catalog style.',
  },
]

export function getDescriptionStyleIds() {
  return DESCRIPTION_STYLES.map((s) => s.id)
}

export function getDescriptionStyle(styleId) {
  return DESCRIPTION_STYLES.find((s) => s.id === styleId) || DESCRIPTION_STYLES.find((s) => s.id === DEFAULT_STYLE_ID)
}

export function getDefaultStyleId() {
  return DEFAULT_STYLE_ID
}

export function getStoredStyleId() {
  if (typeof window === 'undefined') return DEFAULT_STYLE_ID
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && DESCRIPTION_STYLES.some((s) => s.id === stored)) return stored
  } catch (_) {}
  return DEFAULT_STYLE_ID
}

export function setStoredStyleId(styleId) {
  if (typeof window === 'undefined') return
  try {
    if (DESCRIPTION_STYLES.some((s) => s.id === styleId)) {
      localStorage.setItem(STORAGE_KEY, styleId)
    }
  } catch (_) {}
}

export function getPromptForStyle(styleId, locale) {
  const style = getDescriptionStyle(styleId)
  return locale === 'en' ? style.promptEn : style.promptRu
}

export { DESCRIPTION_STYLES }
