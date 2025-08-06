import { Transaction, FilterOptions } from '@/types/api'

// Функция для фильтрации транзакций
export function filterTransactions(
	transactions: Transaction[],
	filters: FilterOptions
): Transaction[] {
	return transactions.filter(transaction => {
		// Поиск по тексту
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			const matchesSearch =
				transaction.category.toLowerCase().includes(searchLower) ||
				(transaction.description &&
					transaction.description.toLowerCase().includes(searchLower))

			if (!matchesSearch) return false
		}

		// Фильтр по типу
		if (filters.type !== 'all' && transaction.type !== filters.type) {
			return false
		}

		// Фильтр по категории
		if (filters.category && transaction.category !== filters.category) {
			return false
		}

		// Фильтр по дате
		if (filters.dateFrom) {
			const transactionDate = new Date(transaction.date)
			const fromDate = new Date(filters.dateFrom)
			if (transactionDate < fromDate) return false
		}

		if (filters.dateTo) {
			const transactionDate = new Date(transaction.date)
			const toDate = new Date(filters.dateTo)
			toDate.setHours(23, 59, 59, 999) // Конец дня
			if (transactionDate > toDate) return false
		}

		return true
	})
}

// Функция для сортировки транзакций
export function sortTransactions(
	transactions: Transaction[],
	sortBy: FilterOptions['sortBy'],
	sortOrder: FilterOptions['sortOrder']
): Transaction[] {
	return [...transactions].sort((a, b) => {
		let comparison = 0

		switch (sortBy) {
			case 'date':
				comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
				break
			case 'amount':
				comparison = a.amount - b.amount
				break
			case 'category':
				comparison = a.category.localeCompare(b.category)
				break
			default:
				comparison = 0
		}

		return sortOrder === 'asc' ? comparison : -comparison
	})
}

// Функция для получения уникальных категорий
export function getUniqueCategories(transactions: Transaction[]): string[] {
	const categories = new Set<string>()
	transactions.forEach(transaction => {
		categories.add(transaction.category)
	})
	return Array.from(categories).sort()
}

// Функция для получения статистики по фильтрам
export function getFilterStats(
	allTransactions: Transaction[],
	filteredTransactions: Transaction[]
) {
	const totalCount = allTransactions.length
	const filteredCount = filteredTransactions.length
	const hasFilters = totalCount !== filteredCount

	return {
		totalCount,
		filteredCount,
		hasFilters,
		percentage:
			totalCount > 0 ? Math.round((filteredCount / totalCount) * 100) : 0,
	}
}

// Функция для применения всех фильтров и сортировки
export function applyFiltersAndSort(
	transactions: Transaction[],
	filters: FilterOptions
): Transaction[] {
	const filtered = filterTransactions(transactions, filters)
	return sortTransactions(filtered, filters.sortBy, filters.sortOrder)
}
