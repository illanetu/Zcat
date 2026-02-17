'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDescriptionStyle } from '../../lib/description-styles'
import { buildArtworkPdf, downloadPdf, isMobileDevice } from '../../lib/pdf-utils'
import styles from './SendPdfButton.module.css'

/**
 * Кнопка «Сохранить в PDF»: формирует PDF и скачивает файл.
 * На мобильных после создания PDF показывается кнопка — по нажатию вызывается
 * Web Share API (меню «Поделиться»), оттуда можно сохранить в файлы.
 */
export default function SendPdfButton({ imageData, label, description, descriptionStyleId, filename }) {
  const { t } = useTranslation()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pdfBlob, setPdfBlob] = useState(null)
  const [pdfFilename, setPdfFilename] = useState(null)

  const imageDataUrl =
    imageData?.preview ||
    (imageData?.base64 ? `data:image/jpeg;base64,${imageData.base64}` : null)

  const canSend = imageDataUrl && label && label.title
  const isMobile = typeof navigator !== 'undefined' && isMobileDevice()

  const handleSend = async () => {
    if (!canSend) return
    setError(null)
    setPdfBlob(null)
    setPdfFilename(null)
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
        setPdfBlob(blob)
        setPdfFilename(result.filename)
      }
    } catch (err) {
      console.error('Ошибка при создании PDF:', err)
      setError(err.message || t('errors.descriptionFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleMobileSave = () => {
    if (!pdfBlob || !pdfFilename) return
    const file = new File([pdfBlob], pdfFilename, { type: 'application/pdf' })
    if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
      navigator.share({ files: [file], title: pdfFilename }).catch(() => {})
    } else {
      const url = URL.createObjectURL(pdfBlob)
      window.location.href = url
      setTimeout(() => URL.revokeObjectURL(url), 60000)
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
      {isMobile && pdfBlob && pdfFilename && (
        <button
          type="button"
          onClick={handleMobileSave}
          className={styles.downloadLink}
        >
          <span className={styles.icon} aria-hidden="true">⎘</span>
          {t('button.downloadPdf')}
        </button>
      )}
      {error && <span className={styles.error} role="alert">{error}</span>}
    </span>
  )
}
