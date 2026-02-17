import { describe, it, expect } from 'vitest'
import {
  isParameterCardReady,
  formatSize,
  stripTitleQuotes,
  buildParameterCard,
} from './card-utils'

describe('isParameterCardReady', () => {
  it('возвращает false для null/undefined', () => {
    expect(isParameterCardReady(null)).toBe(false)
    expect(isParameterCardReady(undefined)).toBe(false)
  })

  it('возвращает false при отсутствии обязательных полей', () => {
    expect(isParameterCardReady({})).toBe(false)
    expect(isParameterCardReady({ title: 'Картина', width: '50' })).toBe(false)
    expect(isParameterCardReady({
      title: 'Картина',
      width: '50',
      height: '70',
      technique: 'oil',
      material: '',
    })).toBe(false)
  })

  it('возвращает false для пустых строк после trim', () => {
    expect(isParameterCardReady({
      title: '  ',
      width: '50',
      height: '70',
      technique: 'oil',
      material: 'canvas',
    })).toBe(false)
  })

  it('возвращает true при заполненных обязательных полях', () => {
    expect(isParameterCardReady({
      title: 'Закат',
      width: '50',
      height: '70',
      technique: 'oil',
      material: 'canvas',
    })).toBe(true)
    expect(isParameterCardReady({
      title: 'A',
      author: 'Иванов',
      width: '30',
      height: '40',
      technique: 'acrylic',
      material: 'paper',
      year: '2024',
    })).toBe(true)
  })
})

describe('formatSize', () => {
  it('форматирует целые числа как "высота × ширина см"', () => {
    expect(formatSize('50', '70')).toBe('70 × 50 см')
    expect(formatSize('100', '80')).toBe('80 × 100 см')
  })

  it('форматирует дробные с одним знаком после запятой', () => {
    expect(formatSize('50.5', '70.3')).toBe('70.3 × 50.5 см')
  })

  it('при нечисловых значениях возвращает строку с сырыми значениями', () => {
    expect(formatSize('abc', '70')).toBe('70 × abc см')
    expect(formatSize('50', '')).toBe(' × 50 см')
  })
})

describe('stripTitleQuotes', () => {
  it('возвращает исходное значение для null/undefined/не-строки', () => {
    expect(stripTitleQuotes(null)).toBe(null)
    expect(stripTitleQuotes(undefined)).toBe(undefined)
    expect(stripTitleQuotes(123)).toBe(123)
  })

  it('убирает кавычки и пробелы с краёв', () => {
    expect(stripTitleQuotes('  «Название»  ')).toBe('Название')
    expect(stripTitleQuotes('"Title"')).toBe('Title')
    expect(stripTitleQuotes('\t\n  Текст  \n')).toBe('Текст')
  })

  it('не трогает содержимое внутри', () => {
    expect(stripTitleQuotes('«Слово» и «ещё»')).toBe('Слово» и «ещё')
  })

  it('возвращает пустую строку если всё — кавычки/пробелы', () => {
    expect(stripTitleQuotes('   ')).toBe('')
    expect(stripTitleQuotes('«»')).toBe('')
  })
})

describe('buildParameterCard', () => {
  it('возвращает null если данные не готовы', () => {
    expect(buildParameterCard(null)).toBe(null)
    expect(buildParameterCard({})).toBe(null)
    expect(buildParameterCard({
      title: 'X',
      width: '50',
      height: '70',
      technique: 'oil',
      material: '',
    })).toBe(null)
  })

  it('собирает объект этикетки с отформатированными полями', () => {
    const formData = {
      title: '  Закат  ',
      author: ' Иван Петров ',
      width: '50',
      height: '70',
      technique: 'Масло',
      material: 'холст',
      year: '2024',
    }
    const card = buildParameterCard(formData)
    expect(card).not.toBe(null)
    expect(card.title).toBe('Закат')
    expect(card.author).toBe('Иван Петров')
    expect(card.size).toBe('70 × 50 см')
    expect(card.techniqueAndMaterial).toBe('Масло / холст')
    expect(card.year).toBe('2024')
  })

  it('очищает кавычки с названия', () => {
    const card = buildParameterCard({
      title: ' «Осень» ',
      width: '40',
      height: '60',
      technique: 'a',
      material: 'b',
    })
    expect(card.title).toBe('Осень')
  })

  it('оставляет пустые author и year если не переданы', () => {
    const card = buildParameterCard({
      title: 'Без автора',
      width: '30',
      height: '40',
      technique: 'x',
      material: 'y',
    })
    expect(card.author).toBe('')
    expect(card.year).toBe('')
  })
})
