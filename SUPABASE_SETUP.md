# Настройка Supabase для проекта

## Шаг 1: Создание проекта на Supabase

1. Перейди на [supabase.com](https://supabase.com)
2. Нажми "Start your project"
3. Войди через GitHub
4. Создай новый проект

## Шаг 2: Настройка базы данных

1. В проекте Supabase перейди в **SQL Editor**
2. Скопируй содержимое файла `supabase-schema.sql`
3. Вставь в SQL Editor и выполни

## Шаг 3: Получение ключей

1. Перейди в **Settings** → **API**
2. Скопируй:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** ключ (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Шаг 4: Настройка переменных окружения

Создай файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Шаг 5: Тестирование

1. Запусти проект: `npm run dev`
2. Проверь, что транзакции сохраняются
3. Проверь, что баланс считается правильно

## Структура базы данных

### Таблица `transactions`

- `id` - уникальный идентификатор
- `type` - тип транзакции ('income' или 'expense')
- `amount` - сумма (десятичное число)
- `category` - категория
- `description` - описание (опционально)
- `date` - дата транзакции
- `created_at` - дата создания записи

### Таблица `categories`

- `id` - уникальный идентификатор
- `name` - название категории
- `type` - тип ('income' или 'expense')
- `color` - цвет для отображения
- `created_at` - дата создания записи
