'use client'

import styles from './ParameterCard.module.css'
import { stripTitleQuotes } from '../../lib/card-utils'

/**
 * Карточка параметров произведения (этикетка): автор, название, техника/материал, размер, год.
 * Стиль в духе каталогов галерей. Не рендерится, если нет title, size или techniqueAndMaterial.
 * @param {Object} props
 * @param {string} props.title - Название произведения
 * @param {string} [props.author] - Автор
 * @param {string} props.size - Размер (например "70 × 50 см")
 * @param {string} props.techniqueAndMaterial - Техника и материал (например "Масло / холст")
 * @param {string} [props.year] - Год
 */
export default function ParameterCard({ title, author, size, techniqueAndMaterial, year }) {
  if (!title || !size || !techniqueAndMaterial) {
    return null
  }

  const hasYear = year && year.trim().length > 0
  const hasAuthor = author && author.trim().length > 0
  const displayTitle = stripTitleQuotes(title)

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        {hasAuthor && <p className={styles.artworkAuthor}>{author}</p>}
        <h2 className={styles.artworkTitle}>«{displayTitle}»</h2>
        <p className={styles.artworkTechnique}>{techniqueAndMaterial}</p>
        <p className={styles.artworkSize}>{size}</p>
        {hasYear && <p className={styles.artworkYear}>{year}</p>}
      </div>
    </div>
  )
}
