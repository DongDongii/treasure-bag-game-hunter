"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { X, Upload, Image as ImageIcon, Plus, Trash2 } from 'lucide-react'
import { getDatabase } from '@/lib/database'
import type { Item, Game, Category } from '@/lib/database'

interface ItemManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => void
  editingItem?: Item | null
}

const AVAILABLE_PLATFORMS = ['PC', 'Xbox', 'PS4', 'PS5', 'NS', 'iOS', 'Android', 'Steam', 'Epic']

export function ItemManagementModal({ isOpen, onClose, onSave, editingItem }: ItemManagementModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    category: '', // 用户选择游戏分类
    platforms: [] as string[], // 多选平台
    price: 0,
    quantity: 1,
    image: '',
    description: '',
    url: '', // 自动生成
    is_featured: false, // 是否置顶
    sort_order: 0 // 排序权重
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [loading, setLoading] = useState(false)
  const [games, setGames] = useState<Game[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // 生成URL的函数
  const generateUrl = (name: string) => {
    if (!name) return ''
    return name.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .trim()
  }

  // 加载游戏和分类数据
  useEffect(() => {
    const loadData = async () => {
      if (!isOpen) return

      setLoadingData(true)
      try {
        const database = await getDatabase()
        const [gamesData, categoriesData] = await Promise.all([
          database.getGames(),
          database.getCategories()
        ])
        setGames(gamesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [isOpen])

  // 编辑商品数据加载
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        game: editingItem.game,
        category: editingItem.category || '',
        platforms: Array.isArray(editingItem.platform) ? editingItem.platform : [editingItem.platform],
        price: editingItem.price,
        quantity: editingItem.quantity || 1,
        image: editingItem.image,
        description: editingItem.description,
        url: editingItem.url,
        is_featured: editingItem.is_featured || false,
        sort_order: editingItem.sort_order || 0
      })
      setImagePreview(editingItem.image)
    } else {
      setFormData({
        name: '',
        game: '',
        category: '',
        platforms: [],
        price: 0,
        quantity: 1,
        image: '',
        description: '',
        url: '',
        is_featured: false,
        sort_order: 0
      })
      setImagePreview('')
    }
  }, [editingItem])

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    setUploadingImage(true)
    try {
      // 创建本地预览
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('图片上传失败')
    } finally {
      setUploadingImage(false)
    }
  }

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  // 文件选择处理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.[0]) {
      handleFileUpload(files[0])
    }
  }

  // 平台选择处理
  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  // 表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.game || !formData.category || formData.platforms.length === 0) {
      alert('请填写必填字段：商品名称、游戏、分类和至少一个平台')
      return
    }

    setLoading(true)

    try {
      console.log('开始保存商品...', {
        name: formData.name,
        game: formData.game,
        platforms: formData.platforms
      })

      // 自动生成URL
      const autoUrl = generateUrl(formData.name)

      const itemData: Omit<Item, 'id' | 'created_at' | 'updated_at'> = {
        name: formData.name,
        game: formData.game,
        category: formData.category, // 分类名称
        platform: formData.platforms.join(','), // 多个平台用逗号分隔
        price: formData.price,
        quantity: formData.quantity,
        gold_price: `${formData.price}`, // 价格同步到gold_price
        image: formData.image || '🎮', // 默认图标
        rarity: 'common', // 默认为普通
        description: formData.description,
        url: autoUrl,
        is_featured: formData.is_featured,
        sort_order: formData.sort_order
      }

      console.log('准备保存的商品数据:', itemData)

      await onSave(itemData)

      console.log('商品保存成功')
      onClose()
    } catch (error) {
      console.error('保存商品时发生错误:', error)

      // 提供更详细的错误信息
      let errorMessage = '未知错误'
      if (error instanceof Error) {
        errorMessage = error.message
        console.error('错误详情:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      }

      alert(`保存商品失败: ${errorMessage}

请检查:
1. 网络连接是否正常
2. 所选游戏是否存在
3. 商品信息是否完整

如果问题持续，请联系技术支持。`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-600/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
          <h3 className="text-xl font-bold text-white">
            {editingItem ? '编辑商品' : '添加新商品'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loadingData ? (
          <div className="p-6 text-center text-gray-300">
            加载数据中...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 商品名称 */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">商品名称 *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value,
                  url: generateUrl(e.target.value) // 自动生成URL
                }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="输入商品名称"
              />
            </div>

            {/* 游戏选择 */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">游戏 *</label>
              <select
                required
                value={formData.game}
                onChange={(e) => setFormData(prev => ({ ...prev, game: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">选择游戏</option>
                {games.map((game) => (
                  <option key={game.id} value={game.name}>
                    {game.display_name}
                  </option>
                ))}
              </select>
            </div>

            {/* 分类选择 */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">商品分类 *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">选择分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.display_name}
                  </option>
                ))}
              </select>
            </div>

            {/* 平台标签选择 */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">支持平台 * (可多选)</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_PLATFORMS.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handlePlatformToggle(platform)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.platforms.includes(platform)
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                    } border`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
              {formData.platforms.length > 0 && (
                <div className="mt-2 text-sm text-gray-400">
                  已选择: {formData.platforms.join(', ')}
                </div>
              )}
            </div>

            {/* 价格和数量 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">价格 (USD) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">数量</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1"
                />
              </div>
            </div>

            {/* 置顶和排序设置 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">置顶推荐</span>
                </label>
                <p className="text-xs text-gray-400 mt-1">置顶的商品会优先显示在列表顶部</p>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">排序权重</label>
                <input
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: Number.parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-400 mt-1">数字越大排序越靠前</p>
              </div>
            </div>

            {/* 图片上传 */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">商品图片</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging
                    ? 'border-purple-400 bg-purple-400/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="预览"
                      className="max-w-full max-h-48 mx-auto rounded-lg"
                    />
                    <div className="flex space-x-2 justify-center">
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                        size="sm"
                      >
                        更换图片
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setImagePreview('')
                          setFormData(prev => ({ ...prev, image: '' }))
                        }}
                        variant="outline"
                        className="border-red-600 text-red-400"
                        size="sm"
                      >
                        删除图片
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p>拖拽图片到这里，或点击选择文件</p>
                      <p className="text-sm">支持 JPG, PNG, GIF 格式</p>
                      <p className="text-xs text-purple-300 mt-2">
                        💡 推荐尺寸: 320×192px (5:3比例) 或更高分辨率
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                      disabled={uploadingImage}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingImage ? '上传中...' : '选择图片'}
                    </Button>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">描述</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical"
                placeholder="输入商品描述..."
              />
            </div>

            {/* 自动生成的URL预览 */}
            {formData.name && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">自动生成的URL</label>
                <div className="px-3 py-2 bg-gray-900 border border-gray-600 rounded text-gray-400 text-sm">
                  /items/{generateUrl(formData.name)}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600/30">
              <Button type="button" onClick={onClose} variant="outline" className="border-gray-600 text-gray-300">
                取消
              </Button>
              <Button type="submit" disabled={loading || uploadingImage} className="bg-purple-600 hover:bg-purple-700">
                {loading ? '保存中...' : (editingItem ? '更新商品' : '添加商品')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
