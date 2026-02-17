# Zcat - Генератор описания для каталогов и выставок

Веб-приложение для создания карточек с описаниями произведений искусства на основе загруженных изображений с использованием AI.

## Технологический стек

- **Next.js 15** - React-фреймворк с App Router
- **React 18** - библиотека для создания пользовательского интерфейса
- **CSS Modules** - модульная стилизация

## Установка и запуск

### Требования
- Node.js (версия 18 или выше)
- npm или yarn
- API ключ OpenAI (для генерации названий и описаний)

### Установка зависимостей

```powershell
npm install
```

### Настройка переменных окружения

Создайте файл `.env.local` в корне проекта и добавьте API ключи:

```powershell
# Скопируйте пример файла
Copy-Item .env.local.example .env.local
```

Затем откройте `.env.local` и укажите ваши API ключи.

**Вариант 1: Использование OpenRouter (рекомендуется)**
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_REFERER_URL=http://localhost:3000
# Опционально: укажите модель (по умолчанию: openai/gpt-4o)
# OPENROUTER_MODEL=openai/gpt-4o
```

**Вариант 2: Использование OpenAI напрямую**
```
OPENAI_API_KEY=your_openai_api_key_here
```

Получить API ключи можно:
- OpenRouter: [OpenRouter.ai](https://openrouter.ai/keys)
- OpenAI: [OpenAI Platform](https://platform.openai.com/api-keys)

### Запуск в режиме разработки

```powershell
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

### Сборка для продакшена

```powershell
npm run build
```

### Запуск продакшен-сборки

```powershell
npm run build
npm start
```

## Структура проекта

```
Zcat/
├── app/
│   ├── api/                      # API Routes (Server)
│   │   ├── generate-titles/      # POST — генерация названий по изображению (AI)
│   │   ├── generate-description/ # POST — генерация описания по изображению и данным (AI)
│   │   └── check-api-key/        # GET — проверка наличия API ключа
│   ├── components/               # React-компоненты (Client, где нужно)
│   │   ├── ImageUpload.jsx       # Загрузка изображения (drag-and-drop, превью, base64)
│   │   ├── ArtworkForm.jsx       # Форма: автор, название, год, размер, техника, материал; генерация названий
│   │   ├── ParameterCard.jsx     # Карточка параметров (этикетка)
│   │   ├── DescriptionCard.jsx   # Карточка с описанием
│   │   ├── SettingsButton.jsx    # Кнопка настроек (язык, стиль описания)
│   │   ├── CopyButton.jsx        # Копирование текста в буфер
│   │   ├── ShareButton.jsx      # Поделиться (Web Share API)
│   │   ├── SendPdfButton.jsx    # Скачать PDF с карточкой и описанием
│   │   └── I18nProvider.jsx     # Провайдер i18n
│   ├── locales/                  # Переводы (ru.json, en.json)
│   ├── layout.js                 # Корневой layout
│   ├── page.js                   # Главная страница (сводка всех секций)
│   ├── globals.css               # Глобальные стили и CSS-переменные
│   └── page.module.css           # Стили главной страницы
├── lib/
│   ├── ai-client.js              # Клиент AI: generateTitles(), generateDescription()
│   ├── card-utils.js             # Сборка этикетки: buildParameterCard(), formatSize(), isParameterCardReady()
│   ├── description-styles.js    # Стили описания (catalog, poetic, neutral, brief)
│   ├── form-options.js           # Опции техник и материалов для формы
│   ├── pdf-utils.js              # Генерация PDF (jsPDF)
│   ├── storage.js                # localStorage-хелперы
│   └── roboto-font-base64.js     # Шрифт для PDF
├── public/                       # Статические ресурсы
├── next.config.js
├── package.json
└── PLAN.md                       # План реализации и статус этапов
```

## Тестирование и оптимизация

- **Юнит-тесты (Vitest):** `npm run test` — режим watch; `npm run test:run` — один прогон. Тесты покрывают `lib/card-utils.js`, `lib/description-styles.js` и компонент `ParameterCard`.
- **E2E-тесты (Playwright):** `npm run test:e2e` — запуск тестов в браузере (автоматически поднимается `npm run dev`). `npm run test:e2e:ui` — интерактивный режим с UI. Тесты в `e2e/`: загрузка страницы и секций, загрузка изображения и заполнение формы, этикетка, настройки, кнопки действий.
- **Сборка:** `npm run build` — проверка сборки и размера бандла (Next.js выводит отчёт по страницам).
- **Линт:** `npm run lint`.
- Рекомендуется проверить приложение в Chrome, Firefox и при необходимости в Safari; на мобильном и десктопе.

## Статус разработки

Реализованы этапы 1–8 плана (загрузка изображения, форма, генерация названий и описаний, карточки, настройки, стилизация). См. [PLAN.md](./PLAN.md) для детального плана и оставшихся шагов тестирования и полировки.
