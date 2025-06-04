"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Search, Copy, Package, ArrowLeft, Share2, Filter, Check } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { LanguageSelector } from "@/components/LanguageSelector"
import { getDatabase } from "@/lib/database"
import type { Item, Game, Category } from "@/lib/database"

// 加载组件
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black">
      <header className="bg-gray-800/50 border-b border-gray-600/30 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">商品目录</h1>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-600/30 rounded-2xl p-6 animate-pulse">
              <div className="h-20 bg-gray-700/50 rounded mb-4" />
              <div className="h-4 bg-gray-700/50 rounded mb-2" />
              <div className="h-4 bg-gray-700/50 rounded w-3/4" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// 分离搜索参数处理组件
function ItemsPageContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()

  const [items, setItems] = useState<Item[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGame, setSelectedGame] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Platform constants
  const platforms = ['PC', 'Xbox', 'PS4', 'PS5', 'NS', 'iOS', 'Android']

  // 获取分类显示名称
  const getCategoryDisplayName = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName)
    return category ? category.display_name : categoryName
  }

  // 处理URL参数
  useEffect(() => {
    const gameParam = searchParams.get('game')
    if (gameParam) {
      setSelectedGame(gameParam)
    }
  }, [searchParams])

  useEffect(() => {
    async function loadData() {
      try {
        const database = await getDatabase()

        const [itemsData, gamesData, categoriesData] = await Promise.all([
          database.getItems(),
          database.getGames(),
          database.getCategories()
        ])
        setItems(itemsData)
        setGames(gamesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading items:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // 过滤商品
  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGame = selectedGame === "all" || item.game === selectedGame

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

    // 修复平台过滤逻辑 - 支持多平台字符串
    const matchesPlatform = selectedPlatform === "all" ||
      item.platform.toLowerCase().includes(selectedPlatform.toLowerCase())

    return matchesSearch && matchesGame && matchesCategory && matchesPlatform
  })

  // 获取商品的主要平台（用于显示）
  const getPrimaryPlatform = (platformString: string) => {
    const platforms = platformString.split(',').map(p => p.trim())
    return platforms[0] // 返回第一个平台作为主要平台
  }

  // 平台名称标准化映射
  const normalizePlatformName = (platform: string) => {
    const normalized = platform.toLowerCase().trim()
    switch (normalized) {
      case 'playstation': return 'PS4'
      case 'nintendo switch': return 'NS'
      case 'epic games': return 'Epic'
      default: return platform.trim()
    }
  }

  // 获取所有支持的平台列表
  const getAllPlatforms = (platformString: string) => {
    return platformString.split(',').map(p => normalizePlatformName(p))
  }

  // 根据当前选择的平台过滤器确定显示的平台
  const getDisplayPlatform = (platformString: string) => {
    const platforms = getAllPlatforms(platformString)

    // 如果当前有选择特定平台，且商品支持该平台，则显示该平台
    if (selectedPlatform !== "all") {
      const matchingPlatform = platforms.find(p =>
        p.toLowerCase().includes(selectedPlatform.toLowerCase())
      )
      if (matchingPlatform) {
        return matchingPlatform
      }
    }

    // 否则显示主要平台
    return platforms[0]
  }

  // 格式化平台显示文本（仅用于多平台情况）
  const formatPlatformDisplay = (platformString: string) => {
    const platforms = getAllPlatforms(platformString)
    if (platforms.length === 1) {
      return platforms[0]
    }
    if (platforms.length === 2) {
      return platforms.join(' + ')
    }
    return `${platforms[0]} +${platforms.length - 1}`
  }

  // 复制商品完整信息
  const copyItemInfo = async (item: Item) => {
    try {
      // 根据当前选择的平台过滤器确定要复制的平台信息
      let platformInfo = ''

      if (selectedPlatform === "all") {
        // 如果是"全部平台"，显示所有支持的平台
        const platforms = getAllPlatforms(item.platform)
        const platformList = platforms.map(p => `${getPlatformIcon(p)} ${p}`).join(' ')
        platformInfo = `🎮 Supported Platforms: ${platformList}`
      } else {
        // 如果选择了特定平台，只显示该平台
        const displayPlatform = getDisplayPlatform(item.platform)
        platformInfo = `🎮 Platform: ${getPlatformIcon(displayPlatform)} ${displayPlatform}`
      }

      const itemInfo = `${platformInfo}
ID: ${item.id}
Game: ${item.game}
Item Name: ${item.name}
Category: ${getCategoryDisplayName(item.category)}
Price: ${item.price}
Description: ${item.description}`

      await navigator.clipboard.writeText(itemInfo)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy item info:', err)
    }
  }

  // 分享功能
  const contactUs = () => {
    // 跳转到首页的联系我们部分
    window.location.href = '/#contact'
  }

  // 获取平台图标
  const getPlatformIcon = (platform: string) => {
    const normalizedPlatform = platform.toLowerCase().trim()
    switch (normalizedPlatform) {
      case 'pc': return '💻'
      case 'xbox': return '🎮'
      case 'playstation':
      case 'ps4':
      case 'ps5': return '🎮'
      case 'nintendo switch':
      case 'ns': return '🎮'
      case 'ios': return '📱'
      case 'android': return '📱'
      case 'steam': return '🎮'
      case 'epic games': return '🎮'
      default: return '🎯'
    }
  }

  // 获取平台颜色
  const getPlatformColor = (platform: string) => {
    const normalizedPlatform = platform.toLowerCase().trim()
    switch (normalizedPlatform) {
      case 'pc': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'xbox': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'playstation':
      case 'ps4':
      case 'ps5': return 'bg-blue-600/20 text-blue-300 border-blue-600/30'
      case 'nintendo switch':
      case 'ns': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'ios': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'android': return 'bg-green-600/20 text-green-300 border-green-600/30'
      case 'steam': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
      case 'epic games': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-600/30 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('items.backHome')}
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">{t('items.title')}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">
              {t('items.totalItems')}: {filteredItems.length}
            </span>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('items.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Game Filter */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-2">{t('items.gameType')}</label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{t('items.allGames')}</option>
                {games.map(game => (
                  <option key={game.id} value={game.name}>{game.display_name}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-2">{t('items.category')}</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{t('items.allCategories')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.display_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Platforms</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {getPlatformIcon(platform)} {platform}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-600/30 rounded-2xl p-6 animate-pulse">
                <div className="h-20 bg-gray-700/50 rounded mb-4" />
                <div className="h-4 bg-gray-700/50 rounded mb-2" />
                <div className="h-4 bg-gray-700/50 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">{t('items.noResults')}</h3>
            <p className="text-gray-400">{t('items.adjustFilters')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="bg-gradient-to-br from-gray-800/80 to-purple-900/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl overflow-hidden hover:from-gray-700/80 hover:to-purple-800/50 hover:border-purple-500/50 transition-all duration-300 group hover:scale-105"
              >
                {/* Item Image */}
                <div className="relative w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden">
                  {(item.image.startsWith('http') || item.image.startsWith('data:image')) ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.error('商品展示页图片加载错误:', item.name)
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="flex items-center justify-center w-full h-full text-6xl text-gray-400">🎮</div>'
                        }
                      }}
                    />
                  ) : (
                    <div className="text-6xl text-gray-400 group-hover:scale-110 transition-transform duration-300">
                      {item.image || '🎮'}
                    </div>
                  )}

                  {/* Platform Badge - 右下角 */}
                  <div className="absolute bottom-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${getPlatformColor(getDisplayPlatform(item.platform))}`} title={`支持平台: ${item.platform}`}>
                      {getPlatformIcon(getDisplayPlatform(item.platform))} {getDisplayPlatform(item.platform)}
                    </span>
                  </div>
                </div>

                {/* Item Content */}
                <div className="p-4 space-y-3">
                  {/* Item Title */}
                  <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors line-clamp-1" title={item.name}>
                    {item.name}
                  </h3>

                  {/* Item Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">ID:</span>
                      <span className="text-purple-300 font-mono text-xs truncate ml-2" title={item.id}>
                        {item.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('items.game')}:</span>
                      <span className="text-blue-400 truncate ml-2" title={item.game}>
                        {item.game}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('items.category')}:</span>
                      <span className="text-yellow-400 truncate ml-2">
                        {getCategoryDisplayName(item.category)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('items.price')}:</span>
                      <span className="text-green-400 font-bold">
                        ${item.price}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2" title={item.description}>
                      {item.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3 border-t border-gray-600/30">
                    <Button
                      onClick={() => copyItemInfo(item)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white transition-all"
                      size="sm"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          {t('items.copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          {t('items.copyInfo')}
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={contactUs}
                      variant="outline"
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                      size="sm"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      {t('items.contactUs')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// 主导出组件，用 Suspense 包裹使用 useSearchParams 的组件
export default function ItemsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ItemsPageContent />
    </Suspense>
  )
}