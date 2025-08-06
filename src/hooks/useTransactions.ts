import { useState, useEffect, useCallback } from 'react'
import { api } from '@/services/api'
import { Transaction, BalanceData } from '@/types/api'

export function useTransactions() {
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [balance, setBalance] = useState<BalanceData>({
		income: 0,
		expense: 0,
		balance: 0,
	})
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true)
			setError('')

			// Добавляем таймаут для загрузки
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => reject(new Error('Request timeout')), 5000)
			})

			const dataPromise = api.getAppData()

			const data = (await Promise.race([dataPromise, timeoutPromise])) as { transactions: Transaction[]; balance: BalanceData }
			setTransactions(data.transactions)
			setBalance(data.balance)
		} catch (error) {
			console.error('Error fetching data:', error)
			setError(error instanceof Error ? error.message : 'An error occurred')
			// Устанавливаем мок-данные в случае ошибки
			setTransactions([
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
			])
			setBalance({
				income: 50000,
				expense: 1500,
				balance: 48500,
			})
		} finally {
			setIsLoading(false)
		}
	}, [])

	const refreshData = useCallback(() => {
		fetchData()
	}, [fetchData])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return {
		transactions,
		balance,
		isLoading,
		error,
		refreshData,
	}
}
