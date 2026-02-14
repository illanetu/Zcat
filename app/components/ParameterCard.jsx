'use client'

import styles from './ParameterCard.module.css'

export default function ParameterCard({ title, size, technique }) {
  if (!title || !size || !technique) {
    return null
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h2 className={styles.artworkTitle}>{title}</h2>
        <p className={styles.artworkTechnique}>{technique}</p>
        <p className={styles.artworkSize}>{size}</p>
      </div>
    </div>
  )
}
