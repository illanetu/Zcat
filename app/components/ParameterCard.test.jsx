import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ParameterCard from './ParameterCard'

vi.mock('./ParameterCard.module.css', () => ({
  default: {
    card: 'card',
    cardContent: 'cardContent',
    artworkAuthor: 'artworkAuthor',
    artworkTitle: 'artworkTitle',
    artworkTechnique: 'artworkTechnique',
    artworkSize: 'artworkSize',
    artworkYear: 'artworkYear',
  },
}))

describe('ParameterCard', () => {
  it('возвращает null при отсутствии title', () => {
    const { container } = render(
      <ParameterCard
        title=""
        size="70 × 50 см"
        techniqueAndMaterial="Масло / холст"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('возвращает null при отсутствии size', () => {
    const { container } = render(
      <ParameterCard
        title="Закат"
        size=""
        techniqueAndMaterial="Масло / холст"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('возвращает null при отсутствии techniqueAndMaterial', () => {
    const { container } = render(
      <ParameterCard
        title="Закат"
        size="70 × 50 см"
        techniqueAndMaterial=""
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('рендерит название, размер и технику/материал', () => {
    render(
      <ParameterCard
        title="Закат"
        size="70 × 50 см"
        techniqueAndMaterial="Масло / холст"
      />
    )
    expect(screen.getByText(/Закат/)).toBeInTheDocument()
    expect(screen.getByText('70 × 50 см')).toBeInTheDocument()
    expect(screen.getByText('Масло / холст')).toBeInTheDocument()
  })

  it('оборачивает название в кавычки « »', () => {
    render(
      <ParameterCard
        title="Осень"
        size="50 × 40 см"
        techniqueAndMaterial="Акварель / бумага"
      />
    )
    expect(screen.getByText('«Осень»')).toBeInTheDocument()
  })

  it('убирает внешние кавычки с названия и выводит в « »', () => {
    render(
      <ParameterCard
        title=" «Весна» "
        size="50 × 40 см"
        techniqueAndMaterial="Акварель / бумага"
      />
    )
    expect(screen.getByText('«Весна»')).toBeInTheDocument()
  })

  it('показывает автора и год если переданы', () => {
    render(
      <ParameterCard
        title="Портрет"
        author="Иванов И. И."
        size="60 × 50 см"
        techniqueAndMaterial="Масло / холст"
        year="2023"
      />
    )
    expect(screen.getByText('Иванов И. И.')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  it('не рендерит блок автора и года если они пустые', () => {
    render(
      <ParameterCard
        title="Пейзаж"
        size="70 × 50 см"
        techniqueAndMaterial="Масло / холст"
      />
    )
    expect(screen.queryByText('2023')).not.toBeInTheDocument()
    expect(screen.getByText(/Пейзаж/)).toBeInTheDocument()
  })
})
