"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getDatabase } from '@/lib/database'
import type { Game, Item, GameCategory, Rarity } from '@/lib/database'

export default function SupabaseTestPage() {
  const [games, setGames] = useState<Game[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [gameCategories, setGameCategories] = useState<GameCategory[]>([])
  const [rarities, setRarities] = useState<Rarity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dbType, setDbType] = useState<string>('unknown')
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = useCallback((message: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }, [])

  useEffect(() => {
    async function comprehensiveTest() {
      try {
        setLoading(true)
        setError(null)
        addTestResult('开始数据库综合测试...')

        // 检测数据库类型 - 现在只支持 Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        // 检查是否是占位符值
        const isValidSupabaseUrl = supabaseUrl && supabaseUrl !== 'your_supabase_project_url_here' && supabaseUrl.includes('supabase.co')
        const isValidSupabaseKey = supabaseKey && supabaseKey !== 'your_supabase_anon_key_here' && supabaseKey.length > 20

        if (!isValidSupabaseUrl || !isValidSupabaseKey) {
          throw new Error('Supabase 配置无效！请在 .env.local 文件中配置真实的 Supabase URL 和 API Key，不要使用占位符值。')
        }

        setDbType('Supabase')
        addTestResult('数据库类型: Supabase (已配置)')

        const database = await getDatabase()
        addTestResult('数据库实例创建成功')

        // 测试基础数据获取
        addTestResult('测试基础数据获取...')

        const [gamesData, itemsData, gameCategoriesData, raritiesData] = await Promise.all([
          database.getGames(),
          database.getItems(),
          database.getGameCategories(),
          database.getRarities()
        ])

        addTestResult(`获取到 ${gamesData.length} 个游戏`)
        addTestResult(`获取到 ${itemsData.length} 个商品`)
        addTestResult(`获取到 ${gameCategoriesData.length} 个游戏分类`)
        addTestResult(`获取到 ${raritiesData.length} 个稀有度`)

        setGames(gamesData)
        setItems(itemsData)
        setGameCategories(gameCategoriesData)
        setRarities(raritiesData)

        // 测试数据创建（仅在有数据时）
        if (gamesData.length > 0 && gameCategoriesData.length > 0 && raritiesData.length > 0) {
          addTestResult('测试数据创建...')

          try {
            const testItem = await database.createItem({
              name: `测试商品 - ${Date.now()}`,
              game: gamesData[0].name,
              category: gameCategoriesData[0].id,
              platform: 'PC',
              price: 100,
              quantity: 1,
              gold_price: '1000金币',
              image: '🎮',
              rarity: raritiesData[0].name,
              description: '这是一个自动化测试创建的商品',
              url: '#',
              is_featured: false,
              sort_order: 0
            })
            addTestResult(`成功创建测试商品: ${testItem.name}`)

            // 重新获取商品列表
            const updatedItems = await database.getItems()
            setItems(updatedItems)
            addTestResult(`商品列表已更新，当前有 ${updatedItems.length} 个商品`)

          } catch (createError) {
            addTestResult(`创建测试商品失败: ${createError instanceof Error ? createError.message : '未知错误'}`)
          }
        }

        // 测试社交联系方式
        addTestResult('测试社交联系方式...')
        try {
          const socialContacts = await database.getSocialContacts()
          addTestResult(`获取到 ${socialContacts.length} 个社交联系方式`)

          if (socialContacts.length === 0) {
            addTestResult('尝试创建测试社交联系方式...')
            await database.createSocialContact({
              platform: 'telegram',
              username: '@test_user',
              url: 'https://t.me/test_user',
              is_active: true,
              sort_order: 1
            })
            addTestResult('测试社交联系方式创建成功')

            const updatedContacts = await database.getSocialContacts()
            addTestResult(`社交联系方式列表已更新，当前有 ${updatedContacts.length} 个`)
          }
        } catch (socialError) {
          addTestResult(`社交联系方式测试失败: ${socialError instanceof Error ? socialError.message : '未知错误'}`)
        }

        addTestResult('✅ 数据库综合测试完成')

      } catch (err) {
        console.error('数据库测试错误:', err)
        const errorMessage = err instanceof Error ? err.message : '未知错误'
        setError(errorMessage)
        addTestResult(`❌ 测试失败: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    comprehensiveTest()
  }, [addTestResult])

  const handleClearTestResults = () => {
    setTestResults([])
  }

  const handleRetryTest = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Supabase 数据库测试</h1>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="animate-pulse flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3" />
              <span>正在运行数据库综合测试...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Supabase 数据库测试</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleRetryTest}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              重新测试
            </button>
            <Link
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              返回管理页面
            </Link>
          </div>
        </div>

        {/* 数据库状态 */}
        <div className={`mb-6 rounded-lg p-6 border-2 ${
          error ? 'bg-red-900/20 border-red-500' : 'bg-green-900/20 border-green-500'
        }`}>
          <h2 className="text-xl font-semibold mb-4">
            {error ? '❌ 数据库连接失败' : '✅ 数据库连接成功'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="text-blue-400">当前使用:</span> {dbType}</p>
              <p><span className="text-blue-400">数据库类型:</span> Supabase Cloud Database</p>
            </div>
            <div>
              <p><span className="text-blue-400">Supabase URL:</span> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已配置' : '❌ 未配置'}</p>
              <p><span className="text-blue-400">Supabase Key:</span> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置'}</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-800/30 rounded-lg">
              <p className="font-medium">错误详情:</p>
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* 测试日志 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">测试日志</h2>
            <button
              onClick={handleClearTestResults}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-colors"
            >
              清空日志
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 h-48 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-400">暂无测试日志</p>
            ) : (
              <div className="space-y-1 font-mono text-sm">
                {testResults.map((result, index) => (
                  <div key={`${index}-${result.slice(0, 20)}`} className={`${
                    result.includes('✅') ? 'text-green-400' :
                    result.includes('❌') ? 'text-red-400' :
                    'text-gray-300'
                  }`}>
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 数据统计 */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">游戏</h3>
              <p className="text-3xl font-bold text-blue-400">{games.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">商品</h3>
              <p className="text-3xl font-bold text-green-400">{items.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">游戏分类</h3>
              <p className="text-3xl font-bold text-purple-400">{gameCategories.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">稀有度</h3>
              <p className="text-3xl font-bold text-orange-400">{rarities.length}</p>
            </div>
          </div>
        )}

        {/* 详细数据 */}
        {!error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 游戏列表 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">游戏列表</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {games.map(game => (
                  <div key={game.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <div>
                      <p className="font-medium">{game.display_name}</p>
                      <p className="text-sm text-gray-400">{game.name}</p>
                    </div>
                    <span className="text-blue-400">{game.gold_rate}率</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 最新商品 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">最新商品 (前10个)</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {items.slice(0, 10).map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">{item.game} - {item.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400">¥{item.price}</p>
                      {item.is_featured && <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">置顶</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 配置提示 */}
        {dbType === 'LocalStorage' && (
          <div className="mt-6 bg-yellow-900/20 border border-yellow-500 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">💡 切换到 Supabase</h3>
            <p className="mb-4">当前使用 LocalStorage 作为数据存储。要切换到 Supabase:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>复制 <code className="bg-gray-700 px-2 py-1 rounded">.env.example</code> 为 <code className="bg-gray-700 px-2 py-1 rounded">.env.local</code></li>
              <li>配置 Supabase 项目 URL 和密钥</li>
              <li>设置 <code className="bg-gray-700 px-2 py-1 rounded">DATABASE_PROVIDER=supabase</code></li>
              <li>运行数据库迁移脚本 <code className="bg-gray-700 px-2 py-1 rounded">supabase/schema.sql</code></li>
              <li>重启开发服务器</li>
            </ol>
            <div className="mt-4">
              <Link
                href="/docs/SUPABASE_SETUP.md"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                查看详细配置指南
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
