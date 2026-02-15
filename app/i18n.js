import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getStoredLanguage, setStoredLanguage } from '../lib/storage'
import ru from './locales/ru.json'
import en from './locales/en.json'

const resources = {
  ru: { translation: ru },
  en: { translation: en }
}

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'ru'
  const stored = getStoredLanguage()
  return stored === 'en' || stored === 'ru' ? stored : 'ru'
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'ru',
  supportedLngs: ['ru', 'en'],
  lng: typeof window !== 'undefined' ? getInitialLanguage() : 'ru',
  interpolation: {
    escapeValue: false
  }
})

i18n.on('languageChanged', (lng) => {
  setStoredLanguage(lng)
})

export default i18n
