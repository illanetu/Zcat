'use client'

import styles from './ParameterCard.module.css'

export default function ParameterCard({ title, author, size, techniqueAndMaterial, year }) {
  if (!title || !size || !techniqueAndMaterial) {
    return null
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        {author && <p className={styles.artworkAuthor}>{author}</p>}
        <h2 className={styles.artworkTitle}>{title}</h2>
        <p className={styles.artworkTechnique}>{techniqueAndMaterial}</p>
        <p className={styles.artworkSize}>{size}</p>
        {year && <p className={styles.artworkYear}>{year}</p>}
      </div>
    </div>
  )
}
