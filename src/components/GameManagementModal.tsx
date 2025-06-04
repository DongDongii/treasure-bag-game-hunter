"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { Game } from '@/lib/database'

interface GameManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (game: Omit<Game, 'id' | 'created_at'>) => void
  editingGame?: Game | null
}

const AVAILABLE_PLATFORMS = ['PC', 'Xbox', 'PS4', 'PS5', 'NS', 'iOS', 'Android']

export function GameManagementModal({ isOpen, onClose, onSave, editingGame }: GameManagementModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    supported_platforms: [] as string[]
  })

  const [loading, setLoading] = useState(false)

  // Load editing game data
  useEffect(() => {
    if (editingGame) {
      setFormData({
        name: editingGame.name,
        display_name: editingGame.display_name,
        supported_platforms: editingGame.supported_platforms ?
          (typeof editingGame.supported_platforms === 'string'
            ? editingGame.supported_platforms.split(',').map(p => p.trim())
            : editingGame.supported_platforms
          ) : []
      })
    } else {
      setFormData({
        name: '',
        display_name: '',
        supported_platforms: []
      })
    }
  }, [editingGame])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 添加默认的gold_rate以保持数据库兼容性
      await onSave({
        name: formData.name,
        display_name: formData.display_name,
        supported_platforms: formData.supported_platforms.join(','),
        gold_rate: 1000 // 默认值，不再显示给用户
      })
      onClose()
    } catch (error) {
      console.error('保存游戏时发生错误:', error)
      alert(`保存游戏失败: ${error instanceof Error ? error.message : '未知错误'}`)
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
            {editingGame ? '编辑游戏' : '添加新游戏'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">内部名称 *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="例如: maplestory"
            />
            <p className="text-xs text-gray-400 mt-1">小写字母，无空格（内部使用）</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">显示名称 *</label>
            <input
              type="text"
              required
              value={formData.display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="例如: MapleStory"
            />
            <p className="text-xs text-gray-400 mt-1">向用户显示的名称</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">支持平台 *</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_PLATFORMS.map((platform) => (
                <label key={platform} className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded cursor-pointer hover:bg-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.supported_platforms.includes(platform)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          supported_platforms: [...prev.supported_platforms, platform]
                        }))
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          supported_platforms: prev.supported_platforms.filter(p => p !== platform)
                        }))
                      }
                    }}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-white text-sm">{platform}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">选择游戏支持的平台，商品将继承这些平台信息</p>
          </div>


          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600/30">
            <Button type="button" onClick={onClose} variant="outline" className="border-gray-600 text-gray-300">
              取消
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? '保存中...' : (editingGame ? '更新游戏' : '添加游戏')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
