'use client'

import { useState, useMemo } from 'react'
import ImageUpload from './components/ImageUpload'
import ArtworkForm from './components/ArtworkForm'
import ParameterCard from './components/ParameterCard'
import DescriptionCard from './components/DescriptionCard'
import { buildParameterCard } from '../lib/card-utils'
import { generateDescription } from '../lib/ai-client'
import styles from './page.module.css'

export default function Home() {
  const [imageData, setImageData] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    width: '',
    height: '',
    technique: '',
    material: '',
    year: ''
  })

  const handleImageSelect = (data) => {
    setImageData(data)
  }

  const handleFormDataChange = (data) => {
    setFormData(data)
  }

  const [description, setDescription] = useState('')
  const [descriptionPoetic, setDescriptionPoetic] = useState('')
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [descriptionError, setDescriptionError] = useState(null)

  const handleGenerateDescription = async () => {
    if (!imageData?.base64) {
      setDescriptionError('Сначала загрузите изображение')
      return
    }
    if (!formData.title || !formData.width || !formData.height || !formData.technique) {
      setDescriptionError('Заполните обязательные поля: название, размер, техника')
      return
    }
    setDescriptionError(null)
    setIsGeneratingDescription(true)
    setDescription('')
    setDescriptionPoetic('')
    try {
      const { description: d, descriptionPoetic: dp } = await generateDescription(imageData.base64, formData)
      setDescription(d)
      setDescriptionPoetic(dp)
    } catch (err) {
      setDescriptionError(err.message || 'Не удалось сгенерировать описание')
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  // Формируем данные для этикетки параметров
  const parameterCardData = useMemo(() => {
    return buildParameterCard(formData)
  }, [formData])

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>Генератор описания для каталогов и выставок</h1>
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
            <h2 className={styles.sectionTitle}>Этикетка</h2>
            <ParameterCard 
              title={parameterCardData.title}
              author={parameterCardData.author}
              size={parameterCardData.size}
              techniqueAndMaterial={parameterCardData.techniqueAndMaterial}
              year={parameterCardData.year}
            />
            <div className={styles.descriptionBlock}>
              <button
                type="button"
                onClick={handleGenerateDescription}
                className={styles.generateDescriptionButton}
                disabled={!imageData?.base64 || isGeneratingDescription}
              >
                {isGeneratingDescription ? 'Генерация...' : 'Сгенерировать описание'}
              </button>
              <DescriptionCard
                description={description}
                descriptionPoetic={descriptionPoetic}
                isLoading={isGeneratingDescription}
                error={descriptionError}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
