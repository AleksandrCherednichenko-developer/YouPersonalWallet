'use client'

import { memo } from 'react'
import { Transaction } from '@/types/api'
import { formatCurrency, formatDate } from '@/lib/utils'

interface TransactionItemProps {
	transaction: Transaction
	onEdit?: ((transaction: Transaction) => void) | undefined
	onDelete?: ((id: number) => void) | undefined
	isLoading?: boolean
}

const TransactionItem = memo(function TransactionItem({
	transaction,
	onEdit,
	onDelete,
	isLoading = false,
}: TransactionItemProps) {
	const isIncome = transaction.type === 'income'
	const amountColor = isIncome ? 'text-green-400' : 'text-red-400'
	const bgColor = isIncome ? 'bg-green-500/10' : 'bg-red-500/10'
	const borderColor = isIncome ? 'border-green-500/30' : 'border-red-500/30'

	return (
		<div
			className={`${bgColor} border ${borderColor} rounded-xl p-4 animate-slide-in`}
		>
			<div className='flex items-center justify-between'>
				<div className='flex-1'>
					<div className='flex items-center gap-3 mb-2'>
						<div
							className={`w-3 h-3 rounded-full ${
								isIncome ? 'bg-green-400' : 'bg-red-400'
							}`}
						/>
						<h3 className='text-lg font-semibold text-white'>
							{transaction.category}
						</h3>
					</div>
					{transaction.description && (
						<p className='text-gray-400 text-sm mb-2'>
							{transaction.description}
						</p>
					)}
					<p className='text-gray-500 text-xs'>
						{formatDate(transaction.date)}
					</p>
				</div>
				<div className='text-right'>
					<div className={`text-xl font-bold ${amountColor}`}>
						{isIncome ? '+' : '-'}
						{formatCurrency(transaction.amount)}
					</div>
					{(onEdit || onDelete) && (
						<div className='flex gap-2 mt-2'>
							{onEdit && (
								<button
									onClick={() => onEdit(transaction)}
									disabled={isLoading}
									className='p-1 text-blue-400 hover:text-blue-300 transition-colors'
									title='Редактировать'
								>
									<svg
										className='w-4 h-4'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
										/>
									</svg>
								</button>
							)}
							{onDelete && (
								<button
									onClick={() => onDelete(transaction.id!)}
									disabled={isLoading}
									className='p-1 text-red-400 hover:text-red-300 transition-colors'
									title='Удалить'
								>
									<svg
										className='w-4 h-4'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
										/>
									</svg>
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
})

export default TransactionItem
