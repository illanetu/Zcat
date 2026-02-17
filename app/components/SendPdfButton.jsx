'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getDescriptionStyle } from '../../lib/description-styles'
import { buildArtworkPdf, downloadPdf, isMobileDevice } from '../../lib/pdf-utils'
import styles from './SendPdfButton.module.css'

/**
 * Кнопка «Сохранить в PDF»: формирует PDF и скачивает файл.
 * На мобильных после создания PDF показывается видимая ссылка — нажатие по ней
 * считается жестом пользователя, скачивание срабатывает в Android Chrome.
 */
export default function SendPdfButton({ imageData, label, description, descriptionStyleId, filename }) {
  const { t } = useTranslation()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState(null)
  const [pdfDownloadFilename, setPdfDownloadFilename] = useState(null)

  const imageDataUrl =
    imageData?.preview ||
    (imageData?.base64 ? `data:image/jpeg;base64,${imageData.base64}` : null)

  const canSend = imageDataUrl && label && label.title
  const isMobile = typeof navigator !== 'undefined' && isMobileDevice()

  useEffect(() => {
    return () => {
      if (pdfDownloadUrl) URL.revokeObjectURL(pdfDownloadUrl)
    }
  }, [pdfDownloadUrl])

  const handleSend = async () => {
    if (!canSend) return
    setError(null)
    if (pdfDownloadUrl) {
      URL.revokeObjectURL(pdfDownloadUrl)
      setPdfDownloadUrl(null)
      setPdfDownloadFilename(null)
    }
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
      const name = filename || label.title || 'artwork'
      const result = downloadPdf(blob, name)
      if (result && isMobile) {
        setPdfDownloadUrl(result.url)
        setPdfDownloadFilename(result.filename)
      }
    } catch (err) {
      console.error('Ошибка при создании PDF:', err)
      setError(err.message || t('errors.descriptionFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <span className={styles.wrapper}>
      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend || loading}
        className={styles.button}
        aria-label={t('button.send')}
        title={t('button.send')}
      >
        <span className={styles.icon} aria-hidden="true">
          ⎘
        </span>
        <span className={styles.label}>
          {loading ? t('button.generating') : t('button.send')}
        </span>
      </button>
      {isMobile && pdfDownloadUrl && pdfDownloadFilename && (
        <a
          href={pdfDownloadUrl}
          download={pdfDownloadFilename}
          className={styles.downloadLink}
          rel="noopener noreferrer"
        >
          <span className={styles.icon} aria-hidden="true">⎘</span>
          {t('button.downloadPdf')}
        </a>
      )}
      {error && <span className={styles.error} role="alert">{error}</span>}
    </span>
  )
}
