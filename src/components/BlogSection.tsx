"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/LanguageProvider'
import { Calendar, Clock, Eye, ArrowRight, BookOpen } from 'lucide-react'
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

// 模拟博客数据
const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'MapleStory Winter Update 2024: New Content Guide',
    excerpt: 'Discover all the exciting new features, events, and items coming to MapleStory this winter season.',
    content: '',
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
    content: '',
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
    content: '',
    author: 'Market Analyst',
    category: 'news',
    tags: ['market', 'analysis', 'prices'],
    image: '📈',
    published: true,
    created_at: '2024-12-01T09:15:00Z',
    updated_at: '2024-12-01T09:15:00Z',
    views: 675,
    reading_time: 6
  }
]

export function BlogSection() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载博客数据
    const loadBlogPosts = async () => {
      try {
        // 这里以后会连接到真实的数据库
        await new Promise(resolve => setTimeout(resolve, 500)) // 模拟加载时间
        setPosts(mockBlogPosts)
      } catch (error) {
        console.error('Error loading blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBlogPosts()
  }, [])

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

  if (loading) {
    return (
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('blog.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-600/30 rounded-2xl p-6 animate-pulse">
              <div className="h-16 bg-gray-700/50 rounded mb-4" />
              <div className="h-4 bg-gray-700/50 rounded mb-2" />
              <div className="h-4 bg-gray-700/50 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-400" />
          {t('blog.title')}
        </h2>
        <Link href="/blog">
          <Button
            variant="outline"
            className="bg-transparent border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
          >
            View All Posts
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-gradient-to-br from-gray-800/80 to-purple-900/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6 hover:from-gray-700/80 hover:to-purple-800/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
          >
            <Link href={`/blog/${post.id}`}>
              <div className="space-y-4">
                {/* Category & Icon */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(post.category)}`}>
                    {t(`blog.category.${post.category}`)}
                  </span>
                  <div className="text-3xl">{post.image}</div>
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors leading-tight">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
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
                    <span>{post.views} {t('blog.views')}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="pt-2">
                  <div className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-300 text-sm font-medium group-hover:text-purple-200 transition-all text-center">
                    {t('blog.readMore')}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
