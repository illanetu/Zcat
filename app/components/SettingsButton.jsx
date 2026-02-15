'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './SettingsButton.module.css'

export default function SettingsButton() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (e) => {
    const value = e.target.value
    i18n.changeLanguage(value)
  }

  const togglePanel = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={togglePanel}
        className={styles.button}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('settings.title')}
        title={t('settings.title')}
      >
        <span className={styles.icon} aria-hidden="true">
          ⚙
        </span>
        <span className={styles.label}>{t('settings.title')}</span>
      </button>
      {isOpen && (
        <div
          className={styles.panel}
          role="dialog"
          aria-label={t('settings.panelLabel')}
        >
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>{t('settings.title')}</h3>
            <button
              type="button"
              onClick={togglePanel}
              className={styles.closeButton}
              aria-label={t('settings.close')}
            >
              ×
            </button>
          </div>
          <div className={styles.panelContent}>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>{t('settings.language')}</label>
              <select
                className={styles.settingSelect}
                value={i18n.language}
                onChange={handleLanguageChange}
                aria-label={t('settings.languageChoice')}
              >
                <option value="ru">{t('settings.langRu')}</option>
                <option value="en">{t('settings.langEn')}</option>
              </select>
            </div>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>{t('settings.descriptionStyle')}</label>
              <select className={styles.settingSelect} disabled aria-label={t('settings.descriptionStyle')}>
                <option value="neutral">{t('settings.styleNeutral')}</option>
                <option value="poetic">{t('settings.stylePoetic')}</option>
                <option value="catalog">{t('settings.styleCatalog')}</option>
              </select>
              <span className={styles.comingSoon}>{t('button.soon')}</span>
            </div>
            <p className={styles.stubHint}>{t('settings.moreLater')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
