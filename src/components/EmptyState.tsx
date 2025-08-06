export default function EmptyState() {
	return (
		<div className='glass-card p-4 sm:p-6 md:p-8 text-center'>
			<h3 className='text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4'>
				История транзакций пуста
			</h3>
			<p className='text-gray-400 text-sm sm:text-base'>
				Добавьте свою первую транзакцию, чтобы начать отслеживать бюджет
			</p>
		</div>
	)
}
