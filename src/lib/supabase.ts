import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Создаем мок-клиент если переменные не настроены
const createMockClient = () => {
	return {
		from: () => ({
			select: () => ({
				order: () => ({
					limit: () => Promise.resolve({ data: [], error: null }),
				}),
				eq: () => Promise.resolve({ data: [], error: null }),
				insert: () => ({
					select: () => ({
						single: () =>
							Promise.resolve({ data: { id: Date.now() }, error: null }),
					}),
				}),
				update: () => ({
					eq: () => ({
						select: () => ({
							single: () => Promise.resolve({ data: null, error: null }),
						}),
					}),
				}),
				delete: () => ({
					eq: () => Promise.resolve({ error: null }),
				}),
			}),
		}),
	}
}

export const supabase =
	supabaseUrl && supabaseKey
		? createClient(supabaseUrl, supabaseKey)
		: (createMockClient() as any)
