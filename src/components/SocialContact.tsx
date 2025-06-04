"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/LanguageProvider'
import { getDatabase } from '@/lib/database'
import type { SocialContact as SocialContactData } from '@/lib/database'
import {
  MessageCircle,
  Send,
  Users,
  Phone,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react'

// 平台配置
const PLATFORMS = {
  whatsapp: {
    name: 'WhatsApp',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'bg-green-600 hover:bg-green-700',
    placeholder: '+1234567890'
  },
  telegram: {
    name: 'Telegram',
    icon: <Send className="w-5 h-5" />,
    color: 'bg-blue-600 hover:bg-blue-700',
    placeholder: '@username'
  },
  discord: {
    name: 'Discord',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-indigo-600 hover:bg-indigo-700',
    placeholder: 'serverid'
  },
  email: {
    name: 'Email',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-gray-600 hover:bg-gray-700',
    placeholder: 'contact@example.com'
  }
}

// 获取平台描述的翻译文本
const getPlatformDescription = (platform: string, t: (key: string) => string) => {
  switch (platform) {
    case 'whatsapp': return t('contact.whatsapp.description')
    case 'telegram': return t('contact.telegram.description')
    case 'discord': return t('contact.discord.description')
    case 'email': return t('contact.email.description')
    default: return ''
  }
}

interface SocialContactProps {
  isAdmin?: boolean
}

export function SocialContact({ isAdmin = false }: SocialContactProps) {
  const { t } = useLanguage()
  const [contacts, setContacts] = useState<SocialContactData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedContact, setCopiedContact] = useState<string | null>(null)
  const [editingContact, setEditingContact] = useState<SocialContactData | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // 加载联系方式
  const loadContacts = useCallback(async () => {
    try {
      setLoading(true)
      console.log('🔍 开始加载社交联系方式...')

      const database = await getDatabase()
      console.log('✅ 数据库连接成功')

      const dbContacts = await database.getSocialContacts()
      console.log('📊 从数据库获取到联系方式:', dbContacts)

      // 如果没有数据，创建默认数据
      if (dbContacts.length === 0) {
        console.log('📝 没有找到联系方式，创建默认数据...')
        const defaultContacts = [
          {
            platform: 'telegram',
            username: '@GameOn1yg0NTR1',
            url: 'https://t.me/GameOn1yg0NTR1',
            is_active: true,
            sort_order: 1
          },
          {
            platform: 'discord',
            username: 'rZIxr6JuJB',
            url: 'https://discord.gg/rZIxr6JuJB',
            is_active: true,
            sort_order: 2
          },
          {
            platform: 'whatsapp',
            username: '+8617324567841',
            url: 'https://wa.me/8617324567841',
            is_active: true,
            sort_order: 3
          },
          {
            platform: 'email',
            username: '586253294@qq.com',
            url: 'mailto:586253294@qq.com',
            is_active: true,
            sort_order: 4
          }
        ]

        try {
          for (const contact of defaultContacts) {
            await database.createSocialContact(contact)
          }
          console.log('✅ 默认联系方式创建成功')

          // 重新获取数据
          const newContacts = await database.getSocialContacts()
          setContacts(newContacts)
          console.log('📊 重新获取联系方式:', newContacts)
        } catch (createError) {
          console.error('❌ 创建默认联系方式失败:', createError)
          // 如果创建失败，可能是表不存在，显示友好提示
          setError('社交联系方式表不存在，请运行数据库迁移脚本。')
        }
      } else {
        setContacts(dbContacts)
      }

      setError(null)
    } catch (err) {
      console.error('❌ 加载联系方式失败:', err)
      setError(err instanceof Error ? err.message : '加载联系方式失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadContacts()
  }, [loadContacts]) // loadContacts 在组件内部定义，不需要添加到依赖数组

  // 生成URL
  const generateUrl = (platform: string, username: string) => {
    switch (platform) {
      case 'whatsapp': {
        const phoneNumber = username.replace(/[^0-9]/g, '')
        return `https://wa.me/${phoneNumber}`
      }
      case 'telegram': {
        const telegramUsername = username.replace('@', '')
        return `https://t.me/${telegramUsername}`
      }
      case 'discord':
        return `https://discord.gg/${username}`
      case 'email':
        return `mailto:${username}`
      default:
        return username
    }
  }

  // 复制到剪贴板
  const copyToClipboard = async (text: string, contactId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedContact(contactId)
      setTimeout(() => setCopiedContact(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // 保存联系方式
  const saveContact = async (contactData: Partial<SocialContactData>) => {
    try {
      const database = await getDatabase()

      if (editingContact) {
        // 更新
        await database.updateSocialContact(editingContact.id, contactData)
      } else {
        // 创建新的
        if (!contactData.platform || !contactData.username || !contactData.url) {
          throw new Error('缺少必要的字段')
        }

        await database.createSocialContact({
          platform: contactData.platform,
          username: contactData.username,
          url: contactData.url,
          is_active: true,
          sort_order: contacts.length
        })
      }

      await loadContacts()
      setEditingContact(null)
      setIsAdding(false)
    } catch (err) {
      console.error('Error saving contact:', err)
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  // 删除联系方式
  const deleteContact = async (contactId: string) => {
    if (!window.confirm('确定要删除这个联系方式吗？')) return

    try {
      const database = await getDatabase()
      await database.deleteSocialContact(contactId)
      await loadContacts()
    } catch (err) {
      console.error('Error deleting contact:', err)
      setError(err instanceof Error ? err.message : '删除失败')
    }
  }

  // 编辑表单组件
  const ContactForm = ({ contact }: { contact?: SocialContactData }) => {
    const [formData, setFormData] = useState({
      platform: contact?.platform || 'telegram',
      username: contact?.username || '',
      url: contact?.url || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      const finalUrl = formData.url || generateUrl(formData.platform, formData.username)

      saveContact({
        ...formData,
        url: finalUrl
      })
    }

    return (
      <div className="bg-gray-700/50 border border-gray-600/30 rounded-lg p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">平台</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({
                ...formData,
                platform: e.target.value,
                url: '' // 清空URL，让用户重新输入或自动生成
              })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {Object.entries(PLATFORMS).map(([key, platform]) => (
                <option key={key} value={key}>{platform.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">用户名/号码</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder={PLATFORMS[formData.platform as keyof typeof PLATFORMS]?.placeholder}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">链接URL (可选，留空自动生成)</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder={generateUrl(formData.platform, formData.username || PLATFORMS[formData.platform as keyof typeof PLATFORMS]?.placeholder || '')}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
            <Button
              type="button"
              onClick={() => {
                setEditingContact(null)
                setIsAdding(false)
              }}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              <X className="w-4 h-4 mr-2" />
              取消
            </Button>
          </div>
        </form>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-700 rounded w-2/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Phone className="w-5 h-5 mr-2 text-purple-400" />
            {isAdmin ? '社交联系方式管理' : t('contact.title')}
          </h3>
          {isAdmin && (
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加联系方式
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
            错误: {error}
          </div>
        )}

        {!isAdmin && (
          <p className="text-gray-400 mb-6 text-sm">
            {t('contact.description')}
          </p>
        )}

        {/* 添加新联系方式表单 */}
        {isAdmin && isAdding && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-3">添加新联系方式</h4>
            <ContactForm />
          </div>
        )}

        {/* 编辑表单 */}
        {isAdmin && editingContact && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-3">编辑联系方式</h4>
            <ContactForm contact={editingContact} />
          </div>
        )}

        {/* 联系方式列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => {
            const platformConfig = PLATFORMS[contact.platform as keyof typeof PLATFORMS]
            if (!platformConfig) return null

            return (
              <div
                key={contact.id}
                className="bg-gray-700/50 border border-gray-600/30 rounded-lg p-4 hover:bg-gray-600/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${platformConfig.color} text-white`}>
                      {platformConfig.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{platformConfig.name}</h4>
                      <p className="text-gray-400 text-xs">{getPlatformDescription(contact.platform, t)}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setEditingContact(contact)}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                        size="sm"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => deleteContact(contact.id)}
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        size="sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800/50 rounded p-2 mb-3">
                  <code className="text-purple-300 text-sm">
                    {contact.username}
                  </code>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => window.open(contact.url, '_blank', 'noopener,noreferrer')}
                    className={`flex-1 ${platformConfig.color} text-white text-sm`}
                    size="sm"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {t(`contact.${contact.platform}.action`)}
                  </Button>

                  {contact.platform === 'email' && (
                    <Button
                      onClick={() => copyToClipboard(contact.username, contact.id)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 text-sm"
                      size="sm"
                    >
                      {copiedContact === contact.id ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {contacts.length === 0 && !isAdding && (
          <div className="text-center py-8 text-gray-400">
            {isAdmin ? '暂无联系方式，点击上方按钮添加' : '暂无联系方式'}
          </div>
        )}

        {!isAdmin && contacts.length > 0 && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-blue-400 mt-0.5">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-blue-400 font-medium text-sm">{t('contact.tip.title')}</h4>
                <p className="text-blue-300 text-xs mt-1">
                  {t('contact.tip.description')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
