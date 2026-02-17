import './globals.css'
import I18nProvider from './components/I18nProvider'

export const metadata = {
  title: 'Генератор описания для каталогов',
  description: 'Генератор описания для каталогов и выставок',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}
