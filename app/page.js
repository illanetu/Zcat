'use client'

import { useState, useMemo } from 'react'
import ImageUpload from './components/ImageUpload'
import ArtworkForm from './components/ArtworkForm'
import ParameterCard from './components/ParameterCard'
import { buildParameterCard } from '../lib/card-utils'
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

  // Формируем данные для карточки параметров
  const parameterCardData = useMemo(() => {
    return buildParameterCard(formData)
  }, [formData])

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

        {parameterCardData && (
          <section className={styles.cardsSection}>
            <h2 className={styles.sectionTitle}>Карточки</h2>
            <ParameterCard 
              title={parameterCardData.title}
              size={parameterCardData.size}
              technique={parameterCardData.technique}
            />
          </section>
        )}
      </main>
    </div>
  )
}
