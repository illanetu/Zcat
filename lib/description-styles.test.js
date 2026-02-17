import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getDescriptionStyleIds,
  getDescriptionStyle,
  getDefaultStyleId,
  getPromptForStyle,
  getStoredStyleId,
  setStoredStyleId,
} from './description-styles'

describe('getDescriptionStyleIds', () => {
  it('возвращает массив id стилей', () => {
    const ids = getDescriptionStyleIds()
    expect(Array.isArray(ids)).toBe(true)
    expect(ids).toContain('catalog')
    expect(ids).toContain('poetic')
    expect(ids).toContain('neutral')
    expect(ids).toContain('brief')
  })
})

describe('getDescriptionStyle', () => {
  it('возвращает стиль по существующему id', () => {
    const style = getDescriptionStyle('catalog')
    expect(style).toBeDefined()
    expect(style.id).toBe('catalog')
    expect(style.labelKey).toBeDefined()
    expect(style.promptRu).toBeDefined()
    expect(style.promptEn).toBeDefined()
  })

  it('возвращает стиль по умолчанию (catalog) для неизвестного id', () => {
    const style = getDescriptionStyle('unknown-id')
    expect(style).toBeDefined()
    expect(style.id).toBe('catalog')
  })

  it('возвращает стиль по умолчанию для пустой строки', () => {
    const style = getDescriptionStyle('')
    expect(style.id).toBe('catalog')
  })
})

describe('getDefaultStyleId', () => {
  it('возвращает "catalog"', () => {
    expect(getDefaultStyleId()).toBe('catalog')
  })
})

describe('getPromptForStyle', () => {
  it('возвращает promptRu для locale !== "en"', () => {
    const prompt = getPromptForStyle('catalog', 'ru')
    expect(typeof prompt).toBe('string')
    expect(prompt.length).toBeGreaterThan(0)
    expect(prompt).toContain('каталога')
  })

  it('возвращает promptEn для locale "en"', () => {
    const prompt = getPromptForStyle('catalog', 'en')
    expect(typeof prompt).toBe('string')
    expect(prompt.length).toBeGreaterThan(0)
    expect(prompt.toLowerCase()).toContain('catalog')
  })

  it('для неизвестного styleId использует стиль по умолчанию', () => {
    const prompt = getPromptForStyle('unknown', 'ru')
    expect(typeof prompt).toBe('string')
    expect(prompt.length).toBeGreaterThan(0)
  })
})

describe('getStoredStyleId / setStoredStyleId', () => {
  const STORAGE_KEY = 'zcat_description_style'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('getStoredStyleId возвращает default при пустом localStorage', () => {
    expect(getStoredStyleId()).toBe('catalog')
  })

  it('setStoredStyleId сохраняет валидный id, getStoredStyleId его возвращает', () => {
    setStoredStyleId('poetic')
    expect(getStoredStyleId()).toBe('poetic')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('poetic')
  })

  it('getStoredStyleId возвращает default для невалидного значения в localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-style')
    expect(getStoredStyleId()).toBe('catalog')
  })

  it('setStoredStyleId не сохраняет невалидный id', () => {
    setStoredStyleId('invalid')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(getStoredStyleId()).toBe('catalog')
  })
})
