// Константы для типов транзакций
export const TRANSACTION_TYPES = {
	INCOME: 'income',
	EXPENSE: 'expense',
} as const

// Константы для CSS классов
export const CSS_CLASSES = {
	GLASS_CARD:
		'glass-card p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden hover-lift',
	INPUT_FIELD:
		'w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-500/50 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm sm:text-base',
	GRADIENT_BUTTON:
		'w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base',
} as const
