import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { setStoredLanguage } from '../lib/storage'
import ru from './locales/ru.json'
import en from './locales/en.json'

const resources = {
  ru: { translation: ru },
  en: { translation: en }
}

// Всегда стартуем с 'ru', чтобы сервер и первый клиентский рендер совпадали (гидрация).
// Сохранённый язык подставляется в I18nProvider после mount (useEffect).
i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'ru',
  supportedLngs: ['ru', 'en'],
  lng: 'ru',
  interpolation: {
    escapeValue: false
  }
})

i18n.on('languageChanged', (lng) => {
  setStoredLanguage(lng)
})

export default i18n
