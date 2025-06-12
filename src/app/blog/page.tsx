"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/LanguageProvider'
import { LanguageSelector } from '@/components/LanguageSelector'
import {
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  BookOpen,
  Search,
  Filter,
  Package,
  Tag
} from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  image: string
  published: boolean
  created_at: string
  updated_at: string
  views: number
  reading_time: number
}

// 扩展的模拟博客数据
const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'MapleStory Winter Update 2024: New Content Guide',
    excerpt: 'Discover all the exciting new features, events, and items coming to MapleStory this winter season.',
    content: 'Full article content here...',
    author: 'Game Master',
    category: 'update',
    tags: ['update', 'winter', 'events'],
    image: '❄️',
    published: true,
    created_at: '2024-12-03T10:00:00Z',
    updated_at: '2024-12-03T10:00:00Z',
    views: 1250,
    reading_time: 5
  },
  {
    id: 'post-2',
    title: 'Complete Guide to Trading Rare Items Safely',
    excerpt: 'Learn the best practices for secure item trading and how to avoid common scams in the marketplace.',
    content: 'Full article content here...',
    author: 'Trading Expert',
    category: 'guide',
    tags: ['trading', 'security', 'tips'],
    image: '🛡️',
    published: true,
    created_at: '2024-12-02T14:30:00Z',
    updated_at: '2024-12-02T14:30:00Z',
    views: 890,
    reading_time: 8
  },
  {
    id: 'post-3',
    title: 'Weekly Market Analysis: Top Items & Price Trends',
    excerpt: 'Stay updated with the latest market trends, popular items, and price predictions for this week.',
    content: 'Full article content here...',
    author: 'Market Analyst',
    category: 'news',
    tags: ['market', 'analysis', 'prices'],
    image: '📈',
    published: true,
    created_at: '2024-12-01T09:15:00Z',
    updated_at: '2024-12-01T09:15:00Z',
    views: 675,
    reading_time: 6
  },
  {
    id: 'post-4',
    title: 'Black Friday Special Event: Best Deals & Discounts',
    excerpt: 'Don\'t miss out on our biggest sale of the year! Check out all the amazing deals and limited-time offers.',
    content: 'Full article content here...',
    author: 'Event Coordinator',
    category: 'event',
    tags: ['blackfriday', 'sale', 'discount'],
    image: '🛍️',
    published: true,
    created_at: '2024-11-29T12:00:00Z',
    updated_at: '2024-11-29T12:00:00Z',
    views: 2100,
    reading_time: 4
  },
  {
    id: 'post-5',
    title: 'How to Build the Perfect Equipment Set',
    excerpt: 'Step-by-step guide to creating powerful equipment combinations for maximum performance.',
    content: 'Full article content here...',
    author: 'Equipment Specialist',
    category: 'guide',
    tags: ['equipment', 'build', 'strategy'],
    image: '⚔️',
    published: true,
    created_at: '2024-11-28T16:45:00Z',
    updated_at: '2024-11-28T16:45:00Z',
    views: 1420,
    reading_time: 12
  },
  {
    id: 'post-6',
    title: 'Community Spotlight: Top Traders of the Month',
    excerpt: 'Meet our featured community members who have excelled in trading and helping others.',
    content: 'Full article content here...',
    author: 'Community Manager',
    category: 'news',
    tags: ['community', 'spotlight', 'trading'],
    image: '🌟',
    published: true,
    created_at: '2024-11-27T11:30:00Z',
    updated_at: '2024-11-27T11:30:00Z',
    views: 820,
    reading_time: 7
  }
]

const categories = ['all', 'news', 'guide', 'update', 'event']

export default function BlogPage() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        setPosts(mockBlogPosts)
        setFilteredPosts(mockBlogPosts)
      } catch (error) {
        console.error('Error loading blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBlogPosts()
  }, [])

  // 过滤博客文章
  useEffect(() => {
    let filtered = posts

    // 按分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }, [posts, selectedCategory, searchTerm])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'guide': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'update': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'event': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getCategoryButtonColor = (category: string, isSelected: boolean) => {
    if (!isSelected) return 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'

    switch (category) {
      case 'news': return 'bg-blue-600 text-white'
      case 'guide': return 'bg-green-600 text-white'
      case 'update': return 'bg-purple-600 text-white'
      case 'event': return 'bg-orange-600 text-white'
      default: return 'bg-purple-600 text-white'
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
              <h1 className="text-2xl font-bold text-white">{t('blog.title')}</h1>
            </div>
          </div>

          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-300 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest news, guides, and insights from the gaming world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${getCategoryButtonColor(category, selectedCategory === category)} border-0 transition-all`}
                size="sm"
              >
                {category === 'all' ? 'All' : t(`blog.category.${category}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredPosts.length} of {posts.length} articles
          </p>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-600/30 rounded-2xl p-6 animate-pulse">
                <div className="h-16 bg-gray-700/50 rounded mb-4" />
                <div className="h-4 bg-gray-700/50 rounded mb-2" />
                <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-700/50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No articles found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-gradient-to-br from-gray-800/80 to-purple-900/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6 hover:from-gray-700/80 hover:to-purple-800/50 hover:border-purple-500/50 transition-all duration-300 group"
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="space-y-4">
                    {/* Category & Icon */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(post.category)}`}>
                        {t(`blog.category.${post.category}`)}
                      </span>
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {post.image}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors leading-tight">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md flex items-center"
                        >
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-600/30">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.reading_time} {t('blog.readTime')}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
