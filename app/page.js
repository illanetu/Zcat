'use client'

import { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import styles from './page.module.css'

export default function Home() {
  const [imageData, setImageData] = useState(null)

  const handleImageSelect = (data) => {
    setImageData(data)
  }

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>Генератор карточек для каталогов и выставок</h1>
      </header>
      <main className={styles.appMain}>
        <section className={styles.uploadSection}>
          <h2 className={styles.sectionTitle}>Загрузка изображения</h2>
          <ImageUpload onImageSelect={handleImageSelect} />
        </section>
      </main>
    </div>
  )
}
