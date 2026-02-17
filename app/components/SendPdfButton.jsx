'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDescriptionStyle } from '../../lib/description-styles'
import { buildArtworkPdf, downloadPdf } from '../../lib/pdf-utils'
import styles from './SendPdfButton.module.css'

/**
 * Кнопка «Отправить»: формирует PDF (превью + этикетка + описание) и скачивает файл.
 */
export default function SendPdfButton({ imageData, label, description, descriptionStyleId, filename }) {
  const { t } = useTranslation()
  const [error, setError] = useState(null)

  const imageDataUrl =
    imageData?.preview ||
    (imageData?.base64 ? `data:image/jpeg;base64,${imageData.base64}` : null)

  const canSend = imageDataUrl && label && label.title

  const handleSend = async () => {
    if (!canSend) return
    setError(null)
    try {
      const descriptionTitle = descriptionStyleId
        ? t(getDescriptionStyle(descriptionStyleId).labelKey)
        : t('description.title')
      const blob = await buildArtworkPdf(
        imageDataUrl,
        label,
        description || '',
        descriptionTitle
      )
      downloadPdf(blob, filename || label.title || 'artwork')
    } catch (err) {
      console.error('Ошибка при создании PDF:', err)
      setError(err.message || t('errors.descriptionFailed'))
    }
  }

  return (
    <span className={styles.wrapper}>
      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend}
        className={styles.button}
        aria-label={t('button.send')}
        title={t('button.send')}
      >
        <span className={styles.icon} aria-hidden="true">
          ⎘
        </span>
        <span className={styles.label}>{t('button.send')}</span>
      </button>
      {error && <span className={styles.error} role="alert">{error}</span>}
    </span>
  )
}
