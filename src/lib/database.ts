import Database from 'better-sqlite3'
import path from 'path'
import { Transaction } from '@/types/api'

const dbPath = path.join(process.cwd(), 'wallet.db')
const db = new Database(dbPath)

// Инициализация таблиц
function createTables() {
	db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
  `)

	db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      color TEXT DEFAULT '#3B82F6'
    )
  `)

	// Создаем только необходимые индексы
	db.exec(`
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC)
  `)
}

// Инициализация базовых данных
function seedDefaultCategories() {
	const defaultCategories = [
		{ name: 'Зарплата', type: 'income', color: '#10B981' },
		{ name: 'Фриланс', type: 'income', color: '#10B981' },
		{ name: 'Продукты', type: 'expense', color: '#EF4444' },
		{ name: 'Транспорт', type: 'expense', color: '#F59E0B' },
		{ name: 'Развлечения', type: 'expense', color: '#8B5CF6' },
		{ name: 'Здоровье', type: 'expense', color: '#EC4899' },
		{ name: 'Одежда', type: 'expense', color: '#06B6D4' },
		{ name: 'Счета', type: 'expense', color: '#F97316' },
	]

	const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (name, type, color) 
    VALUES (?, ?, ?)
  `)

	defaultCategories.forEach(category => {
		insertCategory.run(category.name, category.type, category.color)
	})
}

// Инициализация базы данных
function initDatabase() {
	createTables()
	seedDefaultCategories()
}

// Функции для работы с транзакциями
export function addTransaction(
	transaction: Omit<Transaction, 'id' | 'created_at'>
) {
	const stmt = db.prepare(`
    INSERT INTO transactions (type, amount, category, description, date)
    VALUES (?, ?, ?, ?, ?)
  `)

	const result = stmt.run(
		transaction.type,
		transaction.amount,
		transaction.category,
		transaction.description || '',
		transaction.date
	)

	return result.lastInsertRowid
}

export function getTransactions(limit = 50) {
	const stmt = db.prepare(`
    SELECT * FROM transactions 
    ORDER BY date DESC, created_at DESC 
    LIMIT ?
  `)

	return stmt.all(limit) as Transaction[]
}

export function getBalance() {
	const incomeStmt = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total 
    FROM transactions 
    WHERE type = 'income'
  `)

	const expenseStmt = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total 
    FROM transactions 
    WHERE type = 'expense'
  `)

	const income = incomeStmt.get() as { total: number }
	const expense = expenseStmt.get() as { total: number }

	return {
		income: income.total,
		expense: expense.total,
		balance: income.total - expense.total,
	}
}

// Инициализируем базу данных при импорте
initDatabase()
