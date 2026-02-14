'use client'

import { useState } from 'react'
import { generateTitles } from '../../lib/ai-client'
import styles from './ArtworkForm.module.css'

const TECHNIQUES = [
  'Масло',
  'Акварель',
  'Акрил',
  'Гуашь',
  'Темпера',
  'Пастель',
  'Уголь',
  'Карандаш',
  'Цифровое изображение',
  'Смешанная техника',
  'Другое'
]

const MATERIALS = [
  'Холст',
  'Бумага',
  'Картон',
  'Дерево',
  'Металл',
  'Стекло',
  'Ткань',
  'Пластик',
  'Другое'
]

export default function ArtworkForm({ imageData, onFormDataChange }) {
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

  // Валидация формы
  const validateField = (name, value) => {
    const newErrors = { ...errors }
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Название обязательно для заполнения'
        } else {
          delete newErrors.title
        }
        break
      case 'width':
        if (!value.trim()) {
          newErrors.width = 'Ширина обязательна для заполнения'
        } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          newErrors.width = 'Введите корректное число'
        } else {
          delete newErrors.width
        }
        break
      case 'height':
        if (!value.trim()) {
          newErrors.height = 'Высота обязательна для заполнения'
        } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          newErrors.height = 'Введите корректное число'
        } else {
          delete newErrors.height
        }
        break
      case 'technique':
        if (!value.trim()) {
          newErrors.technique = 'Техника обязательна для заполнения'
        } else {
          delete newErrors.technique
        }
        break
      case 'author':
        // Автор не обязателен
        delete newErrors.author
        break
      case 'year':
        // Год не обязателен, но если введен, проверяем формат
        if (value.trim().length === 0) {
          delete newErrors.year
        } else {
          const yearNum = parseInt(value)
          if (isNaN(yearNum) || yearNum < 1000 || yearNum > 9999) {
            newErrors.year = 'Введите корректный год (4 цифры)'
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
    validateField('technique', value)
    updateFormData({ technique: value === 'Другое' ? '' : value })
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
    updateFormData({ material: value === 'Другое' ? '' : value })
  }

  const handleCustomMaterialChange = (e) => {
    const value = e.target.value
    setCustomMaterial(value)
    const finalMaterial = value.trim() || ''
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
        technique: updates.technique !== undefined ? updates.technique : (technique === 'Другое' ? customTechnique : technique),
        material: updates.material !== undefined ? updates.material : (material === 'Другое' ? customMaterial : material),
        year: updates.year !== undefined ? updates.year : year
      })
    }
  }

  // Валидация всей формы
  const validateForm = () => {
    const titleValid = validateField('title', title)
    const widthValid = validateField('width', width)
    const heightValid = validateField('height', height)
    const techniqueValue = technique === 'Другое' ? customTechnique : technique
    const techniqueValid = validateField('technique', techniqueValue)
    
    return titleValid && widthValid && heightValid && techniqueValid
  }

  // Генерация названий с помощью AI
  const handleGenerateTitles = async () => {
    if (!imageData) {
      setErrors({ ...errors, general: 'Сначала загрузите изображение' })
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
        setErrors({ ...errors, general: 'Не удалось сгенерировать названия. Попробуйте еще раз.' })
        setShowTitleGenerator(false)
      }
    } catch (error) {
      console.error('Ошибка при генерации названий:', error)
      setErrors({ 
        ...errors, 
        general: error.message || 'Ошибка при генерации названий. Проверьте настройки API.' 
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

  const finalTechnique = technique === 'Другое' ? customTechnique : technique

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Данные произведения</h2>
      
      {errors.general && (
        <div className={styles.errorMessage} role="alert">
          {errors.general}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="author" className={styles.label}>
          Автор
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={handleAuthorChange}
          onBlur={() => validateField('author', author)}
          className={`${styles.input} ${errors.author ? styles.inputError : ''}`}
          placeholder="Введите имя автора"
        />
        {errors.author && (
          <span className={styles.fieldError}>{errors.author}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Название <span className={styles.required}>*</span>
        </label>
        <div className={styles.titleInputGroup}>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => validateField('title', title)}
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            placeholder="Введите название произведения"
          />
          <button
            type="button"
            onClick={handleGenerateTitles}
            className={styles.generateButton}
            disabled={!imageData || isGeneratingTitles}
          >
            {isGeneratingTitles ? 'Генерация...' : 'Сгенерировать названия'}
          </button>
        </div>
        {errors.title && (
          <span className={styles.fieldError}>{errors.title}</span>
        )}
      </div>

      {showTitleGenerator && (
        <div className={styles.titleGenerator}>
          <p className={styles.titleGeneratorLabel}>Выберите одно из предложенных названий:</p>
          {isGeneratingTitles ? (
            <div className={styles.loadingTitles}>
              <div className={styles.spinner}></div>
              <span>Генерация названий...</span>
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
            Отмена
          </button>
        </div>
      )}

      <div className={styles.sizeGroup}>
        <div className={styles.formGroup}>
          <label htmlFor="width" className={styles.label}>
            Ширина (см) <span className={styles.required}>*</span>
          </label>
          <input
            id="width"
            type="number"
            value={width}
            onChange={handleWidthChange}
            onBlur={() => validateField('width', width)}
            className={`${styles.input} ${errors.width ? styles.inputError : ''}`}
            placeholder="0"
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
            Высота (см) <span className={styles.required}>*</span>
          </label>
          <input
            id="height"
            type="number"
            value={height}
            onChange={handleHeightChange}
            onBlur={() => validateField('height', height)}
            className={`${styles.input} ${errors.height ? styles.inputError : ''}`}
            placeholder="0"
            min="0"
            step="0.1"
          />
          {errors.height && (
            <span className={styles.fieldError}>{errors.height}</span>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="technique" className={styles.label}>
          Техника <span className={styles.required}>*</span>
        </label>
        <select
          id="technique"
          value={technique}
          onChange={handleTechniqueChange}
          onBlur={() => validateField('technique', finalTechnique)}
          className={`${styles.select} ${errors.technique ? styles.inputError : ''}`}
        >
          <option value="">Выберите технику</option>
          {TECHNIQUES.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
        {technique === 'Другое' && (
          <input
            type="text"
            value={customTechnique}
            onChange={handleCustomTechniqueChange}
            onBlur={() => validateField('technique', customTechnique)}
            className={`${styles.input} ${styles.customInput} ${errors.technique ? styles.inputError : ''}`}
            placeholder="Укажите технику"
          />
        )}
        {errors.technique && (
          <span className={styles.fieldError}>{errors.technique}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="material" className={styles.label}>
          Материал
        </label>
        <select
          id="material"
          value={material}
          onChange={handleMaterialChange}
          className={styles.select}
        >
          <option value="">Выберите материал</option>
          {MATERIALS.map((mat) => (
            <option key={mat} value={mat}>
              {mat}
            </option>
          ))}
        </select>
        {material === 'Другое' && (
          <input
            type="text"
            value={customMaterial}
            onChange={handleCustomMaterialChange}
            className={`${styles.input} ${styles.customInput}`}
            placeholder="Укажите материал"
          />
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
          placeholder="2023"
          min="1000"
          max="9999"
        />
        {errors.year && (
          <span className={styles.fieldError}>{errors.year}</span>
        )}
      </div>
    </div>
  )
}
