import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Мой кошелек - Отслеживание бюджета',
	description: 'Приложение для отслеживания доходов и расходов',
	icons: {
		icon: '/favicon.svg',
	},
	viewport:
		'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
	manifest: '/manifest.json',
	themeColor: '#6366f1',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru'>
			<head>
				<link rel='manifest' href='/manifest.json' />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ServiceWorkerRegistration />
				{children}
			</body>
		</html>
	)
}
