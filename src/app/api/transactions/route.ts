import { NextRequest, NextResponse } from 'next/server'
import {
	getTransactions,
	addTransaction,
	getBalance,
} from '@/lib/database-supabase'
import { validateTransaction, formatValidationErrors } from '@/lib/validation'

// GET - получение всех транзакций
export async function GET() {
	try {
		const [transactions, balance] = await Promise.all([
			getTransactions(),
			getBalance(),
		])

		return NextResponse.json({ transactions, balance })
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

		// Валидация данных
		const validation = validateTransaction({
			type,
			amount,
			category,
			description,
			date,
		})

		if (!validation.isValid) {
			return NextResponse.json(
				{
					error: 'Validation failed',
					details: validation.errors,
					message: formatValidationErrors(validation.errors),
				},
				{ status: 400 }
			)
		}

		await addTransaction({
			type,
			amount,
			category,
			description,
			date: date || new Date().toISOString().split('T')[0],
		})

		// Получаем обновленные данные
		const [transactions, balance] = await Promise.all([
			getTransactions(),
			getBalance(),
		])

		return NextResponse.json({ transactions, balance })
	} catch (error) {
		console.error('Error adding transaction:', error)
		return NextResponse.json(
			{ error: 'Failed to add transaction' },
			{ status: 500 }
		)
	}
}
