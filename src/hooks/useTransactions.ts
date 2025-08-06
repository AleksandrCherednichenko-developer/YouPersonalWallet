import { useState, useEffect, useCallback } from 'react'
import { api } from '@/services/api'
import { Transaction, BalanceData } from '@/types/api'

interface CacheData {
	transactions: Transaction[]
	balance: BalanceData
	timestamp: number
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

export function useTransactions() {
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [balance, setBalance] = useState<BalanceData>({
		income: 0,
		expense: 0,
		balance: 0,
	})
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')

	const getCachedData = useCallback((): CacheData | null => {
		const cached = localStorage.getItem('wallet-cache')
		if (!cached) return null

		try {
			const data: CacheData = JSON.parse(cached)
			const now = Date.now()

			if (now - data.timestamp < CACHE_DURATION) {
				return data
			}
		} catch {
			// Игнорируем ошибки парсинга кэша
		}

		return null
	}, [])

	const setCachedData = useCallback((data: Omit<CacheData, 'timestamp'>) => {
		const cacheData: CacheData = {
			...data,
			timestamp: Date.now(),
		}
		localStorage.setItem('wallet-cache', JSON.stringify(cacheData))
	}, [])

	const fetchData = useCallback(
		async (forceRefresh = false) => {
			try {
				// Проверяем кэш только если не принудительное обновление
				if (!forceRefresh) {
					const cached = getCachedData()
					if (cached) {
						setTransactions(cached.transactions)
						setBalance(cached.balance)
						setIsLoading(false)
						setError('')
						return
					}
				}

				const data = await api.getAppData()
				setTransactions(data.transactions)
				setBalance(data.balance)
				setCachedData(data)
				setError('')
			} catch (error) {
				setError(error instanceof Error ? error.message : 'An error occurred')
			} finally {
				setIsLoading(false)
			}
		},
		[getCachedData, setCachedData]
	)

	const refreshData = useCallback(() => {
		setIsLoading(true)
		fetchData(true) // Принудительное обновление
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
