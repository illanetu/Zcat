'use client'

import { useTranslation } from 'react-i18next'
import styles from './DescriptionCard.module.css'

export default function DescriptionCard({ description, descriptionPoetic, isLoading, error }) {
  const { t } = useTranslation()

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
            <span>{t('description.generating')}</span>
          </div>
        </div>
      </div>
    )
  }

  const hasStandard = description && description.trim().length > 0
  const hasPoetic = descriptionPoetic && descriptionPoetic.trim().length > 0
  if (!hasStandard && !hasPoetic) {
    return null
  }

  return (
    <>
      {hasStandard && (
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{t('description.title')}</h3>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      )}
      {hasPoetic && (
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitlePoetic}>{t('description.poeticTitle')}</h3>
            <p className={styles.descriptionPoetic}>{descriptionPoetic}</p>
          </div>
        </div>
      )}
    </>
  )
}
