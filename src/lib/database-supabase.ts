import { supabase } from './supabase'
import { Transaction, BalanceData } from '@/types/api'

// Функции для работы с транзакциями
export async function addTransaction(
	transaction: Omit<Transaction, 'id' | 'created_at'>
) {
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

	const income = incomeData?.reduce((sum, item) => sum + item.amount, 0) || 0
	const expense = expenseData?.reduce((sum, item) => sum + item.amount, 0) || 0

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
	const { error } = await supabase.from('transactions').delete().eq('id', id)

	if (error) {
		throw new Error(`Failed to delete transaction: ${error.message}`)
	}

	return true
}
