'use client'

import { Transaction } from '@/types/api'
import TransactionItem from './TransactionItem'
import EmptyState from './EmptyState'
import { CSS_CLASSES } from '@/lib/constants'

interface TransactionListProps {
	transactions: Transaction[]
	onEdit?: (transaction: Transaction) => void
	onDelete?: (id: number) => void
	isLoading?: boolean
	filterStats?: {
		totalCount: number
		filteredCount: number
		hasFilters: boolean
		percentage: number
	}
}

export default function TransactionList({
	transactions,
	onEdit,
	onDelete,
	isLoading = false,
	filterStats,
}: TransactionListProps) {
	if (transactions.length === 0) {
		return <EmptyState />
	}

	return (
		<div className='relative'>
			<div className={CSS_CLASSES.GLASS_CARD}>
				<div className='relative z-10'>
					{/* Заголовок списка */}
					<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 md:mb-10'>
						<div className='flex items-center mb-4 sm:mb-0'>
							<div className='w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mr-3 sm:mr-4 md:mr-6 shadow-lg hover-lift neon-glow'>
								<svg
									className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
									/>
								</svg>
							</div>
							<div>
								<h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2'>
									История транзакций
								</h2>
								<p className='text-gray-400 text-sm sm:text-base md:text-lg'>
									Все ваши доходы и расходы в одном месте
								</p>
							</div>
						</div>
						{filterStats && (
							<div className='text-right'>
								<div className='text-xs sm:text-sm text-gray-400'>
									Показано {filterStats.filteredCount} из{' '}
									{filterStats.totalCount}
								</div>
								{filterStats.hasFilters && (
									<div className='text-xs text-blue-400'>
										({filterStats.percentage}% от общего)
									</div>
								)}
							</div>
						)}
					</div>

					{/* Список транзакций */}
					<div className='space-y-3 sm:space-y-4'>
						{transactions.map(transaction => (
							<TransactionItem
								key={transaction.id}
								transaction={transaction}
								onEdit={onEdit || undefined}
								onDelete={onDelete || undefined}
								isLoading={isLoading}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
