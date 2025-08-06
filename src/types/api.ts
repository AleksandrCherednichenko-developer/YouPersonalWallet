// Основные типы
export interface Transaction {
	id?: number
	type: 'income' | 'expense'
	amount: number
	category: string
	description?: string
	date: string
	created_at?: string
}

export interface BalanceData {
	income: number
	expense: number
	balance: number
}

export interface TransactionsResponse {
	transactions: Transaction[]
	balance: BalanceData
}

// Форма данных
export interface FormData {
	type: 'income' | 'expense'
	amount: string
	category: string
	description: string
	date: string
}

// Фильтры
export interface FilterOptions {
	search: string
	type: 'all' | 'income' | 'expense'
	category: string
	dateFrom: string
	dateTo: string
	sortBy: 'date' | 'amount' | 'category'
	sortOrder: 'asc' | 'desc'
}
