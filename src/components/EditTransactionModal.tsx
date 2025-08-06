'use client'

import { useState, useEffect } from 'react'
import { Transaction } from '@/types/api'
import { TRANSACTION_TYPES, CSS_CLASSES } from '@/lib/constants'
import { getCurrentDate } from '@/lib/utils'
import { validateTransaction, ValidationError } from '@/lib/validation'

interface EditTransactionModalProps {
	transaction: Transaction | null
	isOpen: boolean
	onClose: () => void
	onSave: (
		id: number,
		data: {
			type: 'income' | 'expense'
			amount: number
			category: string
			description: string
			date: string
		}
	) => Promise<void>
}

export default function EditTransactionModal({
	transaction,
	isOpen,
	onClose,
	onSave,
}: EditTransactionModalProps) {
	const [formData, setFormData] = useState({
		type: 'expense' as 'income' | 'expense',
		amount: '',
		category: '',
		description: '',
		date: getCurrentDate(),
	})
	const [errors, setErrors] = useState<ValidationError[]>([])
	const [isLoading, setIsLoading] = useState(false)

	// Заполняем форму данными транзакции при открытии
	useEffect(() => {
		if (transaction && isOpen) {
			setFormData({
				type: transaction.type,
				amount: transaction.amount.toString(),
				category: transaction.category,
				description: transaction.description || '',
				date: transaction.date,
			})
			setErrors([])
		}
	}, [transaction, isOpen])

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
		setErrors([])
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!transaction) return

		const validation = validateTransaction({
			type: formData.type,
			amount: parseFloat(formData.amount),
			category: formData.category,
			description: formData.description,
			date: formData.date,
		})

		if (!validation.isValid) {
			setErrors(validation.errors)
			return
		}

		setIsLoading(true)
		try {
			await onSave(transaction.id!, {
				type: formData.type,
				amount: parseFloat(formData.amount),
				category: formData.category,
				description: formData.description,
				date: formData.date,
			})
			onClose()
		} catch (error) {
			if (error && typeof error === 'object' && 'message' in error) {
				setErrors([{ field: 'general', message: error.message as string }])
			} else {
				setErrors([
					{
						field: 'general',
						message: 'Произошла ошибка при обновлении транзакции',
					},
				])
			}
		} finally {
			setIsLoading(false)
		}
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
			<div className='bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto'>
				<div className='flex items-center justify-between mb-4 sm:mb-6'>
					<h2 className='text-lg sm:text-xl md:text-2xl font-bold text-white'>
						Редактировать транзакцию
					</h2>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-white transition-colors p-1'
					>
						<svg
							className='w-5 h-5 sm:w-6 sm:h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				{errors.length > 0 && (
					<div className='mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg'>
						{errors.map((error, index) => (
							<p key={index} className='text-red-400 text-sm'>
								{error.message}
							</p>
						))}
					</div>
				)}

				<form onSubmit={handleSubmit} className='space-y-3 sm:space-y-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
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

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
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

					<div className='flex flex-col sm:flex-row gap-3 pt-4'>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base'
						>
							Отмена
						</button>
						<button
							type='submit'
							disabled={isLoading}
							className='flex-1 px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 text-sm sm:text-base'
						>
							{isLoading ? 'Сохранение...' : 'Сохранить'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
