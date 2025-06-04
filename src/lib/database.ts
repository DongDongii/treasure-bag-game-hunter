// Core database interfaces
export interface Item {
  id: string
  name: string
  game: string
  category: string // 现在指向 GameCategory 的 id
  platform: string // 支持逗号分隔的多个平台：PC, Xbox, PlayStation, Nintendo Switch, iOS, Android
  price: number
  quantity?: number
  gold_price: string
  image: string // 支持URL或base64数据
  rarity: string
  description: string
  url: string
  is_featured: boolean // 是否置顶/推荐
  sort_order: number // 排序权重，数字越大越靠前
  created_at: string
  updated_at: string
}

export interface Game {
  id: string
  name: string
  display_name: string
  gold_rate: number
  supported_platforms: string | string[] // 支持的平台，可以是逗号分隔字符串或数组：PC,Xbox,PS4,PS5,NS,iOS,Android
  created_at: string
}

export interface Category {
  id: string
  name: string
  display_name: string
  description?: string
  created_at: string
}

// 新增：游戏专属分类
export interface GameCategory {
  id: string
  game_id: string // 关联到 Game.id
  name: string // 内部标识符，如 'weapon', 'armor'
  display_name: string // 显示名称，如 '武器', '防具'
  description?: string
  sort_order: number // 分类排序
  created_at: string
}

export interface Rarity {
  id: string
  name: string
  display_name: string
  color: string
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  image: string
  published: boolean
  created_at: string
  updated_at: string
  views: number
  reading_time: number
}

export interface BlogCategory {
  id: string
  name: string
  display_name: string
  description: string
  created_at: string
}

// 社交联系接口
export interface SocialContact {
  id: string
  platform: string
  username: string
  url: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// Database interface for operations
export interface DatabaseInterface {
  // Initialization
  initializeBaseData(): Promise<void>

  // Items
  getItems(): Promise<Item[]>
  getItem(id: string): Promise<Item | null>
  createItem(itemData: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item>
  updateItem(id: string, itemData: Partial<Item>): Promise<Item>
  deleteItem(id: string): Promise<void>

  // Games
  getGames(): Promise<Game[]>
  getGame(id: string): Promise<Game | null>
  getGameByName(name: string): Promise<Game | null>
  createGame(gameData: Omit<Game, 'id' | 'created_at'>): Promise<Game>
  updateGame(id: string, gameData: Partial<Game>): Promise<Game>
  deleteGame(id: string): Promise<void>

  // Categories
  getCategories(): Promise<Category[]>
  getCategory(id: string): Promise<Category | null>
  getCategoryByName(name: string): Promise<Category | null>
  createCategory(categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category>
  updateCategory(id: string, categoryData: Partial<Category>): Promise<Category>
  deleteCategory(id: string): Promise<void>

  // Game Categories (游戏专属分类)
  getGameCategories(gameId?: string): Promise<GameCategory[]>
  getGameCategory(id: string): Promise<GameCategory | null>
  createGameCategory(categoryData: Omit<GameCategory, 'id' | 'created_at'>): Promise<GameCategory>
  updateGameCategory(id: string, categoryData: Partial<GameCategory>): Promise<GameCategory>
  deleteGameCategory(id: string): Promise<void>

  // Rarities
  getRarities(): Promise<Rarity[]>
  getRarity(id: string): Promise<Rarity | null>
  getRarityByName(name: string): Promise<Rarity | null>
  createRarity(rarityData: Omit<Rarity, 'id' | 'created_at'>): Promise<Rarity>
  updateRarity(id: string, rarityData: Partial<Rarity>): Promise<Rarity>
  deleteRarity(id: string): Promise<void>

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>
  getBlogPost(id: string): Promise<BlogPost | null>
  createBlogPost(postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost>
  updateBlogPost(id: string, postData: Partial<BlogPost>): Promise<BlogPost>
  deleteBlogPost(id: string): Promise<void>

  // Blog Categories
  getBlogCategories(): Promise<BlogCategory[]>
  getBlogCategory(id: string): Promise<BlogCategory | null>
  createBlogCategory(categoryData: Omit<BlogCategory, 'id' | 'created_at'>): Promise<BlogCategory>
  updateBlogCategory(id: string, categoryData: Partial<BlogCategory>): Promise<BlogCategory>
  deleteBlogCategory(id: string): Promise<void>

  // Social Contacts
  getSocialContacts(): Promise<SocialContact[]>
  getSocialContact(id: string): Promise<SocialContact | null>
  createSocialContact(contactData: Omit<SocialContact, 'id' | 'created_at' | 'updated_at'>): Promise<SocialContact>
  updateSocialContact(id: string, contactData: Partial<SocialContact>): Promise<SocialContact>
  deleteSocialContact(id: string): Promise<void>

  // Data Migration
  migrateItemCategories?(): Promise<void>
}

// Supabase database implementation
import { SupabaseDatabase } from './supabase-database'

let dbInstance: DatabaseInterface | null = null
let isInitialized = false

export async function getDatabase(): Promise<DatabaseInterface> {
  if (!dbInstance) {
    // 检查是否有有效的Supabase配置
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const isValidSupabaseUrl = supabaseUrl && supabaseUrl !== 'your_supabase_project_url_here' && supabaseUrl.includes('supabase.co')
    const isValidSupabaseKey = supabaseKey && supabaseKey !== 'your_supabase_anon_key_here' && supabaseKey.length > 20

    if (!isValidSupabaseUrl || !isValidSupabaseKey) {
      throw new Error('❌ Supabase 配置无效！请在 .env.local 文件中配置真实的 Supabase URL 和 API Key。访问 /setup 页面获取配置指南。')
    }

    try {
      console.log('🚀 使用 Supabase 数据库')
      dbInstance = new SupabaseDatabase()
    } catch (error) {
      console.error('❌ Supabase 连接失败:', error)
      throw new Error(`Supabase 数据库连接失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  // 确保基础数据已初始化
  if (!isInitialized) {
    try {
      await dbInstance.initializeBaseData()
      isInitialized = true
      console.log('✅ 数据库初始化完成')
    } catch (error) {
      console.error('❌ 数据库初始化失败:', error)
      throw new Error(`数据库初始化失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  return dbInstance
}
