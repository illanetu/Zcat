// @ts-check
const { test, expect } = require('@playwright/test')
const path = require('path')

function addRussianLocale(page) {
  return page.addInitScript(() => {
    window.localStorage.setItem('zcat-language', 'ru')
  })
}

test.describe('Настройки и кнопки действий', () => {
  test.beforeEach(async ({ page }) => {
    await addRussianLocale(page)
    await page.goto('/')
  })

  test('кнопка настроек открывает панель настроек', async ({ page }) => {
    await page.getByRole('button', { name: 'Настройки' }).click()
    const panel = page.getByRole('dialog', { name: 'Панель настроек' })
    await expect(panel).toBeVisible({ timeout: 5000 })
    await expect(panel.getByText('Язык')).toBeVisible()
    await expect(panel.getByText('Стиль описания')).toBeVisible()
  })

  test('в настройках можно выбрать стиль описания', async ({ page }) => {
    await page.getByRole('button', { name: 'Настройки' }).click()
    const panel = page.getByRole('dialog', { name: 'Панель настроек' })
    await expect(panel).toBeVisible({ timeout: 5000 })
    const styleSelect = panel.getByLabel('Стиль описания')
    await expect(styleSelect).toBeVisible()
    await expect(styleSelect).toHaveValue(/catalog|poetic|neutral|brief|academic|emotional/)
  })

  test('после заполнения формы и загрузки изображения появляются кнопки Копировать, Поделиться, PDF', async ({
    page,
  }) => {
    const fileInput = page.locator('input[type="file"]').first()
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test-image.png'))

    await page.getByLabel(/Название/).fill('Работа')
    await page.getByLabel(/Высота/).fill('50')
    await page.getByLabel(/Ширина/).fill('40')
    await page.getByLabel(/Техника/).selectOption('watercolor')
    await page.getByLabel(/Материал/).selectOption('paper')

    await expect(page.getByRole('button', { name: 'Копировать текст' })).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('button', { name: 'Поделиться' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Сохранить все в PDF' })).toBeVisible()
  })
})
