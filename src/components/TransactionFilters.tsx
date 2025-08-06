'use client'

import { useState } from 'react'
import { CSS_CLASSES } from '@/lib/constants'

export interface FilterOptions {
	search: string
	type: 'all' | 'income' | 'expense'
	category: string
	dateFrom: string
	dateTo: string
	sortBy: 'date' | 'amount' | 'category'
	sortOrder: 'asc' | 'desc'
}

interface TransactionFiltersProps {
	filters: FilterOptions
	onFiltersChange: (filters: FilterOptions) => void
	categories: string[]
}

export default function TransactionFilters({
	filters,
	onFiltersChange,
	categories,
}: TransactionFiltersProps) {
	const [isExpanded, setIsExpanded] = useState(false)

	const handleFilterChange = (field: keyof FilterOptions, value: string) => {
		onFiltersChange({
			...filters,
			[field]: value,
		})
	}

	const handleSortChange = (value: string) => {
		const [sortBy, sortOrder] = value.split('-') as [
			'date' | 'amount' | 'category',
			'asc' | 'desc'
		]
		onFiltersChange({
			...filters,
			sortBy,
			sortOrder,
		})
	}

	const clearFilters = () => {
		onFiltersChange({
			search: '',
			type: 'all',
			category: '',
			dateFrom: '',
			dateTo: '',
			sortBy: 'date',
			sortOrder: 'desc',
		})
	}

	const hasActiveFilters =
		filters.search !== '' ||
		filters.type !== 'all' ||
		filters.category !== '' ||
		filters.dateFrom !== '' ||
		filters.dateTo !== ''

	return (
		<div className='relative'>
			<div className={CSS_CLASSES.GLASS_CARD}>
				<div className='relative z-10'>
					{/* Заголовок фильтров */}
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center'>
							<div className='w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg hover-lift neon-glow'>
								<svg
									className='w-6 h-6 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z'
									/>
								</svg>
							</div>
							<div>
								<h3 className='text-xl font-bold text-white mb-1'>
									Фильтры и поиск
								</h3>
								<p className='text-gray-400 text-sm'>
									Найдите нужные транзакции
								</p>
							</div>
						</div>
						<div className='flex gap-2'>
							{hasActiveFilters && (
								<button
									onClick={clearFilters}
									className='px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors'
								>
									Очистить
								</button>
							)}
							<button
								onClick={() => setIsExpanded(!isExpanded)}
								className='px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-colors'
							>
								{isExpanded ? 'Скрыть' : 'Показать'}
							</button>
						</div>
					</div>

					{/* Основные фильтры (всегда видны) */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
						{/* Поиск */}
						<div>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Поиск
							</label>
							<input
								type='text'
								value={filters.search}
								onChange={e => handleFilterChange('search', e.target.value)}
								placeholder='По описанию или категории...'
								className={CSS_CLASSES.INPUT_FIELD}
							/>
						</div>

						{/* Тип транзакции */}
						<div>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Тип
							</label>
							<select
								value={filters.type}
								onChange={e => handleFilterChange('type', e.target.value)}
								className={CSS_CLASSES.INPUT_FIELD}
							>
								<option value='all'>Все</option>
								<option value='income'>Доходы</option>
								<option value='expense'>Расходы</option>
							</select>
						</div>

						{/* Сортировка */}
						<div>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Сортировка
							</label>
							<select
								value={`${filters.sortBy}-${filters.sortOrder}`}
								onChange={e => handleSortChange(e.target.value)}
								className={CSS_CLASSES.INPUT_FIELD}
							>
								<option value='date-desc'>Дата (новые)</option>
								<option value='date-asc'>Дата (старые)</option>
								<option value='amount-desc'>Сумма (большие)</option>
								<option value='amount-asc'>Сумма (малые)</option>
								<option value='category-asc'>Категория (А-Я)</option>
								<option value='category-desc'>Категория (Я-А)</option>
							</select>
						</div>
					</div>

					{/* Дополнительные фильтры (скрыты по умолчанию) */}
					{isExpanded && (
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700'>
							{/* Категория */}
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									Категория
								</label>
								<select
									value={filters.category}
									onChange={e => handleFilterChange('category', e.target.value)}
									className={CSS_CLASSES.INPUT_FIELD}
								>
									<option value=''>Все категории</option>
									{categories.map(category => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>

							{/* Дата от */}
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									Дата от
								</label>
								<input
									type='date'
									value={filters.dateFrom}
									onChange={e => handleFilterChange('dateFrom', e.target.value)}
									className={CSS_CLASSES.INPUT_FIELD}
								/>
							</div>

							{/* Дата до */}
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									Дата до
								</label>
								<input
									type='date'
									value={filters.dateTo}
									onChange={e => handleFilterChange('dateTo', e.target.value)}
									className={CSS_CLASSES.INPUT_FIELD}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
