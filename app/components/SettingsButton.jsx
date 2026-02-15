'use client'

import { useState } from 'react'
import styles from './SettingsButton.module.css'

export default function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false)

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
        aria-label="Настройки"
        title="Настройки"
      >
        <span className={styles.icon} aria-hidden="true">
          ⚙
        </span>
        <span className={styles.label}>Настройки</span>
      </button>
      {isOpen && (
        <div
          className={styles.panel}
          role="dialog"
          aria-label="Панель настроек"
        >
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Настройки</h3>
            <button
              type="button"
              onClick={togglePanel}
              className={styles.closeButton}
              aria-label="Закрыть настройки"
            >
              ×
            </button>
          </div>
          <div className={styles.panelContent}>
            {/* Структура для будущих настроек */}
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Язык</label>
              <select className={styles.settingSelect} disabled aria-label="Выбор языка">
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
              <span className={styles.comingSoon}>Скоро</span>
            </div>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Стиль описания</label>
              <select className={styles.settingSelect} disabled aria-label="Стиль описания">
                <option value="neutral">Нейтральный</option>
                <option value="poetic">Поэтический</option>
                <option value="catalog">Каталог</option>
              </select>
              <span className={styles.comingSoon}>Скоро</span>
            </div>
            <p className={styles.stubHint}>Дополнительные настройки будут добавлены позже.</p>
          </div>
        </div>
      )}
    </div>
  )
}
