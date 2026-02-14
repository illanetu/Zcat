'use client'

import styles from './ParameterCard.module.css'

export default function ParameterCard({ title, author, size, technique, year }) {
  if (!title || !size || !technique) {
    return null
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h2 className={styles.artworkTitle}>{title}</h2>
        {author && <p className={styles.artworkAuthor}>{author}</p>}
        <p className={styles.artworkTechnique}>{technique}</p>
        <p className={styles.artworkSize}>{size}</p>
        {year && <p className={styles.artworkYear}>{year}</p>}
      </div>
    </div>
  )
}
