import './globals.css'

export const metadata = {
  title: 'Генератор карточек для каталогов',
  description: 'Генератор карточек для каталогов и выставок',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
