import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>Генератор карточек для каталогов и выставок</h1>
      </header>
      <main className={styles.appMain}>
        <p>Приложение готово к разработке</p>
      </main>
    </div>
  )
}
