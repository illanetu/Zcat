'use client'

import { useState } from 'react'
import styles from './CopyButton.module.css'

export default function CopyButton({ text, label = 'Копировать текст' }) {
  const [copied, setCopied] = useState(false)

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
      aria-label={copied ? 'Скопировано' : label}
      title={label}
    >
      <span className={styles.icon} aria-hidden="true">
        {copied ? '✓' : '⎘'}
      </span>
      <span className={styles.label}>
        {copied ? 'Скопировано' : label}
      </span>
    </button>
  )
}
