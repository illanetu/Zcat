'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generateTitles } from '../../lib/ai-client'
import { TECHNIQUE_KEYS, MATERIAL_KEYS } from '../../lib/form-options'
import styles from './ArtworkForm.module.css'

export default function ArtworkForm({ imageData, onFormDataChange, showTitle = true }) {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [technique, setTechnique] = useState('')
  const [customTechnique, setCustomTechnique] = useState('')
  const [material, setMaterial] = useState('')
  const [customMaterial, setCustomMaterial] = useState('')
  const [year, setYear] = useState('')
  const [errors, setErrors] = useState({})
  const [showTitleGenerator, setShowTitleGenerator] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState([])
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false)

  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = t('form.errorTitleRequired')
        } else {
          delete newErrors.title
        }
        break
      case 'width':
        if (!value.trim()) {
          newErrors.width = t('form.errorWidthRequired')
        } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          newErrors.width = t('form.errorWidthInvalid')
        } else {
          delete newErrors.width
        }
        break
      case 'height':
        if (!value.trim()) {
          newErrors.height = t('form.errorHeightRequired')
        } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          newErrors.height = t('form.errorHeightInvalid')
        } else {
          delete newErrors.height
        }
        break
      case 'technique':
        if (!value.trim()) {
          newErrors.technique = t('form.errorTechniqueRequired')
        } else {
          delete newErrors.technique
        }
        break
      case 'material':
        if (!value.trim()) {
          newErrors.material = t('form.errorMaterialRequired')
        } else {
          delete newErrors.material
        }
        break
      case 'author':
        delete newErrors.author
        break
      case 'year':
        if (value.trim().length === 0) {
          delete newErrors.year
        } else {
          const yearNum = parseInt(value)
          if (isNaN(yearNum) || yearNum < 1000 || yearNum > 9999) {
            newErrors.year = t('form.errorYearInvalid')
          } else {
            delete newErrors.year
          }
        }
        break
      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Обработка изменения полей
  const handleTitleChange = (e) => {
    const value = e.target.value
    setTitle(value)
    validateField('title', value)
    updateFormData({ title: value })
  }

  const handleAuthorChange = (e) => {
    const value = e.target.value
    setAuthor(value)
    validateField('author', value)
    updateFormData({ author: value })
  }

  const handleWidthChange = (e) => {
    const value = e.target.value
    setWidth(value)
    validateField('width', value)
    updateFormData({ width: value })
  }

  const handleHeightChange = (e) => {
    const value = e.target.value
    setHeight(value)
    validateField('height', value)
    updateFormData({ height: value })
  }

  const handleTechniqueChange = (e) => {
    const value = e.target.value
    setTechnique(value)
    setCustomTechnique('')
    validateField('technique', value === 'other' ? customTechnique : value)
    updateFormData({ technique: value === 'other' ? '' : value })
  }

  const handleCustomTechniqueChange = (e) => {
    const value = e.target.value
    setCustomTechnique(value)
    const finalTechnique = value.trim() || ''
    validateField('technique', finalTechnique)
    updateFormData({ technique: finalTechnique })
  }

  const handleMaterialChange = (e) => {
    const value = e.target.value
    setMaterial(value)
    setCustomMaterial('')
    const finalMaterial = value === 'other' ? '' : value
    validateField('material', finalMaterial)
    updateFormData({ material: finalMaterial })
  }

  const handleCustomMaterialChange = (e) => {
    const value = e.target.value
    setCustomMaterial(value)
    const finalMaterial = value.trim() || ''
    validateField('material', finalMaterial)
    updateFormData({ material: finalMaterial })
  }

  const handleYearChange = (e) => {
    const value = e.target.value
    setYear(value)
    validateField('year', value)
    updateFormData({ year: value })
  }

  // Обновление данных формы в родительском компоненте
  const updateFormData = (updates) => {
    if (onFormDataChange) {
      onFormDataChange({
        title: updates.title !== undefined ? updates.title : title,
        author: updates.author !== undefined ? updates.author : author,
        width: updates.width !== undefined ? updates.width : width,
        height: updates.height !== undefined ? updates.height : height,
        technique: updates.technique !== undefined ? updates.technique : (technique === 'other' ? customTechnique : technique),
        material: updates.material !== undefined ? updates.material : (material === 'other' ? customMaterial : material),
        year: updates.year !== undefined ? updates.year : year
      })
    }
  }

  // Валидация всей формы
  const validateForm = () => {
    const titleValid = validateField('title', title)
    const widthValid = validateField('width', width)
    const heightValid = validateField('height', height)
    const techniqueValue = technique === 'other' ? customTechnique : technique
    const techniqueValid = validateField('technique', techniqueValue)
    const materialValue = material === 'other' ? customMaterial : material
    const materialValid = validateField('material', materialValue)

    return titleValid && widthValid && heightValid && techniqueValid && materialValid
  }

  const handleGenerateTitles = async () => {
    if (!imageData) {
      setErrors({ ...errors, general: t('form.errorUploadFirst') })
      return
    }

    setIsGeneratingTitles(true)
    setShowTitleGenerator(true)
    setErrors({ ...errors, general: null })

    try {
      const titles = await generateTitles(imageData.base64)

      if (titles && titles.length > 0) {
        setGeneratedTitles(titles)
      } else {
        setErrors({ ...errors, general: t('form.errorTitlesFailed') })
        setShowTitleGenerator(false)
      }
    } catch (error) {
      console.error('Ошибка при генерации названий:', error)
      setErrors({
        ...errors,
        general: error.message || t('form.errorTitlesApi')
      })
      setShowTitleGenerator(false)
    } finally {
      setIsGeneratingTitles(false)
    }
  }

  // Выбор названия из списка
  const handleSelectTitle = (selectedTitle) => {
    setTitle(selectedTitle)
    validateField('title', selectedTitle)
    updateFormData({ title: selectedTitle })
    setShowTitleGenerator(false)
  }

  const finalTechnique = technique === 'other' ? customTechnique : technique

  return (
    <div className={styles.formContainer}>
      {showTitle && (
        <h2 className={styles.formTitle}>{t('form.artworkData')}</h2>
      )}

      {errors.general && (
        <div className={styles.errorMessage} role="alert">
          {errors.general}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="author" className={styles.label}>
          {t('form.author')}
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={handleAuthorChange}
          onBlur={() => validateField('author', author)}
          className={`${styles.input} ${errors.author ? styles.inputError : ''}`}
          placeholder={t('form.placeholderAuthor')}
        />
        {errors.author && (
          <span className={styles.fieldError}>{errors.author}</span>
        )}
      </div>

      <div className={styles.titleYearGroup}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            {t('form.title')} <span className={styles.required}>{t('form.required')}</span>
          </label>
          <div className={styles.titleInputGroup}>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={() => validateField('title', title)}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder={t('form.placeholderTitle')}
            />
            <button
              type="button"
              onClick={handleGenerateTitles}
              className={styles.generateButton}
              disabled={!imageData || isGeneratingTitles}
            >
              {isGeneratingTitles ? t('button.generating') : t('form.generateTitles')}
            </button>
          </div>
          {errors.title && (
            <span className={styles.fieldError}>{errors.title}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="year" className={styles.label}>
            Год
          </label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={handleYearChange}
            onBlur={() => validateField('year', year)}
            className={`${styles.input} ${errors.year ? styles.inputError : ''}`}
            min="1000"
            max="9999"
          />
          {errors.year && (
            <span className={styles.fieldError}>{errors.year}</span>
          )}
        </div>
      </div>

      {showTitleGenerator && (
        <div className={styles.titleGenerator}>
          <p className={styles.titleGeneratorLabel}>{t('form.chooseTitle')}</p>
          {isGeneratingTitles ? (
            <div className={styles.loadingTitles}>
              <div className={styles.spinner}></div>
              <span>{t('form.generatingTitles')}</span>
            </div>
          ) : (
            <div className={styles.titleList}>
              {generatedTitles.map((generatedTitle, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectTitle(generatedTitle)}
                  className={styles.titleOption}
                >
                  {generatedTitle}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowTitleGenerator(false)}
            className={styles.closeGeneratorButton}
          >
            {t('button.cancel')}
          </button>
        </div>
      )}

      <div className={styles.sizeTechniqueMaterialGroup}>
        <div className={styles.formGroup}>
          <label htmlFor="width" className={styles.label}>
            {t('form.width')} <span className={styles.required}>{t('form.required')}</span>
          </label>
          <input
            id="width"
            type="number"
            value={width}
            onChange={handleWidthChange}
            onBlur={() => validateField('width', width)}
            className={`${styles.input} ${errors.width ? styles.inputError : ''}`}
            placeholder={t('form.placeholderYear')}
            min="0"
            step="0.1"
          />
          {errors.width && (
            <span className={styles.fieldError}>{errors.width}</span>
          )}
        </div>

        <div className={styles.sizeSeparator}>×</div>

        <div className={styles.formGroup}>
          <label htmlFor="height" className={styles.label}>
            {t('form.height')} <span className={styles.required}>{t('form.required')}</span>
          </label>
          <input
            id="height"
            type="number"
            value={height}
            onChange={handleHeightChange}
            onBlur={() => validateField('height', height)}
            className={`${styles.input} ${errors.height ? styles.inputError : ''}`}
            placeholder={t('form.placeholderYear')}
            min="0"
            step="0.1"
          />
          {errors.height && (
            <span className={styles.fieldError}>{errors.height}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="technique" className={styles.label}>
            {t('form.technique')} <span className={styles.required}>{t('form.required')}</span>
          </label>
          <select
            id="technique"
            value={technique}
            onChange={handleTechniqueChange}
            onBlur={() => validateField('technique', finalTechnique)}
            className={`${styles.select} ${errors.technique ? styles.inputError : ''}`}
          >
            <option value="">{t('form.selectTechnique')}</option>
            {TECHNIQUE_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`techniques.${key}`)}
              </option>
            ))}
          </select>
          {technique === 'other' && (
            <input
              type="text"
              value={customTechnique}
              onChange={handleCustomTechniqueChange}
              onBlur={() => validateField('technique', customTechnique)}
              className={`${styles.input} ${styles.customInput} ${errors.technique ? styles.inputError : ''}`}
              placeholder={t('form.placeholderTechnique')}
            />
          )}
          {errors.technique && (
            <span className={styles.fieldError}>{errors.technique}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="material" className={styles.label}>
            {t('form.material')} <span className={styles.required}>{t('form.required')}</span>
          </label>
          <select
            id="material"
            value={material}
            onChange={handleMaterialChange}
            className={`${styles.select} ${errors.material ? styles.inputError : ''}`}
          >
            <option value="">{t('form.selectMaterial')}</option>
            {MATERIAL_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`materials.${key}`)}
              </option>
            ))}
          </select>
          {material === 'other' && (
            <input
              type="text"
              value={customMaterial}
              onChange={handleCustomMaterialChange}
              className={`${styles.input} ${styles.customInput} ${errors.material ? styles.inputError : ''}`}
              placeholder={t('form.placeholderMaterial')}
            />
          )}
          {errors.material && (
            <span className={styles.fieldError}>{errors.material}</span>
          )}
        </div>
      </div>
    </div>
  )
}
