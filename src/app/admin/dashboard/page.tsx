"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  LogOut,
  Package,
  Users,

  Settings,
  Search,
  Copy,
  Image,
  MessageCircle,
  BookOpen,
  FileText,
  Tag
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { ItemManagementModal } from "@/components/ItemManagementModal"
import { GameManagementModal } from "@/components/GameManagementModal"
import { CategoryManagementModal } from "@/components/CategoryManagementModal"

import { ImageLibrary } from "@/components/ImageLibrary"
import { SocialContact } from "@/components/SocialContact"
import { getDatabase } from "@/lib/database"
import type { Game, Item, BlogPost, Category, GameCategory } from "@/lib/database"

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [activeTab, setActiveTab] = useState("items")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showGameModal, setShowGameModal] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showImageLibrary, setShowImageLibrary] = useState(false)
  const [selectedImageForItem, setSelectedImageForItem] = useState<string>("")
  const [selectedGameFilter, setSelectedGameFilter] = useState("all")
  const router = useRouter()

  // 登出
  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminLoginTime")
    router.push("/admin")
  }, [router])

  // 检查登录状态
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("adminLoggedIn")
      const loginTime = localStorage.getItem("adminLoginTime")

      if (isLoggedIn === "true" && loginTime) {
        const currentTime = new Date().getTime()
        const sessionDuration = 24 * 60 * 60 * 1000 // 24小时

        if (currentTime - Number.parseInt(loginTime) < sessionDuration) {
          setIsAuthenticated(true)
          loadData()
        } else {
          // 会话过期
          handleLogout()
        }
      } else {
        router.push("/admin")
      }
    }

    checkAuth()
  }, [router, handleLogout])

  // 加载数据
  const loadData = async () => {
    try {
      const database = await getDatabase()
      const [itemsData, gamesData, categoriesData, blogData] = await Promise.all([
        database.getItems(),
        database.getGames(),
        database.getCategories(),
        database.getBlogPosts()
      ])
      setItems(itemsData)
      setGames(gamesData)
      setCategories(categoriesData)
      setBlogPosts(blogData)
    } catch (error) {
      console.error('Error loading admin data:', error)
    }
  }

  // 商品 CRUD 操作
  const handleAddItem = async (itemData: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('🔍 管理后台开始添加商品:', {
        name: itemData.name,
        game: itemData.game,
        category: itemData.category,
        platform: itemData.platform,
        price: itemData.price,
        imageLength: itemData.image?.length || 0
      })

      const database = await getDatabase()
      console.log('📊 数据库连接成功')

      const result = await database.createItem(itemData)
      console.log('✅ 数据库创建商品成功:', result)

      await loadData() // 重新加载数据
      console.log('🔄 数据重新加载完成')

      setShowAddModal(false)
    } catch (error) {
      console.error('❌ 管理后台添加商品错误:', error)

      let errorMessage = 'Unknown error'
      let errorDetails = ''

      if (error instanceof Error) {
        errorMessage = error.message
        errorDetails = error.stack || ''
        console.error('🔍 详细错误信息:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        })
      }

      // 检查是否是数据库连接问题
      if (errorMessage.includes('Supabase') || errorMessage.includes('database')) {
        alert(`数据库连接错误: ${errorMessage}\n\n请检查 Supabase 配置和网络连接。`)
      } else {
        alert(`Error adding item: ${errorMessage}\n\n${errorDetails ? '技术详情: ' + errorDetails.substring(0, 200) : ''}`)
      }
    }
  }

  const handleEditItem = async (itemData: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingItem) return
    try {
      const database = await getDatabase()
      await database.updateItem(editingItem.id, itemData)
      await loadData() // 重新加载数据
      setEditingItem(null)
    } catch (error) {
      console.error('Error updating item:', error)
      alert(`Error updating item: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const database = await getDatabase()
        await database.deleteItem(id)
        await loadData() // 重新加载数据
      } catch (error) {
        console.error('Error deleting item:', error)
        alert(`Error deleting item: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  // 游戏 CRUD 操作
  const handleAddGame = async (gameData: Omit<Game, 'id' | 'created_at'>) => {
    try {
      const database = await getDatabase()
      await database.createGame(gameData)
      await loadData() // 重新加载数据
      setShowGameModal(false)
    } catch (error) {
      console.error('Error adding game:', error)
      alert(`Error adding game: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleEditGame = async (gameData: Omit<Game, 'id' | 'created_at'>) => {
    if (!editingGame) return
    try {
      const database = await getDatabase()
      await database.updateGame(editingGame.id, gameData)
      await loadData() // 重新加载数据
      setEditingGame(null)
    } catch (error) {
      console.error('Error updating game:', error)
      alert(`Error updating game: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteGame = async (id: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      try {
        const database = await getDatabase()
        await database.deleteGame(id)
        await loadData() // 重新加载数据
      } catch (error) {
        console.error('Error deleting game:', error)
        alert(`Error deleting game: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  // 分类 CRUD 操作
  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    try {
      const database = await getDatabase()
      await database.createCategory(categoryData)
      await loadData() // 重新加载数据
      setShowCategoryModal(false)
    } catch (error) {
      console.error('Error adding category:', error)
      alert(`Error adding category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleEditCategory = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    if (!editingCategory) return
    try {
      const database = await getDatabase()
      await database.updateCategory(editingCategory.id, categoryData)
      await loadData() // 重新加载数据
      setEditingCategory(null)
    } catch (error) {
      console.error('Error updating category:', error)
      alert(`Error updating category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const database = await getDatabase()
        await database.deleteCategory(id)
        await loadData() // 重新加载数据
      } catch (error) {
        console.error('Error deleting category:', error)
        alert(`Error deleting category: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  // 批量导入
  const handleBatchImport = async () => {
    const jsonInput = prompt("Enter JSON format item data:")
    if (jsonInput) {
      try {
        const importedItems = JSON.parse(jsonInput)
        const database = await getDatabase()

        for (const item of importedItems) {
          await database.createItem({
            name: item.name || 'Imported Item',
            game: item.game || 'maplestory',
            category: item.category || 'costume',
            platform: item.platform || 'PC',
            rarity: item.rarity || 'common',
            price: item.price || 0,
            quantity: item.quantity || 1,
            gold_price: item.gold_price || '0 Gold',
            image: item.image || '🎮',
            description: item.description || '',
            url: item.url || `auto-generated-url-${item.name?.toLowerCase().replace(/\s+/g, '-') || Date.now()}`,
            is_featured: item.is_featured || false,
            sort_order: item.sort_order || 0
          })
        }

        await loadData() // 重新加载数据
        alert(`Successfully imported ${importedItems.length} items`)
      } catch (error) {
        console.error('Batch import error:', error)
        alert("JSON format error, please check and try again")
      }
    }
  }

  // 导出数据
  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'items-export.json'
    link.click()
  }

  // 图片库选择处理
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageForItem(imageUrl)
    setShowImageLibrary(false)
    // 如果正在编辑商品，可以自动填充图片
    if (editingItem) {
      setEditingItem({...editingItem, image: imageUrl})
    }
  }

  // 复制ID功能
  const copyItemId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      alert('Item ID copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy ID:', err)
    }
  }

  // 过滤商品
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.game.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGame = selectedGameFilter === "all" || item.game === selectedGameFilter

    return matchesSearch && matchesGame
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex items-center justify-center">
        <div className="text-white">验证中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-600/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">宝藏猎人 管理后台</h1>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800/30 border-r border-gray-600/30 min-h-screen p-6">
          <nav className="space-y-2">
            {[
              { id: "items", icon: Package, label: "商品管理" },
              { id: "games", icon: Users, label: "游戏管理" },
              { id: "categories", icon: Tag, label: "分类管理" },
              { id: "blog", icon: BookOpen, label: "博客管理" },
              { id: "images", icon: Image, label: "图片库" },
              { id: "social", icon: MessageCircle, label: "社交联系" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "items" && (
            <div className="space-y-6">
              {/* Tools */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setEditingItem(null)
                      setShowAddModal(true)
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加商品
                  </Button>

                  <Button
                    onClick={() => setShowImageLibrary(true)}
                    variant="outline"
                    className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    图片库
                  </Button>

                  <Button
                    onClick={handleBatchImport}
                    variant="outline"
                    className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    批量导入
                  </Button>

                  <Button
                    onClick={handleExport}
                    variant="outline"
                    className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    导出数据
                  </Button>
                </div>

                {/* Game Filter and Search */}
                <div className="flex gap-4">
                  <select
                    value={selectedGameFilter}
                    onChange={(e) => setSelectedGameFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">所有游戏</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.name}>{game.display_name}</option>
                    ))}
                  </select>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="搜索商品..."
                      className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">总商品数</div>
                  <div className="text-2xl font-bold text-white">{items.length}</div>
                </div>
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">PC物品</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {items.filter(item => item.platform.toLowerCase().includes('pc')).length}
                  </div>
                </div>
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">移动端物品</div>
                  <div className="text-2xl font-bold text-green-400">
                    {items.filter(item =>
                      item.platform.toLowerCase().includes('android') ||
                      item.platform.toLowerCase().includes('ios')
                    ).length}
                  </div>
                </div>
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">今日新增</div>
                  <div className="text-2xl font-bold text-green-400">
                    {items.filter(item => {
                      const today = new Date().toDateString()
                      return new Date(item.created_at).toDateString() === today
                    }).length}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="text-left p-4 text-gray-300">商品</th>
                        <th className="text-left p-4 text-gray-300">ID</th>
                        <th className="text-left p-4 text-gray-300">游戏</th>
                        <th className="text-left p-4 text-gray-300">分类</th>
                        <th className="text-left p-4 text-gray-300">平台</th>
                        <th className="text-left p-4 text-gray-300">数量</th>
                        <th className="text-left p-4 text-gray-300">价格</th>
                        <th className="text-left p-4 text-gray-300">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="border-t border-gray-600/30 hover:bg-gray-700/30">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              {/* 修复图片显示逻辑 */}
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
                                {item.image && (item.image.startsWith('data:image') || item.image.startsWith('http')) ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error('管理后台图片加载错误:', item.name)
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                      const parent = target.parentElement
                                      if (parent) {
                                        parent.innerHTML = '<div class="text-lg">🎮</div>'
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="text-lg">
                                    {(item.image && !item.image.startsWith('data:') && !item.image.startsWith('http')) ? item.image : '🎮'}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-medium truncate">{item.name}</div>
                                <div className="text-gray-400 text-sm truncate">{item.description || '暂无描述'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-purple-300 font-mono">{item.id}</span>
                              <Button
                                size="sm"
                                onClick={() => copyItemId(item.id)}
                                className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white p-1"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                          <td className="p-4 text-blue-400">{item.game}</td>
                          <td className="p-4 text-gray-300">{item.category}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              item.platform === 'pc' ? 'bg-blue-500/20 text-blue-400' :
                              item.platform === 'android' ? 'bg-green-500/20 text-green-400' :
                              item.platform === 'ios' ? 'bg-gray-500/20 text-gray-400' :
                              item.platform === 'xbox' ? 'bg-green-600/20 text-green-400' :
                              item.platform === 'playstation' ? 'bg-blue-600/20 text-blue-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {item.platform}
                            </span>
                          </td>
                          <td className="p-4 text-yellow-400">{item.quantity || 1}</td>
                          <td className="p-4 text-green-400">${item.price}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditingItem(item)
                                  setShowAddModal(true)
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "games" && (
            <div className="space-y-6">
              {/* Game Management Tools */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setEditingGame(null)
                      setShowGameModal(true)
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加游戏
                  </Button>
                </div>
              </div>

              {/* Games List */}
              <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="text-left p-4 text-gray-300">游戏</th>
                        <th className="text-left p-4 text-gray-300">内部名称</th>
                        <th className="text-left p-4 text-gray-300">商品数量</th>
                        <th className="text-left p-4 text-gray-300">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.map((game) => (
                        <tr key={game.id} className="border-t border-gray-600/30 hover:bg-gray-700/30">
                          <td className="p-4">
                            <div className="text-white font-medium">{game.display_name}</div>
                          </td>
                          <td className="p-4 text-purple-300 font-mono">{game.name}</td>
                          <td className="p-4 text-blue-400">
                            {items.filter(item => item.game === game.name).length}
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditingGame(game)
                                  setShowGameModal(true)
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDeleteGame(game.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="space-y-6">
              {/* Category Management Tools */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setEditingCategory(null)
                      setShowCategoryModal(true)
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加分类
                  </Button>
                </div>
              </div>

              {/* Categories List */}
              <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="text-left p-4 text-gray-300">分类</th>
                        <th className="text-left p-4 text-gray-300">内部名称</th>
                        <th className="text-left p-4 text-gray-300">描述</th>
                        <th className="text-left p-4 text-gray-300">商品数量</th>
                        <th className="text-left p-4 text-gray-300">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id} className="border-t border-gray-600/30 hover:bg-gray-700/30">
                          <td className="p-4">
                            <div className="text-white font-medium">{category.display_name}</div>
                          </td>
                          <td className="p-4 text-purple-300 font-mono">{category.name}</td>
                          <td className="p-4 text-gray-400">
                            <div className="max-w-xs truncate">
                              {category.description || '无描述'}
                            </div>
                          </td>
                          <td className="p-4 text-blue-400">
                            {items.filter(item => item.category === category.name).length}
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditingCategory(category)
                                  setShowCategoryModal(true)
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "blog" && (
            <div className="space-y-6">
              {/* Blog Management Tools */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加博客文章
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    管理分类
                  </Button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="搜索博客文章..."
                    className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Blog Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">总文章数</div>
                  <div className="text-2xl font-bold text-white">{blogPosts.length}</div>
                </div>
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">已发布</div>
                  <div className="text-2xl font-bold text-green-400">
                    {blogPosts.filter(post => post.published).length}
                  </div>
                </div>
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">草稿</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {blogPosts.filter(post => !post.published).length}
                  </div>
                </div>
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">总浏览量</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {blogPosts.reduce((sum, post) => sum + post.views, 0)}
                  </div>
                </div>
              </div>

              {/* Blog Posts Table */}
              <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="text-left p-4 text-gray-300">文章</th>
                        <th className="text-left p-4 text-gray-300">分类</th>
                        <th className="text-left p-4 text-gray-300">状态</th>
                        <th className="text-left p-4 text-gray-300">浏览量</th>
                        <th className="text-left p-4 text-gray-300">发布时间</th>
                        <th className="text-left p-4 text-gray-300">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>还没有博客文章</p>
                            <p className="text-sm">点击"Add Blog Post"创建第一篇文章</p>
                          </td>
                        </tr>
                      ) : (
                        blogPosts.map((post) => (
                          <tr key={post.id} className="border-t border-gray-600/30 hover:bg-gray-700/30">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{post.image}</span>
                                <div>
                                  <div className="text-white font-medium">{post.title}</div>
                                  <div className="text-gray-400 text-sm line-clamp-1">{post.excerpt}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                post.category === 'news' ? 'bg-blue-500/20 text-blue-400' :
                                post.category === 'guide' ? 'bg-green-500/20 text-green-400' :
                                post.category === 'update' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-orange-500/20 text-orange-400'
                              }`}>
                                {post.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {post.published ? '已发布' : '草稿'}
                              </span>
                            </td>
                            <td className="p-4 text-purple-300">{post.views}</td>
                            <td className="p-4 text-gray-400">
                              {new Date(post.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}



          {activeTab === "images" && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🖼️</div>
                <h3 className="text-xl text-white mb-2">图片库管理</h3>
                <p className="text-gray-400 mb-4">管理您的商品图片和表情符号</p>
                <Button
                  onClick={() => setShowImageLibrary(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  打开图片库
                </Button>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6">
              <SocialContact isAdmin={true} />
            </div>
          )}
        </main>
      </div>

      {/* Item Management Modal */}
      <ItemManagementModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingItem(null)
        }}
        onSave={editingItem ? handleEditItem : handleAddItem}
        editingItem={editingItem}
      />

      {/* Game Management Modal */}
      <GameManagementModal
        isOpen={showGameModal}
        onClose={() => {
          setShowGameModal(false)
          setEditingGame(null)
        }}
        onSave={editingGame ? handleEditGame : handleAddGame}
        editingGame={editingGame}
      />

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false)
          setEditingCategory(null)
        }}
        onSave={editingCategory ? handleEditCategory : handleAddCategory}
        editingCategory={editingCategory}
      />

      {/* Image Library */}
      <ImageLibrary
        isOpen={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
        onSelectImage={handleImageSelect}
      />
    </div>
  )
}
