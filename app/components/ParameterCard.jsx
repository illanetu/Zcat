'use client'

import styles from './ParameterCard.module.css'

export default function ParameterCard({ title, author, size, techniqueAndMaterial, year }) {
  if (!title || !size || !techniqueAndMaterial) {
    return null
  }

  const hasYear = year && year.trim().length > 0
  const hasAuthor = author && author.trim().length > 0

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        {hasAuthor && <p className={styles.artworkAuthor}>{author}</p>}
        <h2 className={styles.artworkTitle}>«{String(title)
          .replace(/^[\s\u00AB\u00BB\u201C\u201D\u201E\u201F""]+/, '')
          .replace(/[\s\u00AB\u00BB\u201C\u201D\u201E\u201F""]+$/, '')
          .trim()}»</h2>
        <p className={styles.artworkTechnique}>{techniqueAndMaterial}</p>
        <p className={styles.artworkSize}>{size}</p>
        {hasYear && <p className={styles.artworkYear}>{year}</p>}
      </div>
    </div>
  )
}
