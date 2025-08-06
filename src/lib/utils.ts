import { TRANSACTION_TYPES, ERROR_MESSAGES } from './constants'
import { ValidationResult, FormData } from '@/types/api'

// Утилиты для форматирования валюты
export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		minimumFractionDigits: 0,
	}).format(amount)
}

// Утилиты для валидации
export const validateTransaction = (data: FormData): ValidationResult => {
	const errors: string[] = []

	if (
		!data.type ||
		!Object.values(TRANSACTION_TYPES).includes(data.type as any)
	) {
		errors.push(ERROR_MESSAGES.REQUIRED_FIELDS)
	}

	if (!data.amount || Number(data.amount) <= 0) {
		errors.push(ERROR_MESSAGES.INVALID_AMOUNT)
	}

	if (!data.category || data.category.trim().length === 0) {
		errors.push(ERROR_MESSAGES.REQUIRED_CATEGORY)
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

// Утилиты для работы с датами
export const getCurrentDate = (): string => {
	return new Date().toISOString().split('T')[0]
}

// Утилиты для обработки ошибок
export const handleApiError = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message
	}
	return ERROR_MESSAGES.API_FAILED
}

// Утилиты для форматирования дат
export const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	const today = new Date()
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)

	if (date.toDateString() === today.toDateString()) {
		return 'Сегодня'
	} else if (date.toDateString() === yesterday.toDateString()) {
		return 'Вчера'
	} else {
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})
	}
}
