'use client'

import { Transaction } from '@/types/api'
import TransactionItem from './TransactionItem'
import EmptyState from './EmptyState'
import { CSS_CLASSES } from '@/lib/constants'

interface TransactionListProps {
	transactions: Transaction[]
}

export default function TransactionList({
	transactions,
}: TransactionListProps) {
	if (transactions.length === 0) {
		return <EmptyState />
	}

	return (
		<div className='relative'>
			<div className={CSS_CLASSES.GLASS_CARD}>
				<div className='relative z-10'>
					{/* Заголовок списка */}
					<div className='flex items-center mb-10'>
						<div className='w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-3xl flex items-center justify-center mr-6 shadow-lg hover-lift neon-glow'>
							<svg
								className='w-8 h-8 text-white'
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
							<h2 className='text-3xl font-bold text-white mb-2'>
								История транзакций
							</h2>
							<p className='text-gray-400 text-lg'>
								Все ваши доходы и расходы в одном месте
							</p>
						</div>
					</div>

					{/* Список транзакций */}
					<div className='space-y-4'>
						{transactions.map(transaction => (
							<TransactionItem key={transaction.id} transaction={transaction} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
