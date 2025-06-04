"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import type { Category } from '@/lib/database'

interface CategoryManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (categoryData: Omit<Category, 'id' | 'created_at'>) => void
  editingCategory?: Category | null
}

export function CategoryManagementModal({
  isOpen,
  onClose,
  onSave,
  editingCategory
}: CategoryManagementModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  // Load editing category data
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        display_name: editingCategory.display_name,
        description: editingCategory.description || ''
      })
    } else {
      setFormData({
        name: '',
        display_name: '',
        description: ''
      })
    }
  }, [editingCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSave({
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description
      })
      onClose()
    } catch (error) {
      console.error('Error saving category:', error)
      alert(`Error saving category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-600/30 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
          <h3 className="text-xl font-bold text-white">
            {editingCategory ? '编辑分类' : '添加分类'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">分类名称 *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="例如: weapon, armor, costume"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">显示名称 *</label>
            <input
              type="text"
              required
              value={formData.display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="例如: 武器, 防具, 时装"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">描述</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical"
              placeholder="可选的分类描述..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600/30">
            <Button type="button" onClick={onClose} variant="outline" className="border-gray-600 text-gray-300">
              取消
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? '保存中...' : (editingCategory ? '更新分类' : '添加分类')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
