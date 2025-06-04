import { useState, useEffect, useCallback } from 'react'
import type { Game, Category, Rarity, Item } from './database'

// Custom hook for games
export function useGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/games')
      if (!response.ok) throw new Error('Failed to fetch games')
      const data = await response.json()
      setGames(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  return { games, loading, error, refetch: fetchGames }
}

// Custom hook for categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, error, refetch: fetchCategories }
}

// Custom hook for rarities
export function useRarities() {
  const [rarities, setRarities] = useState<Rarity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRarities = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/rarities')
      if (!response.ok) throw new Error('Failed to fetch rarities')
      const data = await response.json()
      setRarities(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRarities()
  }, [fetchRarities])

  return { rarities, loading, error, refetch: fetchRarities }
}

// Custom hook for items with filtering
export function useItems(filters?: {
  game?: string
  category_id?: number
  rarity_id?: number
  search?: string
  limit?: number
  offset?: number
}) {
  const [items, setItems] = useState<Item[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const searchParams = new URLSearchParams()

      if (filters?.game) searchParams.set('game', filters.game)
      if (filters?.category_id) searchParams.set('category_id', filters.category_id.toString())
      if (filters?.rarity_id) searchParams.set('rarity_id', filters.rarity_id.toString())
      if (filters?.search) searchParams.set('search', filters.search)
      if (filters?.limit) searchParams.set('limit', filters.limit.toString())
      if (filters?.offset) searchParams.set('offset', filters.offset.toString())

      const response = await fetch(`/api/items?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch items')

      const data = await response.json()
      setItems(data.items)
      setTotalCount(data.totalCount)
      setHasMore(data.hasMore)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return {
    items,
    totalCount,
    hasMore,
    loading,
    error,
    refetch: fetchItems
  }
}

// Custom hook for a single item
export function useItem(id: number | null) {
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItem = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/items/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          setItem(null)
          setError('Item not found')
          return
        }
        throw new Error('Failed to fetch item')
      }
      const data = await response.json()
      setItem(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchItem()
    }
  }, [fetchItem, id])

  return { item, loading, error, refetch: fetchItem }
}

// Utility functions for API calls
export const apiUtils = {
  // Games
  createGame: async (game: Omit<Game, 'id' | 'created_at'>) => {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game)
    })
    if (!response.ok) throw new Error('Failed to create game')
    return response.json()
  },

  updateGame: async (name: string, updates: Partial<Omit<Game, 'id' | 'created_at'>>) => {
    const response = await fetch(`/api/games/${name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Failed to update game')
    return response.json()
  },

  deleteGame: async (name: string) => {
    const response = await fetch(`/api/games/${name}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete game')
    return response.json()
  },

  // Categories
  createCategory: async (category: Omit<Category, 'id' | 'created_at'>) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    })
    if (!response.ok) throw new Error('Failed to create category')
    return response.json()
  },

  updateCategory: async (id: number, updates: Partial<Omit<Category, 'id' | 'created_at'>>) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Failed to update category')
    return response.json()
  },

  deleteCategory: async (id: number) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete category')
    return response.json()
  },

  // Rarities
  createRarity: async (rarity: Omit<Rarity, 'id' | 'created_at'>) => {
    const response = await fetch('/api/rarities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rarity)
    })
    if (!response.ok) throw new Error('Failed to create rarity')
    return response.json()
  },

  updateRarity: async (id: number, updates: Partial<Omit<Rarity, 'id' | 'created_at'>>) => {
    const response = await fetch(`/api/rarities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Failed to update rarity')
    return response.json()
  },

  deleteRarity: async (id: number) => {
    const response = await fetch(`/api/rarities/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete rarity')
    return response.json()
  },

  // Items
  createItem: async (item: Omit<Item, 'id' | 'created_at' | 'games' | 'categories' | 'rarities'>) => {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })
    if (!response.ok) throw new Error('Failed to create item')
    return response.json()
  },

  updateItem: async (id: number, updates: Partial<Omit<Item, 'id' | 'created_at' | 'games' | 'categories' | 'rarities'>>) => {
    const response = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Failed to update item')
    return response.json()
  },

  deleteItem: async (id: number) => {
    const response = await fetch(`/api/items/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete item')
    return response.json()
  }
}
