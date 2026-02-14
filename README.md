# Zcat - Генератор карточек для каталогов и выставок

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
│   ├── components/     # React компоненты
│   ├── layout.js       # Корневой layout
│   ├── page.js         # Главная страница
│   ├── globals.css     # Глобальные стили
│   └── page.module.css # Стили главной страницы
├── lib/                # Утилиты и вспомогательные функции
├── public/             # Статические ресурсы (изображения и т.д.)
├── next.config.js      # Конфигурация Next.js
└── package.json        # Зависимости проекта
```

## Статус разработки

Проект находится в активной разработке. См. [PLAN.md](./PLAN.md) для детального плана реализации.
