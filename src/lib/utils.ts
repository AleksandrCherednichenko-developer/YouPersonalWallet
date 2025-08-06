// Утилиты для форматирования валюты
export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		minimumFractionDigits: 0,
	}).format(amount)
}

// Утилиты для работы с датами
export const getCurrentDate = (): string => {
	return (
		new Date().toISOString().split('T')[0] ||
		new Date().toISOString().slice(0, 10)
	)
}

// Утилиты для обработки ошибок
export const handleApiError = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message
	}
	return 'Произошла ошибка при обращении к серверу'
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
