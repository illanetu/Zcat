'use client'

import { useTranslation } from 'react-i18next'
import { getDescriptionStyle } from '../../lib/description-styles'
import styles from './DescriptionCard.module.css'

export default function DescriptionCard({ description, descriptionStyleId, isLoading, error }) {
  const { t } = useTranslation()
  const style = descriptionStyleId ? getDescriptionStyle(descriptionStyleId) : null
  const titleNode = style
    ? <>{t('description.title')} ({t('description.styleLabel')} <em>{t(style.labelKey)}</em>)</>
    : t('description.title')

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

  if (!description || !description.trim()) {
    return null
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{titleNode}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}
