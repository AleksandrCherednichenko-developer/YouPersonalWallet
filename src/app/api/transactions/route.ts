import { NextRequest, NextResponse } from 'next/server'
import { getTransactions, addTransaction, getBalance } from '@/lib/database'

// GET - получение всех транзакций
export async function GET() {
	try {
		const transactions = getTransactions()
		const balance = getBalance()

		return NextResponse.json({
			transactions,
			balance,
		})
	} catch (error) {
		console.error('Error fetching transactions:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch transactions' },
			{ status: 500 }
		)
	}
}

// POST - добавление новой транзакции
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { type, amount, category, description, date } = body

		// Базовая валидация
		if (!type || !amount || !category) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			)
		}

		const transactionId = addTransaction({
			type,
			amount,
			category,
			description,
			date: date || new Date().toISOString().split('T')[0],
		})

		// Получаем обновленные данные
		const transactions = getTransactions()
		const balance = getBalance()

		return NextResponse.json({
			success: true,
			transactionId,
			transactions,
			balance,
		})
	} catch (error) {
		console.error('Error adding transaction:', error)
		return NextResponse.json(
			{ error: 'Failed to add transaction' },
			{ status: 500 }
		)
	}
}
