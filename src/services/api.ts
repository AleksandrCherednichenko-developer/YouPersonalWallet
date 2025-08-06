import { TransactionsResponse, Transaction } from '@/types/api'

const API_BASE = '/api'

async function apiRequest<T>(
	endpoint: string,
	options?: RequestInit
): Promise<T> {
	const response = await fetch(`${API_BASE}${endpoint}`, {
		headers: { 'Content-Type': 'application/json' },
		...options,
	})

	if (!response.ok) {
		throw new Error(`API request failed: ${response.statusText}`)
	}

	return response.json()
}

export const api = {
	async getAppData(): Promise<TransactionsResponse> {
		return apiRequest<TransactionsResponse>('/transactions')
	},

	async createTransaction(
		transaction: Omit<Transaction, 'id' | 'created_at'>
	): Promise<TransactionsResponse> {
		return apiRequest<TransactionsResponse>('/transactions', {
			method: 'POST',
			body: JSON.stringify(transaction),
		})
	},

	async updateTransaction(
		id: number,
		transaction: Omit<Transaction, 'id' | 'created_at'>
	): Promise<TransactionsResponse> {
		return apiRequest<TransactionsResponse>(`/transactions/${id}`, {
			method: 'PUT',
			body: JSON.stringify(transaction),
		})
	},

	async deleteTransaction(id: number): Promise<TransactionsResponse> {
		return apiRequest<TransactionsResponse>(`/transactions/${id}`, {
			method: 'DELETE',
		})
	},
}
