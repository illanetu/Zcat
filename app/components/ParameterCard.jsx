'use client'

import styles from './ParameterCard.module.css'
import { stripTitleQuotes } from '../../lib/card-utils'

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
