-- Создание таблицы транзакций
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы категорий
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Вставка базовых категорий
INSERT INTO categories (name, type, color) VALUES
  ('Зарплата', 'income', '#10B981'),
  ('Фриланс', 'income', '#10B981'),
  ('Продукты', 'expense', '#EF4444'),
  ('Транспорт', 'expense', '#F59E0B'),
  ('Развлечения', 'expense', '#8B5CF6'),
  ('Здоровье', 'expense', '#EC4899'),
  ('Одежда', 'expense', '#06B6D4'),
  ('Счета', 'expense', '#F97316')
ON CONFLICT (name) DO NOTHING; 
