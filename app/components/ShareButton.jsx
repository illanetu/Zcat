'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDescriptionStyle } from '../../lib/description-styles'
import { buildArtworkPdf } from '../../lib/pdf-utils'
import styles from './ShareButton.module.css'

/**
 * Кнопка «Поделиться»: формирует тот же PDF, что и «Сохранить в PDF»,
 * и отправляет его через Web Share API (без ссылки на приложение).
 */
export default function ShareButton({ imageData, label, description, descriptionStyleId, filename }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(false)
  const [error, setError] = useState(null)

  const imageDataUrl =
    imageData?.preview ||
    (imageData?.base64 ? `data:image/jpeg;base64,${imageData.base64}` : null)

  const canShare = imageDataUrl && label && label.title

  const handleShare = async () => {
    if (!canShare) return
    setError(null)
    setLoading(true)
    try {
      const style = descriptionStyleId ? getDescriptionStyle(descriptionStyleId) : null
      const descriptionTitle = style
        ? `${t('description.title')} (${t('description.styleLabel')} ${t(style.labelKey)})`
        : t('description.title')
      const blob = await buildArtworkPdf(
        imageDataUrl,
        label,
        description || '',
        descriptionTitle
      )
      const pdfFilename = filename || label.title || 'artwork'
      const safeName = `${pdfFilename.replace(/[^\w\s-]/g, '')}.pdf`
      const file = new File([blob], safeName, { type: 'application/pdf' })

      if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: pdfFilename })
        setFeedback(true)
        setTimeout(() => setFeedback(false), 2000)
      } else {
        setError(t('button.shareNotSupported') || 'Поделиться файлом недоступно')
        setTimeout(() => setError(null), 3000)
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Ошибка при шаринге:', err)
        setError(err.message || t('errors.descriptionFailed'))
        setTimeout(() => setError(null), 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <span className={styles.wrapper}>
      <button
        type="button"
        onClick={handleShare}
        disabled={!canShare || loading}
        className={`${styles.button} ${feedback ? styles.feedback : ''}`}
        aria-label={t('button.share')}
        title={t('button.share')}
      >
        <span className={styles.icon} aria-hidden="true">
          ↗
        </span>
        <span className={styles.label}>
          {loading ? t('button.generating') : feedback ? t('button.shared') : t('button.share')}
        </span>
      </button>
      {error && <span className={styles.error} role="alert">{error}</span>}
    </span>
  )
}
