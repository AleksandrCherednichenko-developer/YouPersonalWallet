'use client'

import { useState } from 'react'
import { api } from '@/services/api'
import {
	validateTransaction,
	getCurrentDate,
	handleApiError,
} from '@/lib/utils'
import { TRANSACTION_TYPES, CSS_CLASSES } from '@/lib/constants'
import { FormData } from '@/types/api'

interface TransactionFormProps {
	onTransactionAdded: () => void
}

const initialFormData: FormData = {
	type: TRANSACTION_TYPES.EXPENSE,
	amount: '',
	category: '',
	description: '',
	date: getCurrentDate(),
}

export default function TransactionForm({
	onTransactionAdded,
}: TransactionFormProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState<FormData>(initialFormData)
	const [errors, setErrors] = useState<string[]>([])

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
		setErrors([])
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const validation = validateTransaction(formData)
		if (!validation.isValid) {
			setErrors(validation.errors)
			return
		}

		setIsLoading(true)
		try {
			await api.createTransaction({
				type: formData.type,
				amount: parseFloat(formData.amount),
				category: formData.category,
				description: formData.description,
				date: formData.date,
			})

			setFormData(initialFormData)
			setErrors([])
			onTransactionAdded()
		} catch (error) {
			setErrors([handleApiError(error)])
		} finally {
			setIsLoading(false)
		}
	}

	const isFormValid = formData.amount && formData.category && !isLoading

	return (
		<div className='relative'>
			<div className={CSS_CLASSES.GLASS_CARD}>
				<div className='relative z-10'>
					{/* Заголовок формы */}
					<div className='flex items-center mb-10'>
						<div className='w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mr-6 shadow-lg hover-lift neon-glow'>
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
									d='M12 6v6m0 0v6m0-6h6m-6 0H6'
								/>
							</svg>
						</div>
						<div>
							<h2 className='text-3xl font-bold text-white mb-2'>
								Добавить транзакцию
							</h2>
							<p className='text-gray-400 text-lg'>
								Создайте новую запись о доходах или расходах
							</p>
						</div>
					</div>

					{/* Ошибки */}
					{errors.length > 0 && (
						<div className='mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl'>
							{errors.map((error, index) => (
								<p key={index} className='text-red-400 text-sm'>
									{error}
								</p>
							))}
						</div>
					)}

					{/* Форма */}
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* Тип транзакции */}
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									Тип
								</label>
								<select
									value={formData.type}
									onChange={e => handleInputChange('type', e.target.value)}
									className={CSS_CLASSES.INPUT_FIELD}
								>
									<option value={TRANSACTION_TYPES.EXPENSE}>Расход</option>
									<option value={TRANSACTION_TYPES.INCOME}>Доход</option>
								</select>
							</div>

							{/* Сумма */}
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									Сумма
								</label>
								<input
									type='number'
									value={formData.amount}
									onChange={e => handleInputChange('amount', e.target.value)}
									placeholder='0.00'
									className={CSS_CLASSES.INPUT_FIELD}
								/>
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* Категория */}
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									Категория
								</label>
								<input
									type='text'
									value={formData.category}
									onChange={e => handleInputChange('category', e.target.value)}
									placeholder='Введите категорию'
									className={CSS_CLASSES.INPUT_FIELD}
								/>
							</div>

							{/* Дата */}
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									Дата
								</label>
								<input
									type='date'
									value={formData.date}
									onChange={e => handleInputChange('date', e.target.value)}
									className={CSS_CLASSES.INPUT_FIELD}
								/>
							</div>
						</div>

						{/* Описание */}
						<div>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Описание
							</label>
							<input
								type='text'
								value={formData.description}
								onChange={e => handleInputChange('description', e.target.value)}
								placeholder='Дополнительное описание'
								className={CSS_CLASSES.INPUT_FIELD}
							/>
						</div>

						{/* Кнопка отправки */}
						<button
							type='submit'
							disabled={!isFormValid}
							className={CSS_CLASSES.GRADIENT_BUTTON}
						>
							{isLoading ? 'Добавление...' : 'Добавить транзакцию'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
