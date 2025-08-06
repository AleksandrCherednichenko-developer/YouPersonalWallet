interface ErrorStateProps {
	message: string
}

export default function ErrorState({ message }: ErrorStateProps) {
	return (
		<div className='min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] flex items-center justify-center p-4'>
			<div className='glass-card p-4 sm:p-6 md:p-8 text-center max-w-md'>
				<h3 className='text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4'>
					Произошла ошибка
				</h3>
				<p className='text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base'>
					{message}
				</p>
				<button
					onClick={() => window.location.reload()}
					className='px-4 sm:px-6 py-2 sm:py-3 bg-indigo-500 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-indigo-600 transition-colors text-sm sm:text-base'
				>
					Попробовать снова
				</button>
			</div>
		</div>
	)
}
