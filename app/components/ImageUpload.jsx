'use client'

import { useState, useRef, useCallback } from 'react'
import styles from './ImageUpload.module.css'

export default function ImageUpload({ onImageSelect, children }) {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  // Разрешенные форматы
  const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png']
  const maxFileSize = 10 * 1024 * 1024 // 10MB

  // Валидация файла
  const validateFile = (file) => {
    if (!file) {
      return { valid: false, error: 'Файл не выбран' }
    }

    if (!allowedFormats.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Неподдерживаемый формат. Используйте JPG или PNG' 
      }
    }

    if (file.size > maxFileSize) {
      return { 
        valid: false, 
        error: 'Файл слишком большой. Максимальный размер: 10MB' 
      }
    }

    return { valid: true, error: null }
  }

  // Обработка файла
  const handleFile = useCallback((file) => {
    const validation = validateFile(file)
    
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setError(null)
    setIsLoading(true)

    // Создание превью и конвертация в base64
    const reader = new FileReader()
    
    reader.onloadend = () => {
      setIsLoading(false)
      const result = reader.result
      
      // Проверка, что результат - строка base64
      if (typeof result === 'string' && result.startsWith('data:')) {
        setImagePreview(result)
        setImage(file)
        setImageBase64(result)
        
        // Передача данных родительскому компоненту
        if (onImageSelect) {
          onImageSelect({
            file,
            preview: result,
            base64: result
          })
        }
      } else {
        setError('Ошибка при обработке изображения')
      }
    }

    reader.onerror = () => {
      setIsLoading(false)
      setError('Ошибка при чтении файла')
    }

    reader.onabort = () => {
      setIsLoading(false)
      setError('Чтение файла было прервано')
    }

    reader.readAsDataURL(file)
  }, [onImageSelect])

  // Обработка выбора файла через input
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  // Обработка drag-and-drop
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  // Обработка клика по области загрузки
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // Удаление изображения
  const handleRemove = (e) => {
    e.stopPropagation()
    setImage(null)
    setImagePreview(null)
    setImageBase64(null)
    setError(null)
    setIsLoading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onImageSelect) {
      onImageSelect(null)
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className={styles.fileInput}
        disabled={isLoading}
      />
      {!imagePreview && !isLoading ? (
        <div
          className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className={styles.uploadContent}>
            <svg
              className={styles.uploadIcon}
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className={styles.uploadText}>
              Перетащите изображение сюда или нажмите для выбора
            </p>
            <p className={styles.uploadHint}>
              Поддерживаются форматы: JPG, PNG (макс. 10MB)
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Загрузка изображения...</p>
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <div className={styles.previewWrapper}>
            <img
              src={imagePreview}
              alt="Превью"
              className={styles.previewImage}
            />
            <button
              className={styles.removeButton}
              onClick={handleRemove}
              aria-label="Удалить изображение"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p className={styles.imageName}>{image.name}</p>
          <div className={styles.buttonsRow}>
            <button
              className={styles.changeButton}
              onClick={handleClick}
            >
              Выбрать другое изображение
            </button>
            {children}
          </div>
        </div>
      )}
      
      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
