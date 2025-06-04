import { supabase } from './supabase'
import type { DatabaseInterface, Item, Game, Category, GameCategory, Rarity, BlogPost, BlogCategory, SocialContact } from './database'
import type { DatabaseItem, DatabaseGame, DatabaseCategory, DatabaseRarity } from './supabase'

// Transform Supabase data to app format
function transformItem(dbItem: DatabaseItem): Item {
  return {
    id: dbItem.id,
    name: dbItem.name,
    game: dbItem.games?.name || '',
    category: dbItem.categories?.name || '',
    platform: dbItem.platform || 'PC',
    price: dbItem.price,
    quantity: dbItem.quantity || 1,
    gold_price: dbItem.gold_price,
    image: dbItem.image,
    rarity: dbItem.rarities?.name || '',
    description: dbItem.description || '',
    url: dbItem.url,
    is_featured: dbItem.is_featured || false,
    sort_order: dbItem.sort_order || 0,
    created_at: dbItem.created_at,
    updated_at: dbItem.updated_at
  }
}

function transformGame(dbGame: DatabaseGame): Game {
  return {
    id: dbGame.id,
    name: dbGame.name,
    display_name: dbGame.display_name,
    gold_rate: dbGame.gold_rate,
    created_at: dbGame.created_at
  }
}

function transformCategory(dbCategory: DatabaseCategory): Category {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    display_name: dbCategory.display_name,
    description: dbCategory.description,
    created_at: dbCategory.created_at
  }
}

function transformRarity(dbRarity: DatabaseRarity): Rarity {
  return {
    id: dbRarity.id,
    name: dbRarity.name,
    display_name: dbRarity.display_name,
    color: dbRarity.color,
    created_at: dbRarity.created_at
  }
}

export class SupabaseDatabase implements DatabaseInterface {
  // 初始化基础数据
  async initializeBaseData(): Promise<void> {
    console.log('Supabase 数据库已初始化，基础数据已通过数据库脚本创建')
  }

  // Items
  async getItems(): Promise<Item[]> {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching items:', error)
        return []
      }

      return data.map(item => ({
        id: item.id,
        name: item.name,
        game: item.game || '',
        category: item.category || '',
        platform: item.platform || 'PC',
        price: item.price,
        quantity: item.quantity || 1,
        gold_price: item.gold_price,
        image: item.image,
        rarity: item.rarity || '',
        description: item.description || '',
        url: item.url,
        is_featured: item.is_featured || false,
        sort_order: item.sort_order || 0,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))
    } catch (error) {
      console.error('Error in getItems:', error)
      return []
    }
  }

  async getItem(id: string): Promise<Item | null> {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching item:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        game: data.game || '',
        category: data.category || '',
        platform: data.platform || 'PC',
        price: data.price,
        quantity: data.quantity || 1,
        gold_price: data.gold_price,
        image: data.image,
        rarity: data.rarity || '',
        description: data.description || '',
        url: data.url,
        is_featured: data.is_featured || false,
        sort_order: data.sort_order || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error in getItem:', error)
      return null
    }
  }

  async createItem(itemData: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item> {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert({
          name: itemData.name,
          game: itemData.game,
          category: itemData.category,
          platform: itemData.platform,
          price: itemData.price,
          quantity: itemData.quantity,
          gold_price: itemData.gold_price,
          image: itemData.image,
          rarity: itemData.rarity,
          description: itemData.description,
          url: itemData.url,
          is_featured: itemData.is_featured,
          sort_order: itemData.sort_order
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating item:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        game: data.game || '',
        category: data.category || '',
        platform: data.platform || 'PC',
        price: data.price,
        quantity: data.quantity || 1,
        gold_price: data.gold_price,
        image: data.image,
        rarity: data.rarity || '',
        description: data.description || '',
        url: data.url,
        is_featured: data.is_featured || false,
        sort_order: data.sort_order || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error in createItem:', error)
      throw error
    }
  }

  async updateItem(id: string, itemData: Partial<Item>): Promise<Item> {
    try {
      const { data, error } = await supabase
        .from('items')
        .update({
          ...(itemData.name && { name: itemData.name }),
          ...(itemData.game && { game: itemData.game }),
          ...(itemData.category && { category: itemData.category }),
          ...(itemData.platform && { platform: itemData.platform }),
          ...(itemData.price !== undefined && { price: itemData.price }),
          ...(itemData.quantity !== undefined && { quantity: itemData.quantity }),
          ...(itemData.gold_price && { gold_price: itemData.gold_price }),
          ...(itemData.image && { image: itemData.image }),
          ...(itemData.rarity && { rarity: itemData.rarity }),
          ...(itemData.description !== undefined && { description: itemData.description }),
          ...(itemData.url && { url: itemData.url }),
          ...(itemData.is_featured !== undefined && { is_featured: itemData.is_featured }),
          ...(itemData.sort_order !== undefined && { sort_order: itemData.sort_order })
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating item:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        game: data.game || '',
        category: data.category || '',
        platform: data.platform || 'PC',
        price: data.price,
        quantity: data.quantity || 1,
        gold_price: data.gold_price,
        image: data.image,
        rarity: data.rarity || '',
        description: data.description || '',
        url: data.url,
        is_featured: data.is_featured || false,
        sort_order: data.sort_order || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error in updateItem:', error)
      throw error
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting item:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteItem:', error)
      throw error
    }
  }

  // Games
  async getGames(): Promise<Game[]> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching games:', error)
        return []
      }

      return data.map(game => ({
        id: game.id,
        name: game.name,
        display_name: game.display_name,
        gold_rate: game.gold_rate,
        created_at: game.created_at
      }))
    } catch (error) {
      console.error('Error in getGames:', error)
      return []
    }
  }

  async getGame(id: string): Promise<Game | null> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching game:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        gold_rate: data.gold_rate,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in getGame:', error)
      return null
    }
  }

  async getGameByName(name: string): Promise<Game | null> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('name', name)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching game by name:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        gold_rate: data.gold_rate,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in getGameByName:', error)
      return null
    }
  }

  async createGame(gameData: Omit<Game, 'id' | 'created_at'>): Promise<Game> {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert({
          name: gameData.name,
          display_name: gameData.display_name,
          gold_rate: gameData.gold_rate
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating game:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        gold_rate: data.gold_rate,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in createGame:', error)
      throw error
    }
  }

  async updateGame(id: string, gameData: Partial<Game>): Promise<Game> {
    try {
      const { data, error } = await supabase
        .from('games')
        .update({
          ...(gameData.name && { name: gameData.name }),
          ...(gameData.display_name && { display_name: gameData.display_name }),
          ...(gameData.gold_rate !== undefined && { gold_rate: gameData.gold_rate })
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating game:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        gold_rate: data.gold_rate,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in updateGame:', error)
      throw error
    }
  }

  async deleteGame(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting game:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteGame:', error)
      throw error
    }
  }

  // Categories - 简化实现，使用基本的categories表
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching categories:', error)
        return []
      }

      return data.map(category => ({
        id: category.id,
        name: category.name,
        display_name: category.display_name,
        description: category.description,
        created_at: category.created_at
      }))
    } catch (error) {
      console.error('Error in getCategories:', error)
      return []
    }
  }

  async getCategory(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching category:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in getCategory:', error)
      return null
    }
  }

  async getCategoryByName(name: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('name', name)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching category by name:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in getCategoryByName:', error)
      return null
    }
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          display_name: categoryData.display_name,
          description: categoryData.description
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating category:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in createCategory:', error)
      throw error
    }
  }

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...(categoryData.name && { name: categoryData.name }),
          ...(categoryData.display_name && { display_name: categoryData.display_name }),
          ...(categoryData.description !== undefined && { description: categoryData.description })
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating category:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in updateCategory:', error)
      throw error
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting category:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteCategory:', error)
      throw error
    }
  }

  // Game Categories
  async getGameCategories(gameId?: string): Promise<GameCategory[]> {
    try {
      let query = supabase.from('game_categories').select('*').order('sort_order', { ascending: true })

      if (gameId) {
        query = query.eq('game_id', gameId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching game categories:', error)
        return []
      }

      return data.map(category => ({
        id: category.id,
        game_id: category.game_id,
        name: category.name,
        display_name: category.display_name,
        description: category.description,
        sort_order: category.sort_order,
        created_at: category.created_at
      }))
    } catch (error) {
      console.error('Error in getGameCategories:', error)
      return []
    }
  }

  async getGameCategory(id: string): Promise<GameCategory | null> {
    try {
      const { data, error } = await supabase
        .from('game_categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching game category:', error)
        return null
      }

      return {
        id: data.id,
        game_id: data.game_id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        sort_order: data.sort_order,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in getGameCategory:', error)
      return null
    }
  }

  async createGameCategory(categoryData: Omit<GameCategory, 'id' | 'created_at'>): Promise<GameCategory> {
    try {
      const { data, error } = await supabase
        .from('game_categories')
        .insert({
          game_id: categoryData.game_id,
          name: categoryData.name,
          display_name: categoryData.display_name,
          description: categoryData.description,
          sort_order: categoryData.sort_order
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating game category:', error)
        throw error
      }

      return {
        id: data.id,
        game_id: data.game_id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        sort_order: data.sort_order,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in createGameCategory:', error)
      throw error
    }
  }

  async updateGameCategory(id: string, categoryData: Partial<GameCategory>): Promise<GameCategory> {
    try {
      const { data, error } = await supabase
        .from('game_categories')
        .update({
          ...(categoryData.game_id && { game_id: categoryData.game_id }),
          ...(categoryData.name && { name: categoryData.name }),
          ...(categoryData.display_name && { display_name: categoryData.display_name }),
          ...(categoryData.description !== undefined && { description: categoryData.description }),
          ...(categoryData.sort_order !== undefined && { sort_order: categoryData.sort_order })
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating game category:', error)
        throw error
      }

      return {
        id: data.id,
        game_id: data.game_id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        sort_order: data.sort_order,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in updateGameCategory:', error)
      throw error
    }
  }

  async deleteGameCategory(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('game_categories')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting game category:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteGameCategory:', error)
      throw error
    }
  }

  // Rarities
  async getRarities(): Promise<Rarity[]> {
    try {
      const { data, error } = await supabase
        .from('rarities')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching rarities:', error)
        return []
      }

      return data.map(rarity => ({
        id: rarity.id,
        name: rarity.name,
        display_name: rarity.display_name,
        color: rarity.color,
        created_at: rarity.created_at
      }))
    } catch (error) {
      console.error('Error in getRarities:', error)
      return []
    }
  }

  async getRarity(id: string): Promise<Rarity | null> {
    try {
      const { data, error } = await supabase
        .from('rarities')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching rarity:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        color: data.color,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in getRarity:', error)
      return null
    }
  }

  async getRarityByName(name: string): Promise<Rarity | null> {
    try {
      const { data, error } = await supabase
        .from('rarities')
        .select('*')
        .eq('name', name)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching rarity by name:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        color: data.color,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in getRarityByName:', error)
      return null
    }
  }

  async createRarity(rarityData: Omit<Rarity, 'id' | 'created_at'>): Promise<Rarity> {
    try {
      const { data, error } = await supabase
        .from('rarities')
        .insert({
          name: rarityData.name,
          display_name: rarityData.display_name,
          color: rarityData.color
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating rarity:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        color: data.color,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in createRarity:', error)
      throw error
    }
  }

  async updateRarity(id: string, rarityData: Partial<Rarity>): Promise<Rarity> {
    try {
      const { data, error } = await supabase
        .from('rarities')
        .update({
          ...(rarityData.name && { name: rarityData.name }),
          ...(rarityData.display_name && { display_name: rarityData.display_name }),
          ...(rarityData.color && { color: rarityData.color })
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating rarity:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        color: data.color,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in updateRarity:', error)
      throw error
    }
  }

  async deleteRarity(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('rarities')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting rarity:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteRarity:', error)
      throw error
    }
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(name, display_name)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching blog posts:', error)
        return []
      }

      return data.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        author: post.author,
        category: post.blog_categories?.name || '',
        tags: post.tags || [],
        image: post.image || '',
        published: post.published,
        created_at: post.created_at,
        updated_at: post.updated_at,
        views: post.views,
        reading_time: post.reading_time
      }))
    } catch (error) {
      console.error('Error in getBlogPosts:', error)
      return []
    }
  }

  async getBlogPost(id: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(name, display_name)
        `)
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching blog post:', error)
        return null
      }

      return {
        id: data.id,
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content,
        author: data.author,
        category: data.blog_categories?.name || '',
        tags: data.tags || [],
        image: data.image || '',
        published: data.published,
        created_at: data.created_at,
        updated_at: data.updated_at,
        views: data.views,
        reading_time: data.reading_time
      }
    } catch (error) {
      console.error('Error in getBlogPost:', error)
      return null
    }
  }

  async createBlogPost(postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    try {
      // Find category by name
      let categoryId = null
      if (postData.category) {
        const { data: categoryData } = await supabase
          .from('blog_categories')
          .select('id')
          .eq('name', postData.category)
          .single()
        categoryId = categoryData?.id
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          author: postData.author,
          category_id: categoryId,
          tags: postData.tags,
          image: postData.image,
          published: postData.published,
          views: postData.views,
          reading_time: postData.reading_time
        })
        .select(`
          *,
          blog_categories(name, display_name)
        `)
        .single()

      if (error) {
        console.error('Error creating blog post:', error)
        throw error
      }

      return {
        id: data.id,
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content,
        author: data.author,
        category: data.blog_categories?.name || '',
        tags: data.tags || [],
        image: data.image || '',
        published: data.published,
        created_at: data.created_at,
        updated_at: data.updated_at,
        views: data.views,
        reading_time: data.reading_time
      }
    } catch (error) {
      console.error('Error in createBlogPost:', error)
      throw error
    }
  }

  async updateBlogPost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    try {
      let categoryId = null
      if (postData.category) {
        const { data: categoryData } = await supabase
          .from('blog_categories')
          .select('id')
          .eq('name', postData.category)
          .single()
        categoryId = categoryData?.id
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...(postData.title && { title: postData.title }),
          ...(postData.excerpt !== undefined && { excerpt: postData.excerpt }),
          ...(postData.content && { content: postData.content }),
          ...(postData.author && { author: postData.author }),
          ...(categoryId && { category_id: categoryId }),
          ...(postData.tags && { tags: postData.tags }),
          ...(postData.image !== undefined && { image: postData.image }),
          ...(postData.published !== undefined && { published: postData.published }),
          ...(postData.views !== undefined && { views: postData.views }),
          ...(postData.reading_time !== undefined && { reading_time: postData.reading_time })
        })
        .eq('id', id)
        .select(`
          *,
          blog_categories(name, display_name)
        `)
        .single()

      if (error) {
        console.error('Error updating blog post:', error)
        throw error
      }

      return {
        id: data.id,
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content,
        author: data.author,
        category: data.blog_categories?.name || '',
        tags: data.tags || [],
        image: data.image || '',
        published: data.published,
        created_at: data.created_at,
        updated_at: data.updated_at,
        views: data.views,
        reading_time: data.reading_time
      }
    } catch (error) {
      console.error('Error in updateBlogPost:', error)
      throw error
    }
  }

  async deleteBlogPost(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting blog post:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteBlogPost:', error)
      throw error
    }
  }

  // Blog Categories
  async getBlogCategories(): Promise<BlogCategory[]> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching blog categories:', error)
        return []
      }

      return data.map(category => ({
        id: category.id,
        name: category.name,
        display_name: category.display_name,
        description: category.description,
        created_at: category.created_at
      }))
    } catch (error) {
      console.error('Error in getBlogCategories:', error)
      return []
    }
  }

  async getBlogCategory(id: string): Promise<BlogCategory | null> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching blog category:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in getBlogCategory:', error)
      return null
    }
  }

  async createBlogCategory(categoryData: Omit<BlogCategory, 'id' | 'created_at'>): Promise<BlogCategory> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .insert({
          name: categoryData.name,
          display_name: categoryData.display_name,
          description: categoryData.description
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating blog category:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in createBlogCategory:', error)
      throw error
    }
  }

  async updateBlogCategory(id: string, categoryData: Partial<BlogCategory>): Promise<BlogCategory> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .update({
          ...(categoryData.name && { name: categoryData.name }),
          ...(categoryData.display_name && { display_name: categoryData.display_name }),
          ...(categoryData.description !== undefined && { description: categoryData.description })
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating blog category:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        created_at: data.created_at
      }
    } catch (error) {
      console.error('Error in updateBlogCategory:', error)
      throw error
    }
  }

  async deleteBlogCategory(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting blog category:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteBlogCategory:', error)
      throw error
    }
  }

  // Social Contacts
  async getSocialContacts(): Promise<SocialContact[]> {
    try {
      const { data, error } = await supabase
        .from('social_contacts')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error fetching social contacts:', error)
        return []
      }

      return data.map(contact => ({
        id: contact.id,
        platform: contact.platform,
        username: contact.username,
        url: contact.url,
        is_active: contact.is_active,
        sort_order: contact.sort_order,
        created_at: contact.created_at,
        updated_at: contact.updated_at
      }))
    } catch (error) {
      console.error('Error in getSocialContacts:', error)
      return []
    }
  }

  async getSocialContact(id: string): Promise<SocialContact | null> {
    try {
      const { data, error } = await supabase
        .from('social_contacts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('Error fetching social contact:', error)
        return null
      }

      return {
        id: data.id,
        platform: data.platform,
        username: data.username,
        url: data.url,
        is_active: data.is_active,
        sort_order: data.sort_order,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error in getSocialContact:', error)
      return null
    }
  }

  async createSocialContact(contactData: Omit<SocialContact, 'id' | 'created_at' | 'updated_at'>): Promise<SocialContact> {
    try {
      const { data, error } = await supabase
        .from('social_contacts')
        .insert({
          platform: contactData.platform,
          username: contactData.username,
          url: contactData.url,
          is_active: contactData.is_active,
          sort_order: contactData.sort_order
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating social contact:', error)
        throw error
      }

      return {
        id: data.id,
        platform: data.platform,
        username: data.username,
        url: data.url,
        is_active: data.is_active,
        sort_order: data.sort_order,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error in createSocialContact:', error)
      throw error
    }
  }

  async updateSocialContact(id: string, contactData: Partial<SocialContact>): Promise<SocialContact> {
    try {
      const { data, error } = await supabase
        .from('social_contacts')
        .update({
          ...(contactData.platform && { platform: contactData.platform }),
          ...(contactData.username && { username: contactData.username }),
          ...(contactData.url && { url: contactData.url }),
          ...(contactData.is_active !== undefined && { is_active: contactData.is_active }),
          ...(contactData.sort_order !== undefined && { sort_order: contactData.sort_order })
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating social contact:', error)
        throw error
      }

      return {
        id: data.id,
        platform: data.platform,
        username: data.username,
        url: data.url,
        is_active: data.is_active,
        sort_order: data.sort_order,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error in updateSocialContact:', error)
      throw error
    }
  }

  async deleteSocialContact(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('social_contacts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting social contact:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteSocialContact:', error)
      throw error
    }
  }
}
