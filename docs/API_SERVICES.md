# API Services Documentation

## Обзор

Мы создали модульную структуру для работы с API, которая обеспечивает:

- ✅ **Типизацию** - все API вызовы типизированы
- ✅ **Переиспользование** - единый HTTP клиент
- ✅ **Кэширование** - встроенное кэширование для категорий
- ✅ **Обработку ошибок** - централизованная обработка ошибок
- ✅ **Модульность** - разделение по доменам

## Структура

```
src/
├── types/
│   └── api.ts                    # Типы для API
├── services/
│   ├── http-client.ts            # Базовый HTTP клиент
│   ├── transaction-service.ts     # Сервис для транзакций
│   ├── category-service.ts        # Сервис для категорий
│   ├── api-service.ts            # Главный сервис
│   └── index.ts                  # Экспорты
```

## Использование

### Основной API сервис

```typescript
import { apiService } from '@/services/api-service'

// Получить все данные приложения
const data = await apiService.getAppData()

// Добавить транзакцию
await apiService.createTransaction({
	type: 'expense',
	amount: 1000,
	category: 'Продукты',
	description: 'Покупка продуктов',
})

// Получить категории с кэшированием
const categories = await apiService.getCategoriesForType('expense')
```

### Отдельные сервисы

```typescript
import { transactionService, categoryService } from '@/services'

// Работа с транзакциями
const transactions = await transactionService.getTransactions()
const stats = await transactionService.getTransactionStats()

// Работа с категориями
const categories = await categoryService.getCategoriesCached('income')
categoryService.clearCache() // Очистить кэш
```

## HTTP Клиент

Базовый HTTP клиент предоставляет методы:

```typescript
import { httpClient } from '@/services/http-client'

// GET запрос
const data = await httpClient.get<ResponseType>('/api/endpoint')

// POST запрос
const result = await httpClient.post<ResponseType>('/api/endpoint', data)

// PUT запрос
const updated = await httpClient.put<ResponseType>('/api/endpoint', data)

// DELETE запрос
const deleted = await httpClient.delete<ResponseType>('/api/endpoint')
```

## Типы

Все типы определены в `src/types/api.ts`:

```typescript
// Транзакции
interface Transaction {
	id?: number
	type: 'income' | 'expense'
	amount: number
	category: string
	description?: string
	date: string
	created_at?: string
}

// Категории
interface Category {
	id?: number
	name: string
	type: 'income' | 'expense'
	color: string
}

// Баланс
interface BalanceData {
	income: number
	expense: number
	balance: number
}
```

## Кэширование

Категории автоматически кэшируются для улучшения производительности:

```typescript
// Первый вызов - загружает с сервера
const categories1 = await categoryService.getCategoriesCached('expense')

// Второй вызов - возвращает из кэша
const categories2 = await categoryService.getCategoriesCached('expense')

// Очистить кэш при необходимости
categoryService.clearCache()
```

## Обработка ошибок

Все API вызовы автоматически обрабатывают ошибки:

```typescript
try {
	const data = await apiService.getAppData()
} catch (error) {
	// Ошибка уже обработана в HTTP клиенте
	console.error('API Error:', error.message)
}
```

## Расширение

Для добавления нового API endpoint:

1. **Добавить тип** в `src/types/api.ts`
2. **Создать сервис** в `src/services/`
3. **Добавить метод** в `src/services/api-service.ts`
4. **Экспортировать** в `src/services/index.ts`

### Пример добавления статистики

```typescript
// 1. Добавить тип
interface StatsResponse {
  totalTransactions: number
  monthlyStats: {
    income: number
    expense: number
  }
}

// 2. Добавить в сервис
async getStats(): Promise<StatsResponse> {
  return httpClient.get<StatsResponse>('/api/stats')
}

// 3. Использовать
const stats = await apiService.getStats()
```

## Преимущества

### До рефакторинга

```typescript
// Прямые fetch вызовы в компонентах
const response = await fetch('/api/transactions')
const data = await response.json()
if (!response.ok) throw new Error(data.error)
```

### После рефакторинга

```typescript
// Типизированные сервисы
const data = await apiService.getAppData()
```

## Миграция компонентов

Все компоненты обновлены для использования новой структуры:

- ✅ `src/app/page.tsx` - использует `apiService.getAppData()`
- ✅ `src/components/TransactionForm.tsx` - использует `apiService.createTransaction()`
- ✅ `src/components/TransactionList.tsx` - использует типы из `@/types/api`

## Тестирование

Для тестирования API сервисов можно создать моки:

```typescript
// __mocks__/services/api-service.ts
export const apiService = {
	getAppData: jest.fn(),
	createTransaction: jest.fn(),
	getCategoriesForType: jest.fn(),
}
```
