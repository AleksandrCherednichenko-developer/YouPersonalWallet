export default function LoadingState() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] flex items-center justify-center p-4'>
			<div className='text-center'>
				<div className='w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin mx-auto'></div>
				<p className='mt-4 sm:mt-6 text-gray-400 text-base sm:text-lg font-medium'>
					Загрузка...
				</p>
			</div>
		</div>
	)
}
