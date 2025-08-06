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

	const fetchData = useCallback(async (forceRefresh = false) => {
		try {
			setIsLoading(true)
			setError('')

			const data = await api.getAppData()
			setTransactions(data.transactions)
			setBalance(data.balance)
		} catch (error) {
			setError(error instanceof Error ? error.message : 'An error occurred')
		} finally {
			setIsLoading(false)
		}
	}, [])

	const refreshData = useCallback(() => {
		fetchData(true)
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
