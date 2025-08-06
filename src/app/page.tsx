'use client'

import { useState, useMemo } from 'react'
import Balance from '@/components/Balance'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import TransactionFilters, {
	FilterOptions,
} from '@/components/TransactionFilters'
import LoadingState from '@/components/LoadingState'
import ErrorState from '@/components/ErrorState'
import EditTransactionModal from '@/components/EditTransactionModal'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useTransactions } from '@/hooks/useTransactions'
import { api } from '@/services/api'
import { Transaction } from '@/types/api'
import {
	applyFiltersAndSort,
	getUniqueCategories,
	getFilterStats,
} from '@/lib/filter-utils'

export default function Home() {
	const { transactions, balance, isLoading, error, refreshData } =
		useTransactions()

	const [editingTransaction, setEditingTransaction] =
		useState<Transaction | null>(null)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isActionLoading, setIsActionLoading] = useState(false)

	// Состояние фильтров
	const [filters, setFilters] = useState<FilterOptions>({
		search: '',
		type: 'all',
		category: '',
		dateFrom: '',
		dateTo: '',
		sortBy: 'date',
		sortOrder: 'desc',
	})

	const handleEdit = (transaction: Transaction) => {
		setEditingTransaction(transaction)
		setIsEditModalOpen(true)
	}

	const handleDelete = async (id: number) => {
		if (!confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
			return
		}

		setIsActionLoading(true)
		try {
			await api.deleteTransaction(id)
			refreshData()
		} catch (error) {
			console.error('Error deleting transaction:', error)
			alert('Ошибка при удалении транзакции')
		} finally {
			setIsActionLoading(false)
		}
	}

	const handleSaveEdit = async (
		id: number,
		data: {
			type: 'income' | 'expense'
			amount: number
			category: string
			description: string
			date: string
		}
	) => {
		setIsActionLoading(true)
		try {
			await api.updateTransaction(id, data)
			refreshData()
		} catch (error) {
			console.error('Error updating transaction:', error)
			throw error
		} finally {
			setIsActionLoading(false)
		}
	}

	// Вычисляемые значения для фильтрации
	const categories = useMemo(
		() => getUniqueCategories(transactions),
		[transactions]
	)

	const filteredTransactions = useMemo(
		() => applyFiltersAndSort(transactions, filters),
		[transactions, filters]
	)

	const filterStats = useMemo(
		() => getFilterStats(transactions, filteredTransactions),
		[transactions, filteredTransactions]
	)

	if (isLoading) return <LoadingState />
	if (error) return <ErrorState message={error} />

	return (
		<ErrorBoundary>
			<div className='min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0f0f23] p-8'>
				<div className='container mx-auto flex flex-col gap-6'>
					<AppHeader />
					<Balance
						income={balance.income}
						expense={balance.expense}
						balance={balance.balance}
					/>
					<TransactionForm onTransactionAdded={refreshData} />
					<TransactionFilters
						filters={filters}
						onFiltersChange={setFilters}
						categories={categories}
					/>
					<TransactionList
						transactions={filteredTransactions}
						onEdit={handleEdit}
						onDelete={handleDelete}
						isLoading={isActionLoading}
						filterStats={filterStats}
					/>
					<EditTransactionModal
						transaction={editingTransaction}
						isOpen={isEditModalOpen}
						onClose={() => {
							setIsEditModalOpen(false)
							setEditingTransaction(null)
						}}
						onSave={handleSaveEdit}
					/>
				</div>
			</div>
		</ErrorBoundary>
	)
}

function AppHeader() {
	return (
		<div className='text-center'>
			<div className='inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mb-8 shadow-2xl shadow-purple-500/25'>
				<svg
					className='w-12 h-12 text-white'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
					/>
				</svg>
			</div>
			<h1 className='text-6xl font-bold mb-4 gradient-text'>Мой кошелек</h1>
			<p className='text-gray-400 text-xl font-medium'>
				Отслеживайте свои доходы и расходы
			</p>
		</div>
	)
}
