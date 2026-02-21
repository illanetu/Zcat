'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { DESCRIPTION_STYLES, getStoredStyleId, setStoredStyleId } from '../../lib/description-styles'
import { APP_VERSION } from '../../lib/app-info'
import styles from './SettingsButton.module.css'

export default function SettingsButton() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [descriptionStyleId, setDescriptionStyleId] = useState(getStoredStyleId)

  useEffect(() => {
    setDescriptionStyleId(getStoredStyleId())
  }, [isOpen])

  const handleLanguageChange = (e) => {
    const value = e.target.value
    i18n.changeLanguage(value)
  }

  const handleDescriptionStyleChange = (e) => {
    const value = e.target.value
    setStoredStyleId(value)
    setDescriptionStyleId(value)
  }

  const togglePanel = () => {
    setIsOpen((prev) => !prev)
    setShowAbout(false)
  }

  const openAbout = () => setShowAbout(true)
  const closeAbout = () => setShowAbout(false)

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
          {showAbout ? (
            <>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{t('settings.about')}</h3>
                <button
                  type="button"
                  onClick={closeAbout}
                  className={styles.closeButton}
                  aria-label={t('settings.back')}
                  title={t('settings.back')}
                >
                  ←
                </button>
              </div>
              <div className={styles.panelContent}>
                <p className={styles.aboutAppName}>{t('settings.appName')}</p>
                <p className={styles.aboutVersion}>{t('settings.version')} {APP_VERSION}</p>
                <p className={styles.aboutText}>{t('settings.aboutText')}</p>
              </div>
            </>
          ) : (
            <>
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
                  <select
                    className={styles.settingSelect}
                    value={descriptionStyleId}
                    onChange={handleDescriptionStyleChange}
                    aria-label={t('settings.descriptionStyle')}
                  >
                    {DESCRIPTION_STYLES.map((style) => (
                      <option key={style.id} value={style.id}>
                        {t(style.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={openAbout}
                  className={styles.aboutLink}
                  aria-label={t('settings.about')}
                >
                  {t('settings.about')}
                </button>
                <p className={styles.stubHint}>{t('settings.moreLater')}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
