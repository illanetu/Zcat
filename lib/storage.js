/**
 * Хранилище для настроек (язык и т.д.).
 * В браузере используется localStorage (синхронный аналог AsyncStorage).
 * При запуске приложения язык загружается отсюда в i18n.
 * Для React Native можно заменить на @react-native-async-storage/async-storage.
 */
const KEY_LANGUAGE = 'zcat-language'

export function getStoredLanguage() {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(KEY_LANGUAGE)
  } catch {
    return null
  }
}

export function setStoredLanguage(lng) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY_LANGUAGE, lng)
  } catch {}
}
