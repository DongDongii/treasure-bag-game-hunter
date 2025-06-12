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
  Package,
  Tag,
  User,
  Share2,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

// 模拟博客内容数据
const mockBlogContent: Record<string, BlogPost> = {
  'post-1': {
    id: 'post-1',
    title: 'MapleStory Winter Update 2024: New Content Guide',
    excerpt: 'Discover all the exciting new features, events, and items coming to MapleStory this winter season.',
    content: `
# MapleStory Winter Update 2024: Complete Guide

The winter season brings exciting new content to MapleStory! Here's everything you need to know about the latest update.

## 🎄 New Winter Events

### Snowflake Festival
- **Duration**: December 1 - January 31
- **Rewards**: Exclusive winter-themed equipment and decorations
- **Activities**: Daily snowball fights, ice skating challenges

### Holiday Gift Exchange
Participate in our community gift exchange program:
1. Complete daily missions to earn gift tokens
2. Exchange tokens for rare items and equipment
3. Special bonus rewards for consecutive logins

## ⚔️ New Equipment Sets

### Frost Guardian Set
- **Type**: Defensive equipment set
- **Bonus**: +25% Ice resistance, +15% HP boost
- **Acquisition**: Winter dungeon raids

### Blizzard Warrior Set
- **Type**: Offensive equipment set
- **Bonus**: +30% Critical damage in cold environments
- **Acquisition**: PvP winter tournaments

## 🏔️ New Areas

### Crystal Caverns
A mysterious underground area filled with ice crystals and powerful monsters. Features:
- 5 new dungeon levels
- Unique ice-based boss encounters
- Rare material farming opportunities

### Frozen Lake District
An open-world area perfect for group activities:
- Guild vs Guild winter warfare
- Ice fishing mini-games
- Hidden treasure hunts

## 💰 Trading Tips for New Items

1. **Early Investment**: New items typically have high value in the first week
2. **Set Completion**: Focus on completing full equipment sets for better trades
3. **Event Materials**: Stock up on event-exclusive materials

## 🎯 Pro Tips

- Log in daily during the event period for maximum rewards
- Team up with guild members for difficult winter dungeons
- Save your best equipment for the final boss encounters

Happy hunting, and enjoy the winter festivities!
    `,
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
  'post-2': {
    id: 'post-2',
    title: 'Complete Guide to Trading Rare Items Safely',
    excerpt: 'Learn the best practices for secure item trading and how to avoid common scams in the marketplace.',
    content: `
# Complete Guide to Safe Trading

Trading rare items can be both exciting and risky. Follow these guidelines to protect yourself and maximize your profits.

## 🛡️ Security First

### Verification Steps
1. **Check item authenticity** - Verify stats and origins
2. **Use official trading platforms** - Avoid third-party sites
3. **Document all trades** - Keep screenshots of negotiations

### Common Scam Types
- **Fake item switching** - Always double-check before confirming
- **Overpayment scams** - Be wary of "generous" offers
- **Phishing attempts** - Never share account details

## 💎 Valuation Strategies

### Market Research
- Track price trends over 30-day periods
- Compare similar items across multiple platforms
- Consider seasonal demand fluctuations

### Rarity Assessment
- **Legendary items**: Check acquisition difficulty
- **Event exclusives**: Consider time-limited availability
- **Crafted gear**: Factor in material costs

## 📈 Trading Best Practices

### Timing Your Trades
- **Peak hours**: Evening and weekends see more activity
- **Event periods**: Prices fluctuate during special events
- **Patch cycles**: New updates affect item values

### Negotiation Tips
1. Start with market research data
2. Be prepared to walk away
3. Build reputation through smaller trades first
4. Maintain professional communication

## ⚠️ Red Flags to Avoid

- Trades that seem "too good to be true"
- Buyers who rush the transaction
- Requests to trade outside official channels
- Sellers who won't provide item verification

## 🎯 Advanced Trading Strategies

### Portfolio Diversification
Don't put all your wealth in one item type:
- **Weapons**: 30-40% of portfolio
- **Armor sets**: 25-35% of portfolio
- **Consumables**: 15-25% of portfolio
- **Rare materials**: 10-15% of portfolio

### Long-term Investment
Some items appreciate over time:
- Discontinued event items
- Legacy equipment with unique stats
- Rare crafting materials

Remember: Successful trading combines market knowledge, patience, and security awareness!
    `,
    author: 'Trading Expert',
    category: 'guide',
    tags: ['trading', 'security', 'tips'],
    image: '🛡️',
    published: true,
    created_at: '2024-12-02T14:30:00Z',
    updated_at: '2024-12-02T14:30:00Z',
    views: 890,
    reading_time: 8
  }
}

export default function BlogPostPage() {
  const { t } = useLanguage()
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))

        const postId = params.id as string
        const blogPost = mockBlogContent[postId]

        if (blogPost) {
          setPost(blogPost)
          // 增加浏览量
          blogPost.views += 1
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Error loading blog post:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    loadBlogPost()
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
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

  const contactUs = () => {
    // 跳转到首页的联系我们部分
    window.location.href = '/#contact'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black">
        <header className="bg-gray-800/50 border-b border-gray-600/30 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-8 bg-gray-700/50 rounded animate-pulse" />
            </div>
            <div className="w-32 h-8 bg-gray-700/50 rounded animate-pulse" />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <div className="h-12 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-6 bg-gray-700/50 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-700/50 rounded w-1/2 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-4 bg-gray-700/50 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black">
        <header className="bg-gray-800/50 border-b border-gray-600/30 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/blog">
              <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <LanguageSelector />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{t('blog.articleNotFound')}</h1>
          <p className="text-gray-400 mb-6">{t('blog.articleNotFoundDesc')}</p>
          <Link href="/blog">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              {t('blog.browseAll')}
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-600/30 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/blog">
              <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold">Treasure Bag</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={contactUs}
              variant="outline"
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
              size="sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {t('items.contactUs')}
            </Button>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <article className="bg-gradient-to-br from-gray-800/80 to-purple-900/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8">
          {/* Article Header */}
          <header className="mb-8">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getCategoryColor(post.category)}`}>
                {t(`blog.category.${post.category}`)}
              </span>
              <div className="flex items-center text-gray-400 text-sm space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.reading_time} {t('blog.readTime')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} {t('blog.views')}</span>
                </div>
              </div>
            </div>

            {/* Title & Icon */}
            <div className="flex items-start space-x-4">
              <div className="text-6xl">{post.image}</div>
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                  {post.title}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full flex items-center"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-purple max-w-none">
            <div
              className="text-gray-200 leading-relaxed"
              style={{
                lineHeight: '1.8',
                fontSize: '16px'
              }}
            >
              {post.content.split('\n').map((line, index) => {
                const key = `${post.id}-line-${index}`
                if (line.startsWith('# ')) {
                  return <h1 key={key} className="text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>
                }
                if (line.startsWith('## ')) {
                  return <h2 key={key} className="text-2xl font-bold text-purple-300 mt-6 mb-3">{line.slice(3)}</h2>
                }
                if (line.startsWith('### ')) {
                  return <h3 key={key} className="text-xl font-bold text-purple-200 mt-4 mb-2">{line.slice(4)}</h3>
                }
                if (line.startsWith('- ')) {
                  return <li key={key} className="text-gray-200 ml-6 mb-1 list-disc">{line.slice(2)}</li>
                }
                if (line.startsWith('1. ') || /^\d+\./.test(line)) {
                  return <li key={key} className="text-gray-200 ml-6 mb-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>
                }
                if (line.trim() === '') {
                  return <br key={key} />
                }
                return <p key={key} className="text-gray-200 mb-4">{line}</p>
              })}
            </div>
          </div>

          {/* Share Section */}
          <footer className="mt-12 pt-8 border-t border-gray-600/30">
            <div className="flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                Last updated: {formatDate(post.updated_at)}
              </div>
              <Button
                onClick={contactUs}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t('items.contactUs')}
              </Button>
            </div>
          </footer>
        </article>

        {/* Related Articles */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">{t('blog.continueReading')}</h3>
          <div className="flex justify-center">
            <Link href="/blog">
              <Button
                variant="outline"
                className="bg-transparent border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {t('blog.browseAll')}
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
