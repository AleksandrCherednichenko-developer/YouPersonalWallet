// Константы для типов транзакций
export const TRANSACTION_TYPES = {
	INCOME: 'income',
	EXPENSE: 'expense',
} as const

// Константы для CSS классов
export const CSS_CLASSES = {
	GLASS_CARD: 'glass-card p-10 shadow-2xl relative overflow-hidden hover-lift',
	INPUT_FIELD:
		'w-full px-4 py-3 bg-gray-800/50 border border-gray-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50',
	GRADIENT_BUTTON:
		'w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300',
} as const

// Константы для сообщений об ошибках
export const ERROR_MESSAGES = {
	REQUIRED_FIELDS: 'Неверный тип транзакции',
	INVALID_AMOUNT: 'Сумма должна быть больше нуля',
	REQUIRED_CATEGORY: 'Категория обязательна',
	API_FAILED: 'Произошла ошибка при обращении к серверу',
} as const
