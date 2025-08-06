'use client'

import { formatCurrency } from '@/lib/utils'
import { CSS_CLASSES } from '@/lib/constants'

interface BalanceProps {
	income: number
	expense: number
	balance: number
}

export default function Balance({ income, expense, balance }: BalanceProps) {
	return (
		<div className='glass-card p-8 shadow-2xl animate-fade-in'>
			<div className='text-center mb-8'>
				<h2 className='text-3xl font-bold text-white mb-4'>Общий баланс</h2>
				<div className='text-5xl font-bold text-white mb-2 animate-pulse'>
					{formatCurrency(balance)}
				</div>
				<p className='text-gray-400'>Текущий баланс</p>
			</div>

			<div className='grid grid-cols-2 gap-6'>
				<BalanceCard
					title='Доходы'
					amount={income}
					bgColor='bg-green-500/10'
					borderColor='border-green-500/30'
					textColor='text-green-400'
					delay='0ms'
				/>
				<BalanceCard
					title='Расходы'
					amount={expense}
					bgColor='bg-red-500/10'
					borderColor='border-red-500/30'
					textColor='text-red-400'
					delay='100ms'
				/>
			</div>
		</div>
	)
}

interface BalanceCardProps {
	title: string
	amount: number
	bgColor: string
	borderColor: string
	textColor: string
	delay: string
}

function BalanceCard({
	title,
	amount,
	bgColor,
	borderColor,
	textColor,
	delay,
}: BalanceCardProps) {
	return (
		<div
			className={`${bgColor} border ${borderColor} rounded-xl p-6 text-center animate-slide-in hover-lift`}
			style={{ animationDelay: delay }}
		>
			<div className='text-lg text-gray-300 font-semibold mb-2'>{title}</div>
			<div className={`text-3xl font-bold ${textColor}`}>
				{formatCurrency(amount)}
			</div>
		</div>
	)
}
