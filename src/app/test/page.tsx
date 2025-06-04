"use client"

import { useState, useEffect } from 'react'
import { getDatabase } from '@/lib/database'
import type { Game, Item } from '@/lib/database'

export default function TestPage() {
  const [games, setGames] = useState<Game[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testDatabase() {
      try {
        setLoading(true)
        setError(null)

        console.log('Testing database connection...')
        const database = await getDatabase()

        console.log('Database instance created, fetching data...')
        const [gamesData, itemsData] = await Promise.all([
          database.getGames(),
          database.getItems()
        ])

        console.log('Games data:', gamesData)
        console.log('Items data:', itemsData)

        setGames(gamesData)
        setItems(itemsData)
      } catch (err) {
        console.error('Database test error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testDatabase()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Supabase Connection...</h1>
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-400">Database Test Failed</h1>
        <div className="bg-red-900/20 border border-red-500 rounded p-4">
          <p>Error: {error}</p>
        </div>
        <div className="mt-4">
          <p>Provider: {process.env.NEXT_PUBLIC_DATABASE_PROVIDER || 'localStorage'}</p>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4 text-green-400">Database Test Successful!</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Configuration:</h2>
        <div className="bg-gray-800 rounded p-4">
          <p>Provider: {process.env.NEXT_PUBLIC_DATABASE_PROVIDER || 'localStorage'}</p>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Not set'}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Games ({games.length}):</h2>
        <div className="bg-gray-800 rounded p-4">
          {games.map(game => (
            <div key={game.id} className="mb-2 p-2 bg-gray-700 rounded">
              <p><strong>{game.display_name}</strong> ({game.name})</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Items ({items.length}):</h2>
        <div className="bg-gray-800 rounded p-4">
          {items.map(item => (
            <div key={item.id} className="mb-2 p-2 bg-gray-700 rounded">
              <p><strong>{item.name}</strong> {item.image}</p>
              <p>Game: {item.game} | Category: {item.category} | Rarity: {item.rarity}</p>
              <p>Price: ${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
