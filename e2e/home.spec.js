// @ts-check
const { test, expect } = require('@playwright/test')

function addRussianLocale(page) {
  return page.addInitScript(() => {
    window.localStorage.setItem('zcat-language', 'ru')
  })
}

test.describe('Главная страница', () => {
  test.beforeEach(async ({ page }) => {
    await addRussianLocale(page)
    await page.goto('/')
  })

  test('загружается и отображает заголовок приложения', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Генератор описания для каталогов и выставок',
      { timeout: 10000 }
    )
  })

  test('отображает все основные секции', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Загрузка изображения' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Данные произведения' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Этикетка' })).toBeVisible()
  })

  test('зона загрузки изображения предлагает перетащить или нажать', async ({ page }) => {
    await expect(
      page.getByText(/Перетащите изображение сюда или нажмите для выбора/)
    ).toBeVisible()
    await expect(page.getByText(/Поддерживаются форматы: JPG, PNG/)).toBeVisible()
  })

  test('форма содержит поля: автор, название, техника, материал, размер', async ({ page }) => {
    await expect(page.getByLabel(/Автор/)).toBeVisible()
    await expect(page.getByLabel(/Название/)).toBeVisible()
    await expect(page.getByLabel(/Техника/)).toBeVisible()
    await expect(page.getByLabel(/Материал/)).toBeVisible()
    await expect(page.getByLabel(/Высота/)).toBeVisible()
    await expect(page.getByLabel(/Ширина/)).toBeVisible()
  })

  test('после заполнения обязательных полей появляется кнопка «Сгенерировать описание»', async ({
    page,
  }) => {
    await page.getByLabel(/Название/).fill('Тест')
    await page.getByLabel(/Высота/).fill('50')
    await page.getByLabel(/Ширина/).fill('40')
    await page.getByLabel(/Техника/).selectOption('oil')
    await page.getByLabel(/Материал/).selectOption('canvas')
    await expect(page.getByRole('button', { name: 'Сгенерировать описание' })).toBeVisible()
  })
})
