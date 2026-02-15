'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './CopyButton.module.css'

export default function CopyButton({ text, label }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const displayLabel = label ?? t('button.copy')

  const handleCopy = async () => {
    if (!text || text.trim().length === 0) return
    try {
      await navigator.clipboard.writeText(text.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Ошибка копирования:', err)
    }
  }

  const isDisabled = !text || text.trim().length === 0

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={isDisabled}
      className={`${styles.button} ${copied ? styles.copied : ''}`}
      aria-label={copied ? t('button.copied') : displayLabel}
      title={displayLabel}
    >
      <span className={styles.icon} aria-hidden="true">
        {copied ? '✓' : '⎘'}
      </span>
      <span className={styles.label}>
        {copied ? t('button.copied') : displayLabel}
      </span>
    </button>
  )
}
