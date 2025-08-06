'use client'

import { memo } from 'react'
import { Transaction } from '@/types/api'
import { formatCurrency, formatDate } from '@/lib/utils'

interface TransactionItemProps {
	transaction: Transaction
}

const TransactionItem = memo(function TransactionItem({
	transaction,
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
				</div>
			</div>
		</div>
	)
})

export default TransactionItem
