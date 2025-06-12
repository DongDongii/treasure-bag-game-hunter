import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ 缺少 Supabase 环境变量! 请配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

console.log('✅ Supabase client initialized successfully')
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types from Supabase
export interface DatabaseGame {
  id: string
  name: string
  display_name: string
  gold_rate: number
  supported_platforms?: string | string[]
  created_at: string
}

export interface DatabaseCategory {
  id: string
  name: string
  display_name: string
  description?: string
  created_at: string
}

export interface DatabaseRarity {
  id: string
  name: string
  display_name: string
  color: string
  created_at: string
}

export interface DatabaseItem {
  id: string
  name: string
  game_id: string
  category_id: string
  rarity_id: string
  platform: string
  price: number
  quantity?: number
  gold_price: string
  image: string
  description: string
  url: string
  is_featured?: boolean
  sort_order?: number
  created_at: string
  updated_at: string

  // Relations
  games?: DatabaseGame
  categories?: DatabaseCategory
  rarities?: DatabaseRarity
}
