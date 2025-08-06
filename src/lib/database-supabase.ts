import { supabase } from './supabase'
import { Transaction, BalanceData } from '@/types/api'

// Проверяем, настроены ли переменные окружения
const isSupabaseConfigured = () => {
	return (
		process.env.NEXT_PUBLIC_SUPABASE_URL &&
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	)
}

// Мок-данные для тестирования
const mockTransactions: Transaction[] = [
	{
		id: 1,
		type: 'income',
		amount: 50000,
		category: 'Зарплата',
		description: 'Зарплата за месяц',
		date: '2024-01-15',
		created_at: '2024-01-15T10:00:00Z',
	},
	{
		id: 2,
		type: 'expense',
		amount: 1500,
		category: 'Продукты',
		description: 'Покупка продуктов',
		date: '2024-01-16',
		created_at: '2024-01-16T14:30:00Z',
	},
]

const mockBalance: BalanceData = {
	income: 50000,
	expense: 1500,
	balance: 48500,
}

// Функции для работы с транзакциями
export async function addTransaction(
	transaction: Omit<Transaction, 'id' | 'created_at'>
) {
	if (!isSupabaseConfigured()) {
		console.warn('Supabase не настроен. Используются мок-данные.')
		// В реальном приложении здесь можно сохранить в localStorage
		return Date.now()
	}

	const { data, error } = await supabase
		.from('transactions')
		.insert({
			type: transaction.type,
			amount: transaction.amount,
			category: transaction.category,
			description: transaction.description || '',
			date: transaction.date,
		})
		.select()
		.single()

	if (error) {
		throw new Error(`Failed to add transaction: ${error.message}`)
	}

	return data.id
}

export async function getTransactions(limit = 50) {
	if (!isSupabaseConfigured()) {
		console.warn('Supabase не настроен. Возвращаются мок-данные.')
		return mockTransactions
	}

	const { data, error } = await supabase
		.from('transactions')
		.select('*')
		.order('date', { ascending: false })
		.order('created_at', { ascending: false })
		.limit(limit)

	if (error) {
		throw new Error(`Failed to fetch transactions: ${error.message}`)
	}

	return data || []
}

export async function getBalance(): Promise<BalanceData> {
	if (!isSupabaseConfigured()) {
		console.warn('Supabase не настроен. Возвращается мок-баланс.')
		return mockBalance
	}

	// Получаем доходы
	const { data: incomeData, error: incomeError } = await supabase
		.from('transactions')
		.select('amount')
		.eq('type', 'income')

	if (incomeError) {
		throw new Error(`Failed to fetch income: ${incomeError.message}`)
	}

	// Получаем расходы
	const { data: expenseData, error: expenseError } = await supabase
		.from('transactions')
		.select('amount')
		.eq('type', 'expense')

	if (expenseError) {
		throw new Error(`Failed to fetch expenses: ${expenseError.message}`)
	}

	const income = incomeData?.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0) || 0
	const expense = expenseData?.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0) || 0

	return {
		income,
		expense,
		balance: income - expense,
	}
}

export async function updateTransaction(
	id: number,
	updates: Partial<Omit<Transaction, 'id' | 'created_at'>>
) {
	if (!isSupabaseConfigured()) {
		console.warn('Supabase не настроен. Обновление не выполнено.')
		return mockTransactions.find(t => t.id === id)!
	}

	const { data, error } = await supabase
		.from('transactions')
		.update(updates)
		.eq('id', id)
		.select()
		.single()

	if (error) {
		throw new Error(`Failed to update transaction: ${error.message}`)
	}

	return data
}

export async function deleteTransaction(id: number) {
	if (!isSupabaseConfigured()) {
		console.warn('Supabase не настроен. Удаление не выполнено.')
		return true
	}

	const { error } = await supabase.from('transactions').delete().eq('id', id)

	if (error) {
		throw new Error(`Failed to delete transaction: ${error.message}`)
	}

	return true
}
