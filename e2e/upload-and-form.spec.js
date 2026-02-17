// @ts-check
const { test, expect } = require('@playwright/test')
const path = require('path')

function addRussianLocale(page) {
  return page.addInitScript(() => {
    window.localStorage.setItem('zcat-language', 'ru')
  })
}

test.describe('Загрузка изображения и форма', () => {
  test.beforeEach(async ({ page }) => {
    await addRussianLocale(page)
    await page.goto('/')
  })

  test('после выбора изображения показывается превью и кнопка «Выбрать другое изображение»', async ({
    page,
  }) => {
    const fileInput = page.locator('input[type="file"]').first()
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test-image.png'))

    await expect(page.getByText('Выбрать другое изображение')).toBeVisible({ timeout: 5000 })
    await expect(page.getByAltText('Превью')).toBeVisible()
  })

  test('заполнение формы и выбор техники/материала отображает этикетку', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first()
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test-image.png'))

    await page.getByLabel(/Название/).fill('Тестовое произведение')
    await page.getByLabel(/Высота/).fill('70')
    await page.getByLabel(/Ширина/).fill('50')
    await page.getByLabel(/Техника/).selectOption('oil')
    await page.getByLabel(/Материал/).selectOption('canvas')

    await expect(page.getByText('«Тестовое произведение»')).toBeVisible({ timeout: 3000 })
    await expect(page.getByText('70 × 50 см')).toBeVisible()
    await expect(page.getByText('Масло / Холст')).toBeVisible()
  })

  test('кнопка «Сгенерировать описание» активна при загруженном изображении и заполненной форме', async ({
    page,
  }) => {
    const fileInput = page.locator('input[type="file"]').first()
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test-image.png'))

    await page.getByLabel(/Название/).fill('Картина')
    await page.getByLabel(/Высота/).fill('60')
    await page.getByLabel(/Ширина/).fill('40')
    await page.getByLabel(/Техника/).selectOption('acrylic')
    await page.getByLabel(/Материал/).selectOption('paper')

    const generateBtn = page.getByRole('button', { name: 'Сгенерировать описание' })
    await expect(generateBtn).toBeEnabled()
  })

  test('можно удалить изображение по кнопке удаления', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first()
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test-image.png'))

    await expect(page.getByAltText('Превью')).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: 'Удалить изображение' }).click()
    await expect(page.getByText(/Перетащите изображение сюда/)).toBeVisible()
  })
})
