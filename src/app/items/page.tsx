"use client"

import { Suspense, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Copy, Package, ArrowLeft, Share2, Filter, Check, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { LanguageSelector } from "@/components/LanguageSelector"
import { getDatabase } from "@/lib/database"
import type { Item, Game, Category } from "@/lib/database"

// 将使用useSearchParams的组件分离出来
function ItemsContent() {
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

  // 移动端筛选器状态
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // 平台选择弹窗状态
  const [showPlatformModal, setShowPlatformModal] = useState(false)
  const [pendingCopyItem, setPendingCopyItem] = useState<Item | null>(null)

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

  // 处理复制按钮点击
  const handleCopyClick = (item: Item) => {
    if (selectedPlatform === "all") {
      // 如果没有选择特定平台，弹出选择对话框
      setPendingCopyItem(item)
      setShowPlatformModal(true)
    } else {
      // 直接复制
      copyItemInfo(item, selectedPlatform)
    }
  }

  // 复制商品完整信息
  const copyItemInfo = async (item: Item, platform?: string) => {
    try {
      // 根据选择的平台确定要复制的平台信息
      let platformInfo = ''
      const targetPlatform = platform || selectedPlatform

      if (targetPlatform === "all") {
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

      // 关闭弹窗
      setShowPlatformModal(false)
      setPendingCopyItem(null)
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

  // 重置筛选器
  const resetFilters = () => {
    setSelectedGame("all")
    setSelectedCategory("all")
    setSelectedPlatform("all")
    setSearchTerm("")
  }

  // 检查是否有活动筛选器
  const hasActiveFilters = selectedGame !== "all" || selectedCategory !== "all" || selectedPlatform !== "all" || searchTerm !== ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-600/30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/">
                <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 text-sm sm:text-base">
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t('items.backHome')}</span>
                  <span className="sm:hidden">{t('items.back') || 'Back'}</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">{t('items.title')}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-gray-400 text-xs sm:text-sm">
                {t('items.totalItems')}: {filteredItems.length}
              </span>
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Search Bar - 始终显示 */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder={t('items.searchPlaceholder')}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 桌面端筛选器 */}
        <div className="hidden md:flex flex-wrap gap-4 mb-8">
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

          {hasActiveFilters && (
            <div className="flex flex-col justify-end">
              <Button
                onClick={resetFilters}
                variant="outline"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
              >
{t('items.resetFilters') || 'Reset Filters'}
              </Button>
            </div>
          )}
        </div>

        {/* 移动端筛选器控制 */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              variant="outline"
              className="bg-gray-800/50 border-gray-600/30 text-gray-300 hover:bg-gray-700/50 flex-1 mr-2"
            >
              <Filter className="w-4 h-4 mr-2" />
{t('items.filters') || 'Filters'}
              {hasActiveFilters && <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full" />}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
            </Button>

            {hasActiveFilters && (
              <Button
                onClick={resetFilters}
                variant="outline"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 px-3"
              >
{t('items.reset') || 'Reset'}
              </Button>
            )}
          </div>

          {/* 移动端筛选器面板 */}
          {showMobileFilters && (
            <div className="mt-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 space-y-4">
              {/* 游戏筛选 */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">{t('items.gameType')}</label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="all">{t('items.allGames')}</option>
                  {games.map(game => (
                    <option key={game.id} value={game.name}>{game.display_name}</option>
                  ))}
                </select>
              </div>

              {/* 分类筛选 */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">{t('items.category')}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="all">{t('items.allCategories')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.display_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 平台筛选 */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="all">All Platforms</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>
                      {getPlatformIcon(platform)} {platform}
                    </option>
                  ))}
                </select>
              </div>

              {/* 关闭按钮 */}
              <div className="flex justify-center pt-2">
                <Button
                  onClick={() => setShowMobileFilters(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                >
{t('items.applyFilters') || 'Apply Filters'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 活动筛选器显示 */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedGame !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
{t('items.game')}: {games.find(g => g.name === selectedGame)?.display_name}
                <button onClick={() => setSelectedGame("all")} className="ml-1 hover:text-blue-200">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
{t('items.category')}: {getCategoryDisplayName(selectedCategory)}
                <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-yellow-200">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedPlatform !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
{t('items.platform') || 'Platform'}: {selectedPlatform}
                <button onClick={() => setSelectedPlatform("all")} className="ml-1 hover:text-green-200">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-600/30 rounded-2xl p-4 sm:p-6 animate-pulse">
                <div className="h-16 sm:h-20 bg-gray-700/50 rounded mb-4" />
                <div className="h-4 bg-gray-700/50 rounded mb-2" />
                <div className="h-4 bg-gray-700/50 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl text-white mb-2">{t('items.noResults')}</h3>
            <p className="text-gray-400 text-sm sm:text-base">{t('items.adjustFilters')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="bg-gradient-to-br from-gray-800/80 to-purple-900/50 backdrop-blur-sm border border-gray-600/30 rounded-xl sm:rounded-2xl overflow-hidden hover:from-gray-700/80 hover:to-purple-800/50 hover:border-purple-500/50 transition-all duration-300 group hover:scale-105 active:scale-95"
              >
                {/* Item Image */}
                <div className="relative w-full h-32 sm:h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden">
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
                          parent.innerHTML = '<div class="flex items-center justify-center w-full h-full text-4xl sm:text-6xl text-gray-400">🎮</div>'
                        }
                      }}
                    />
                  ) : (
                    <div className="text-4xl sm:text-6xl text-gray-400 group-hover:scale-110 transition-transform duration-300">
                      {item.image || '🎮'}
                    </div>
                  )}

                  {/* Platform Badge - 右下角 */}
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${getPlatformColor(getDisplayPlatform(item.platform))}`} title={`${t('items.supportedPlatforms') || 'Supported Platforms'}: ${item.platform}`}>
                      {getPlatformIcon(getDisplayPlatform(item.platform))} <span className="hidden sm:inline">{getDisplayPlatform(item.platform)}</span>
                    </span>
                  </div>
                </div>

                {/* Item Content */}
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {/* Item Title */}
                  <h3 className="text-white font-bold text-sm sm:text-lg group-hover:text-purple-300 transition-colors line-clamp-1" title={item.name}>
                    {item.name}
                  </h3>

                  {/* Item Details */}
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
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
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-2" title={item.description}>
                      {item.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2 sm:pt-3 border-t border-gray-600/30">
                    <Button
                      onClick={() => handleCopyClick(item)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white transition-all text-xs sm:text-sm"
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
                          <span className="hidden sm:inline">{t('items.copyInfo')}</span>
                          <span className="sm:hidden">{t('items.copy') || 'Copy'}</span>
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={contactUs}
                      variant="outline"
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 text-xs sm:text-sm px-2 sm:px-3"
                      size="sm"
                    >
                      <Share2 className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">{t('items.contactUs')}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 平台选择弹窗 */}
      {showPlatformModal && pendingCopyItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800/95 to-purple-900/80 backdrop-blur-lg border border-gray-600/30 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {t('items.selectPlatform') || 'Select Platform'}
              </h3>

              <p className="text-gray-400 text-sm mb-6 text-center">
                {t('items.selectPlatformDesc') || 'Choose which platform to include in the copied information:'}
              </p>

              <div className="space-y-3">
                {/* 所有支持的平台 */}
                <button
                  onClick={() => copyItemInfo(pendingCopyItem, "all")}
                  className="w-full p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-white transition-all duration-300 flex items-center justify-between"
                >
                  <span>🎮 {t('items.allPlatforms') || 'All Platforms'}</span>
                  <span className="text-purple-300 text-sm">
                    ({getAllPlatforms(pendingCopyItem.platform).length} platforms)
                  </span>
                </button>

                {/* 具体平台选项 */}
                {getAllPlatforms(pendingCopyItem.platform).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => copyItemInfo(pendingCopyItem, platform)}
                    className="w-full p-3 bg-gray-700/50 hover:bg-gray-600/60 border border-gray-600/30 hover:border-purple-500/50 rounded-lg text-white transition-all duration-300 flex items-center"
                  >
                    <span className="mr-3">{getPlatformIcon(platform)}</span>
                    <span>{platform}</span>
                  </button>
                ))}
              </div>

              {/* 取消按钮 */}
              <button
                onClick={() => {
                  setShowPlatformModal(false)
                  setPendingCopyItem(null)
                }}
                className="w-full mt-4 p-3 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-all"
              >
                {t('items.cancel') || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 加载组件
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex items-center justify-center">
      <div className="text-white text-xl">Loading items...</div>
    </div>
  )
}

// 主导出组件 - 包装在Suspense中
export default function ItemsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ItemsContent />
    </Suspense>
  )
}
