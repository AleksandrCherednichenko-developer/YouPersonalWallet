import { Transaction } from '@/types/api'

export interface ValidationError {
	field: string
	message: string
}

export interface ValidationResult {
	isValid: boolean
	errors: ValidationError[]
}

// Валидация суммы
export function validateAmount(amount: unknown): ValidationError | null {
	if (amount === undefined || amount === null) {
		return { field: 'amount', message: 'Сумма обязательна' }
	}

	const numAmount = Number(amount)

	if (isNaN(numAmount) || numAmount <= 0) {
		return { field: 'amount', message: 'Сумма должна быть больше нуля' }
	}

	if (numAmount > 999999999) {
		return { field: 'amount', message: 'Сумма слишком большая' }
	}

	return null
}

// Валидация категории
export function validateCategory(category: unknown): ValidationError | null {
	if (
		!category ||
		typeof category !== 'string' ||
		category.trim().length === 0
	) {
		return { field: 'category', message: 'Категория обязательна' }
	}

	if (category.length > 100) {
		return { field: 'category', message: 'Название категории слишком длинное' }
	}

	return null
}

// Валидация описания
export function validateDescription(
	description: unknown
): ValidationError | null {
	if (description === undefined || description === null) {
		return null // Описание необязательно
	}

	if (typeof description !== 'string') {
		return { field: 'description', message: 'Описание должно быть строкой' }
	}

	if (description.length > 500) {
		return { field: 'description', message: 'Описание слишком длинное' }
	}

	return null
}

// Валидация даты
export function validateDate(date: unknown): ValidationError | null {
	if (!date) {
		return null // Дата необязательна, будет установлена текущая
	}

	if (typeof date !== 'string') {
		return { field: 'date', message: 'Дата должна быть строкой' }
	}

	// Проверяем формат даты (YYYY-MM-DD)
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/
	if (!dateRegex.test(date)) {
		return {
			field: 'date',
			message: 'Неверный формат даты. Используйте YYYY-MM-DD',
		}
	}

	// Проверяем, что дата не в будущем
	const inputDate = new Date(date)
	const today = new Date()
	today.setHours(23, 59, 59, 999) // Конец дня

	if (inputDate > today) {
		return { field: 'date', message: 'Дата не может быть в будущем' }
	}

	// Проверяем, что дата не слишком старая (больше 10 лет назад)
	const tenYearsAgo = new Date()
	tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)

	if (inputDate < tenYearsAgo) {
		return { field: 'date', message: 'Дата слишком старая' }
	}

	return null
}

// Основная функция валидации транзакции
export function validateTransaction(
	data: Omit<Transaction, 'id' | 'created_at'>
): ValidationResult {
	const errors: ValidationError[] = []

	// Валидируем каждое поле
	const amountError = validateAmount(data.amount)
	if (amountError) errors.push(amountError)

	const categoryError = validateCategory(data.category)
	if (categoryError) errors.push(categoryError)

	const descriptionError = validateDescription(data.description)
	if (descriptionError) errors.push(descriptionError)

	const dateError = validateDate(data.date)
	if (dateError) errors.push(dateError)

	return {
		isValid: errors.length === 0,
		errors,
	}
}

// Функция для форматирования ошибок в читаемый вид
export function formatValidationErrors(errors: ValidationError[]): string {
	return errors.map(error => `${error.field}: ${error.message}`).join(', ')
}
