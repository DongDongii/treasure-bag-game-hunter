"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDatabase } from '@/lib/database'
import type { Game, Item } from '@/lib/database'

export default function TestDatabasePage() {
  const [games, setGames] = useState<Game[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dbType, setDbType] = useState<string>('unknown')

  useEffect(() => {
    async function testDatabase() {
      try {
        setLoading(true)
        setError(null)

        console.log('测试数据库连接...')
        const database = await getDatabase()

        // 检测数据库类型 - 现在只支持Supabase
        const hasSupabaseConfig = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        if (!hasSupabaseConfig) {
          throw new Error('Supabase 配置缺失！请访问 /setup 页面进行配置。')
        }
        setDbType('Supabase')

        console.log('数据库实例创建成功，获取数据...')
        const [gamesData, itemsData] = await Promise.all([
          database.getGames(),
          database.getItems()
        ])

        console.log('Games data:', gamesData)
        console.log('Items data:', itemsData)

        setGames(gamesData)
        setItems(itemsData)
      } catch (err) {
        console.error('数据库测试错误:', err)
        setError(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    }

    testDatabase()
  }, [])

  const handleTestAddItem = async () => {
    try {
      const database = await getDatabase()

      const testItem = {
        name: `测试商品 - ${Date.now()}`,
        game: 'maplestory',
        category: '账号',
        platform: 'PC,Xbox',
        price: 29.99,
        quantity: 1,
        gold_price: '$29.99',
        image: '🎮',
        rarity: 'common',
        description: '这是一个测试商品',
        url: `test-item-${Date.now()}`,
        is_featured: false,
        sort_order: 0
      }

      console.log('准备添加测试商品:', testItem)
      const newItem = await database.createItem(testItem)
      console.log('商品添加成功:', newItem)

      // 重新加载数据
      const [gamesData, itemsData] = await Promise.all([
        database.getGames(),
        database.getItems()
      ])
      setGames(gamesData)
      setItems(itemsData)

      alert('测试商品添加成功！')
    } catch (error) {
      console.error('添加测试商品失败:', error)
      alert(`添加测试商品失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">测试数据库连接...</h1>
        <div className="animate-pulse">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-400">数据库测试失败</h1>
        <div className="bg-red-900/20 border border-red-500 rounded p-4">
          <p>错误: {error}</p>
        </div>
        <div className="mt-4 space-y-2">
          <p>数据库: Supabase (必需)</p>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已设置' : '❌ 未设置'}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已设置' : '❌ 未设置'}</p>
          <div className="mt-4">
            <Link
              href="/setup"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white inline-block"
            >
              配置 Supabase →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4 text-green-400">数据库测试成功！</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">数据库信息:</h2>
        <div className="bg-gray-800 rounded p-4 space-y-1">
          <p><span className="text-blue-400">当前使用:</span> {dbType}</p>
          <p><span className="text-blue-400">数据库:</span> Supabase Cloud Database</p>
          <p><span className="text-blue-400">Supabase URL:</span> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已配置' : '❌ 未配置'}</p>
          <p><span className="text-blue-400">Supabase Key:</span> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置'}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">游戏数据 ({games.length}):</h2>
          <button
            onClick={handleTestAddItem}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
          >
            添加测试商品
          </button>
        </div>
        <div className="bg-gray-800 rounded p-4 space-y-2">
          {games.map(game => (
            <div key={game.id} className="p-2 bg-gray-700 rounded">
              <p><strong>{game.display_name}</strong> ({game.name})</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">商品数据 ({items.length}):</h2>
        <div className="bg-gray-800 rounded p-4 space-y-2">
          {items.map(item => (
            <div key={item.id} className="p-3 bg-gray-700 rounded">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded bg-gray-600 flex items-center justify-center">
                  {item.image && (item.image.startsWith('data:image') || item.image.startsWith('http')) ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-lg">{item.image || '🎮'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p><strong>{item.name}</strong></p>
                  <p className="text-sm text-gray-400">
                    游戏: {item.game} | 分类: {item.category} | 平台: {item.platform}
                  </p>
                  <p className="text-sm text-green-400">价格: ${item.price}</p>
                  <p className="text-sm text-gray-400">{item.description || '无描述'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Link href="/admin/dashboard" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white inline-block mr-4">
          管理后台
        </Link>
        <Link href="/items" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white inline-block mr-4">
          商品展示
        </Link>
        <Link href="/" className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white inline-block">
          返回首页
        </Link>
      </div>
    </div>
  )
}
