'use client'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { getStoredLanguage } from '../../lib/storage'

export default function I18nProvider({ children }) {
  useEffect(() => {
    const saved = getStoredLanguage()
    if (saved === 'ru' || saved === 'en') {
      i18n.changeLanguage(saved)
    }
    return () => {}
  }, [])

  useEffect(() => {
    const updateHtmlLang = () => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = i18n.language
      }
    }
    updateHtmlLang()
    i18n.on('languageChanged', updateHtmlLang)
    return () => i18n.off('languageChanged', updateHtmlLang)
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
