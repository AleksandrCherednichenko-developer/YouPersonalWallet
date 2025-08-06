interface ErrorStateProps {
	message: string
}

export default function ErrorState({ message }: ErrorStateProps) {
	return (
		<div className='min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] flex items-center justify-center'>
			<div className='glass-card p-8 text-center max-w-md'>
				<h3 className='text-xl font-bold text-white mb-4'>Произошла ошибка</h3>
				<p className='text-gray-400 mb-6'>{message}</p>
				<button
					onClick={() => window.location.reload()}
					className='px-6 py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors'
				>
					Попробовать снова
				</button>
			</div>
		</div>
	)
}
