"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, Search, Package, Star, X } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/LanguageProvider"
import { LanguageSelector } from "@/components/LanguageSelector"
import { SocialContact } from "@/components/SocialContact"
import { BlogSection } from "@/components/BlogSection"
import { getDatabase } from "@/lib/database"
import type { Game } from "@/lib/database"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)
  const [gameSearchTerm, setGameSearchTerm] = useState("")
  const { t } = useLanguage()

  useEffect(() => {
    async function loadData() {
      try {
        const database = await getDatabase()
        const gamesData = await database.getGames()
        setGames(gamesData)
        setDbError(null)
      } catch (error) {
        console.error('Error loading data:', error)
        setDbError(error instanceof Error ? error.message : '数据库连接失败')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const gameCategories = games.map(game => {
    // 如果有对应的翻译键就使用翻译，否则直接使用显示名称
    const translatedName = t(`games.${game.name}`)
    const gameName = translatedName !== `games.${game.name}` ? translatedName : game.display_name

    return {
      name: gameName,
      icon: game.name === 'maplestory' ? '🍁' :
            game.name === 'maplestory-m' ? '📱' :
            game.name === 'maplestory-2' ? '🎮' : '🎯',
      description: gameName,
      gameKey: game.name
    }
  })

  // 过滤游戏列表
  const filteredGameCategories = gameCategories.filter(category =>
    category.name.toLowerCase().includes(gameSearchTerm.toLowerCase()) ||
    category.gameKey.toLowerCase().includes(gameSearchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black relative overflow-hidden">
      {/* Database Error Banner */}
      {dbError && (
        <div className="relative z-50 bg-red-900/90 border-b border-red-500 p-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-semibold mb-2">❌ 数据库配置错误</h3>
            <p className="text-red-200 text-sm mb-3">{dbError}</p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/setup"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors text-sm"
              >
                配置 Supabase
              </Link>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white transition-colors text-sm"
              >
                创建 Supabase 项目
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Starfield Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={`star-${i}-${Math.random()}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-white font-bold text-lg">{t('header.title')}</span>
            <span className="text-purple-300 font-bold text-lg">{t('header.subtitle')}</span>
          </div>
          <div className="sm:hidden">
            <span className="text-white font-bold text-base">{t('header.title')}</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/items" className="text-white hover:text-purple-300 transition-colors flex items-center space-x-1">
            <Package className="w-4 h-4" />
            <span>{t('header.items')}</span>
          </Link>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          <Link href="/items" className="hidden sm:block">
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-purple-900"
            >
              <Search className="w-4 h-4 mr-2" />
              {t('header.search')}
            </Button>
          </Link>

          {/* 移动端搜索按钮 */}
          <Link href="/items" className="sm:hidden">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-white text-white hover:bg-white hover:text-purple-900 p-2"
            >
              <Search className="w-4 h-4" />
            </Button>
          </Link>

          <button
            className="text-white bg-gray-800/50 hover:bg-gray-700/50 p-2 rounded-lg transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {/* Game Selection Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-800/95 to-purple-900/80 backdrop-blur-lg border border-gray-600/30 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
              <h3 className="text-xl font-bold text-white">{t('home.gameCategories')}</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 p-2 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* 语言选择器 - 仅移动端显示 */}
              <div className="sm:hidden bg-gray-700/50 rounded-xl p-4 border border-gray-600/30">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">语言 / Language</span>
                  <LanguageSelector />
                </div>
              </div>

              {/* 游戏搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('home.searchGames') || 'Search games...'}
                  value={gameSearchTerm}
                  onChange={(e) => setGameSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              {/* 浏览所有商品 */}
              <Link href="/items" onClick={() => setIsMenuOpen(false)}>
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 border border-purple-500/30 rounded-xl p-4 transition-all duration-300 cursor-pointer group shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">🛍️</div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold">{t('home.browseAll')}</h4>
                      <p className="text-purple-200 text-sm">{t('home.description2')}</p>
                    </div>
                    <div className="text-purple-200 text-sm">→</div>
                  </div>
                </div>
              </Link>

              {/* 游戏列表 */}
              {filteredGameCategories.length > 0 ? (
                filteredGameCategories.map((category) => (
                <Link
                  href={`/items?game=${category.gameKey}`}
                  key={category.name}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="bg-gradient-to-br from-gray-700/60 to-purple-900/20 hover:from-gray-600/70 hover:to-purple-800/30 border border-gray-600/30 hover:border-purple-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group shadow-md">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold group-hover:text-purple-300 transition-colors">
                          {category.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {t('home.gameService')}
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-purple-300 transition-colors text-sm">→</div>
                    </div>
                  </div>
                </Link>
                ))
              ) : gameSearchTerm ? (
                /* 搜索无结果时显示联系我们 */
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🔍</div>
                  <h4 className="text-white font-bold mb-2">{t('home.noGamesFound') || 'No games found'}</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    {t('home.cantFindGame') || "Can't find the game you're looking for?"}
                  </p>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      setTimeout(() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                  >
                    {t('home.contactUsForGame') || 'Contact us for this game'}
                  </button>
                </div>
              ) : (
                gameCategories.map((category) => (
                <Link
                  href={`/items?game=${category.gameKey}`}
                  key={category.name}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="bg-gradient-to-br from-gray-700/60 to-purple-900/20 hover:from-gray-600/70 hover:to-purple-800/30 border border-gray-600/30 hover:border-purple-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group shadow-md">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold group-hover:text-purple-300 transition-colors">
                          {category.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {t('home.gameService')}
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-purple-300 transition-colors text-sm">→</div>
                    </div>
                  </div>
                </Link>
                ))
              )}

              {/* 底部空白用于更好的滚动体验 */}
              <div className="h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-purple-300 via-indigo-400 to-purple-500 bg-clip-text text-transparent leading-tight px-2">
            {t('home.title')}
            <br />
            {t('home.subtitle')}
          </h1>

          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto px-2">
            <p>{t('home.description1')}</p>
            <p>{t('home.description2')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
            <Link href="/items" className="w-full sm:w-auto max-w-xs">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white border-0 px-6 sm:px-8 py-3 text-sm sm:text-base active:scale-95 transition-all">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('home.browseAll')}
              </Button>
            </Link>
            <Link href="/items" className="w-full sm:w-auto max-w-xs">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-purple-900 px-6 sm:px-8 py-3 text-sm sm:text-base active:scale-95 transition-all"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('home.advancedSearch')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Game Categories */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center px-2">{t('home.gameCategories')}</h2>

          {/* Desktop版本 - 限制显示8个游戏 */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {gameCategories.slice(0, 8).map((category) => (
                <Link href={`/items?game=${category.gameKey}`} key={category.name}>
                  <div className="bg-gradient-to-br from-gray-800/80 to-purple-900/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8 hover:from-gray-700/80 hover:to-purple-800/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group hover:scale-105">
                    <div className="text-center space-y-6">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                      <h3 className="text-white font-bold text-xl group-hover:text-purple-300 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {t('home.gameService')}
                      </p>
                      <div className="pt-4">
                        <div className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-300 text-sm font-medium group-hover:text-purple-200 transition-all">
                          {t('home.enterGame')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 查看更多按钮 - 如果有超过8个游戏才显示 */}
            {gameCategories.length > 8 && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setIsMenuOpen(true)}
                  variant="outline"
                  className="bg-transparent border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-xl text-base"
                >
                  <ChevronDown className="w-5 h-5 mr-2" />
{t('home.viewMoreGames')} ({gameCategories.length - 8}+)
                </Button>
              </div>
            )}
          </div>

          {/* Mobile版本 - 限制显示数量 + 查看更多 */}
          <div className="md:hidden px-2">
            {/* 显示前3个游戏 */}
            <div className="space-y-3 mb-6">
              {gameCategories.slice(0, 3).map((category) => (
                <Link href={`/items?game=${category.gameKey}`} key={category.name}>
                  <div className="bg-gradient-to-br from-gray-800/80 to-purple-900/50 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 hover:from-gray-700/80 hover:to-purple-800/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group active:scale-95">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">{category.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-purple-300 transition-colors truncate">
                          {category.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {t('home.gameService')}
                        </p>
                      </div>
                      <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg px-2 sm:px-3 py-1 text-purple-300 text-xs font-medium flex-shrink-0">
                        {t('home.enterGame')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 查看更多按钮 - 如果有超过3个游戏才显示 */}
            {gameCategories.length > 3 && (
              <div className="text-center">
                <Button
                  onClick={() => setIsMenuOpen(true)}
                  variant="outline"
                  className="bg-transparent border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-6 py-3 rounded-xl text-sm active:scale-95 transition-all"
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  {t('home.viewMoreGames')} ({gameCategories.length - 3}+)
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Social Contact */}
        <div id="contact" className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center px-2">{t('contact.title')}</h2>
          <div className="max-w-4xl mx-auto px-2">
            <SocialContact />
          </div>
        </div>

        {/* Blog Section */}
        <div className="px-2">
          <BlogSection />
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="hidden sm:block absolute bottom-20 right-20 w-32 h-32 border-2 border-gray-600/30 rounded-full animate-spin-slow" />
      <div className="absolute top-1/3 left-4 sm:left-10 w-1 sm:w-2 h-1 sm:h-2 bg-purple-500 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-indigo-500 rounded-full animate-pulse" />
    </div>
  )
}
