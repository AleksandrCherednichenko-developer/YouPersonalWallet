import { NextRequest, NextResponse } from 'next/server'
import {
	deleteTransaction,
	updateTransaction,
	getTransactions,
	getBalance,
} from '@/lib/database-supabase'
import { validateTransaction, formatValidationErrors } from '@/lib/validation'

// DELETE - удаление транзакции по ID
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	try {
		const transactionId = parseInt(id)

		if (isNaN(transactionId)) {
			return NextResponse.json(
				{ error: 'Invalid transaction ID' },
				{ status: 400 }
			)
		}

		await deleteTransaction(transactionId)

		// Получаем обновленные данные
		const [transactions, balance] = await Promise.all([
			getTransactions(),
			getBalance(),
		])

		return NextResponse.json({ transactions, balance })
	} catch (error) {
		console.error('Error deleting transaction:', error)
		return NextResponse.json(
			{ error: 'Failed to delete transaction' },
			{ status: 500 }
		)
	}
}

// PUT - обновление транзакции по ID
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	try {
		const transactionId = parseInt(id)

		if (isNaN(transactionId)) {
			return NextResponse.json(
				{ error: 'Invalid transaction ID' },
				{ status: 400 }
			)
		}

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

		await updateTransaction(transactionId, {
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
		console.error('Error updating transaction:', error)
		return NextResponse.json(
			{ error: 'Failed to update transaction' },
			{ status: 500 }
		)
	}
}
