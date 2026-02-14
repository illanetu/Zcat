'use client'

import { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import ArtworkForm from './components/ArtworkForm'
import styles from './page.module.css'

export default function Home() {
  const [imageData, setImageData] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    width: '',
    height: '',
    technique: ''
  })

  const handleImageSelect = (data) => {
    setImageData(data)
  }

  const handleFormDataChange = (data) => {
    setFormData(data)
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
        
        {imageData && (
          <section className={styles.formSection}>
            <ArtworkForm 
              imageData={imageData}
              onFormDataChange={handleFormDataChange}
            />
          </section>
        )}
      </main>
    </div>
  )
}
