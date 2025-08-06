'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(): State {
		return { hasError: true }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Error caught by boundary:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0f0f23] flex items-center justify-center p-4'>
					<div className='glass-card p-6 text-center max-w-md'>
						<h2 className='text-xl font-bold text-white mb-4'>
							Что-то пошло не так
						</h2>
						<p className='text-gray-400 mb-6'>
							Произошла неожиданная ошибка. Попробуйте обновить страницу.
						</p>
						<button
							onClick={() => window.location.reload()}
							className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300'
						>
							Обновить страницу
						</button>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}
