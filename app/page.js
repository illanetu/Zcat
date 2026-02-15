'use client'

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ImageUpload from './components/ImageUpload'
import ArtworkForm from './components/ArtworkForm'
import ParameterCard from './components/ParameterCard'
import DescriptionCard from './components/DescriptionCard'
import SettingsButton from './components/SettingsButton'
import CopyButton from './components/CopyButton'
import ShareButton from './components/ShareButton'
import { buildParameterCard } from '../lib/card-utils'
import { generateDescription } from '../lib/ai-client'
import { TECHNIQUE_KEYS, MATERIAL_KEYS } from '../lib/form-options'
import styles from './page.module.css'

export default function Home() {
  const { t, i18n } = useTranslation()
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
      setDescriptionError(t('form.errorUploadFirst'))
      return
    }
    if (!formData.title || !formData.width || !formData.height || !formData.technique || !formData.material) {
      setDescriptionError(t('errors.descriptionRequired'))
      return
    }
    setDescriptionError(null)
    setIsGeneratingDescription(true)
    setDescription('')
    setDescriptionPoetic('')
    try {
      const dataForApi = {
        ...formData,
        technique: TECHNIQUE_KEYS.includes(formData.technique) ? t(`techniques.${formData.technique}`) : formData.technique,
        material: MATERIAL_KEYS.includes(formData.material) ? t(`materials.${formData.material}`) : formData.material
      }
      const { description: d, descriptionPoetic: dp } = await generateDescription(imageData.base64, dataForApi, i18n.language)
      setDescription(d)
      setDescriptionPoetic(dp)
    } catch (err) {
      setDescriptionError(err.message || t('errors.descriptionFailed'))
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  const formDataForCard = useMemo(() => {
    const techniqueDisplay = TECHNIQUE_KEYS.includes(formData.technique)
      ? t(`techniques.${formData.technique}`)
      : formData.technique
    const materialDisplay = MATERIAL_KEYS.includes(formData.material)
      ? t(`materials.${formData.material}`)
      : formData.material
    return {
      ...formData,
      technique: techniqueDisplay,
      material: materialDisplay
    }
  }, [formData, t])

  const parameterCardData = useMemo(() => {
    return buildParameterCard(formDataForCard)
  }, [formDataForCard])

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>{t('app.title')}</h1>
        <SettingsButton />
      </header>
      <main className={styles.appMain}>
        <div className={styles.row1}>
          <section className={styles.uploadSection}>
            <h2 className={styles.sectionTitle}>{t('section.uploadImage')}</h2>
            <ImageUpload onImageSelect={handleImageSelect} />
          </section>
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>{t('section.artworkData')}</h2>
            <ArtworkForm
              imageData={imageData}
              onFormDataChange={handleFormDataChange}
              showTitle={false}
            />
          </section>
          <section className={styles.parameterSection}>
            <h2 className={styles.sectionTitle}>{t('section.label')}</h2>
            <div className={styles.parameterCardWrap}>
              {parameterCardData && (
                <ParameterCard
                  title={parameterCardData.title}
                  author={parameterCardData.author}
                  size={parameterCardData.size}
                  techniqueAndMaterial={parameterCardData.techniqueAndMaterial}
                  year={parameterCardData.year}
                />
              )}
            </div>
          </section>
          {parameterCardData && (
            <div className={styles.generateDescriptionWrap}>
              <button
                type="button"
                onClick={handleGenerateDescription}
                className={styles.generateDescriptionButton}
                disabled={!imageData?.base64 || isGeneratingDescription}
              >
                {isGeneratingDescription ? t('button.generating') : t('button.generateDescription')}
              </button>
            </div>
          )}
        </div>

        <div className={styles.row2}>
          {(description || descriptionPoetic) && (
            <div className={styles.actionsBar}>
              <CopyButton
                text={[description, descriptionPoetic].filter(Boolean).join('\n\n')}
                label={t('button.copy')}
              />
              <ShareButton
                title={formData.title || t('card.defaultTitle')}
                text={[description, descriptionPoetic].filter(Boolean).join('\n\n')}
              />
            </div>
          )}
          <div className={styles.descriptionsRow}>
            <DescriptionCard
              description={description}
              descriptionPoetic={descriptionPoetic}
              isLoading={isGeneratingDescription}
              error={descriptionError}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
