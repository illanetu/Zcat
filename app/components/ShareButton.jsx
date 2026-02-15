'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './ShareButton.module.css'

/**
 * Заглушка кнопки «Поделиться».
 * Подготовлено для будущей интеграции с Web Share API.
 */
export default function ShareButton({ title, text }) {
  const { t } = useTranslation()
  const [clicked, setClicked] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || t('card.defaultTitle'),
          text: text || '',
          url: typeof window !== 'undefined' ? window.location.href : ''
        })
        setClicked(true)
        setTimeout(() => setClicked(false), 2000)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Ошибка Web Share API:', err)
          showStubMessage()
        }
      }
    } else {
      showStubMessage()
    }
  }

  const showStubMessage = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`${styles.button} ${clicked ? styles.feedback : ''}`}
      aria-label={t('button.share')}
      title={t('button.share')}
    >
      <span className={styles.icon} aria-hidden="true">
        ↗
      </span>
      <span className={styles.label}>
        {clicked ? t('button.soon') : t('button.share')}
      </span>
    </button>
  )
}
