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
      <header className="relative z-50 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">{t('header.title')}</span>
          <span className="text-purple-300 font-bold text-lg">{t('header.subtitle')}</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/items" className="text-white hover:text-purple-300 transition-colors flex items-center space-x-1">
            <Package className="w-4 h-4" />
            <span>{t('header.items')}</span>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSelector />

          <Link href="/items">
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-purple-900"
            >
              <Search className="w-4 h-4 mr-2" />
              {t('header.search')}
            </Button>
          </Link>

          <button className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6" />
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
            className="bg-gray-800 border border-gray-600/30 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
              <h3 className="text-xl font-bold text-white">{t('home.gameCategories')}</h3>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* 浏览所有商品 */}
              <Link href="/items" onClick={() => setIsMenuOpen(false)}>
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 border border-purple-500/30 rounded-xl p-4 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">🛍️</div>
                    <div>
                      <h4 className="text-white font-bold">{t('home.browseAll')}</h4>
                      <p className="text-purple-200 text-sm">{t('home.description2')}</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 游戏列表 */}
              {gameCategories.map((category) => (
                <Link
                  href={`/items?game=${category.gameKey}`}
                  key={category.name}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="bg-gradient-to-br from-gray-700/80 to-purple-900/30 hover:from-gray-600/80 hover:to-purple-800/40 border border-gray-600/30 hover:border-purple-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-bold group-hover:text-purple-300 transition-colors">
                          {category.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {t('home.gameService')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-purple-300 via-indigo-400 to-purple-500 bg-clip-text text-transparent leading-tight">
            {t('home.title')}
            <br />
            {t('home.subtitle')}
          </h1>

          <div className="space-y-4 text-lg text-gray-300 max-w-2xl mx-auto">
            <p>{t('home.description1')}</p>
            <p>{t('home.description2')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/items">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white border-0 px-8 py-3">
                <Package className="w-5 h-5 mr-2" />
                {t('home.browseAll')}
              </Button>
            </Link>
            <Link href="/items">
              <Button
                variant="outline"
                className="bg-transparent border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-purple-900 px-8 py-3"
              >
                <Search className="w-5 h-5 mr-2" />
                {t('home.advancedSearch')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Game Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('home.gameCategories')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameCategories.map((category) => (
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
        </div>

        {/* Social Contact */}
        <div id="contact" className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('contact.title')}</h2>
          <div className="max-w-4xl mx-auto">
            <SocialContact />
          </div>
        </div>

        {/* Blog Section */}
        <BlogSection />
      </main>

      {/* Decorative Elements */}
      <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-gray-600/30 rounded-full animate-spin-slow" />
      <div className="absolute top-1/3 left-10 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
    </div>
  )
}
