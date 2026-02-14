'use client'

import styles from './DescriptionCard.module.css'

export default function DescriptionCard({ description, isLoading, error }) {
  if (error) {
    return (
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.loading}>
            <div className={styles.spinner} aria-hidden="true" />
            <span>Генерация описания...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!description || description.trim().length === 0) {
    return null
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>Описание</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}
