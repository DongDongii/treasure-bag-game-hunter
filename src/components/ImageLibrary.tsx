"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Trash2, Copy, Search, X, Grid, List } from 'lucide-react'

interface ImageItem {
  id: string
  name: string
  url: string
  category: string
  emoji?: string
  createdAt: string
}

interface ImageLibraryProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage?: (imageUrl: string) => void
}

export function ImageLibrary({ isOpen, onClose, onSelectImage }: ImageLibraryProps) {
  const [images, setImages] = useState<ImageItem[]>([
    // Default emoji collection
    { id: '1', name: 'Sword', url: '⚔️', category: 'weapon', emoji: '⚔️', createdAt: new Date().toISOString() },
    { id: '2', name: 'Shield', url: '🛡️', category: 'armor', emoji: '🛡️', createdAt: new Date().toISOString() },
    { id: '3', name: 'Crown', url: '👑', category: 'accessory', emoji: '👑', createdAt: new Date().toISOString() },
    { id: '4', name: 'Dragon', url: '🐲', category: 'mount', emoji: '🐲', createdAt: new Date().toISOString() },
    { id: '5', name: 'Penguin', url: '🐧', category: 'costume', emoji: '🐧', createdAt: new Date().toISOString() },
    { id: '6', name: 'Star', url: '⭐', category: 'mount', emoji: '⭐', createdAt: new Date().toISOString() },
    { id: '7', name: 'Fire', url: '🔥', category: 'weapon', emoji: '🔥', createdAt: new Date().toISOString() },
    { id: '8', name: 'Crystal', url: '💎', category: 'accessory', emoji: '💎', createdAt: new Date().toISOString() },
    { id: '9', name: 'Magic Wand', url: '🪄', category: 'weapon', emoji: '🪄', createdAt: new Date().toISOString() },
    { id: '10', name: 'Ring', url: '💍', category: 'accessory', emoji: '💍', createdAt: new Date().toISOString() },
    { id: '11', name: 'Game Controller', url: '🎮', category: 'general', emoji: '🎮', createdAt: new Date().toISOString() },
    { id: '12', name: 'Treasure Chest', url: '📦', category: 'general', emoji: '📦', createdAt: new Date().toISOString() },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newImage, setNewImage] = useState({ name: '', url: '', category: 'general' })

  const categories = ['all', 'weapon', 'armor', 'costume', 'mount', 'accessory', 'general']

  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddImage = () => {
    if (!newImage.name || !newImage.url) return

    const image: ImageItem = {
      id: Date.now().toString(),
      name: newImage.name,
      url: newImage.url,
      category: newImage.category,
      emoji: newImage.url.length <= 2 ? newImage.url : undefined,
      createdAt: new Date().toISOString()
    }

    setImages(prev => [...prev, image])
    setNewImage({ name: '', url: '', category: 'general' })
    setShowAddForm(false)
  }

  const handleDeleteImage = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setImages(prev => prev.filter(img => img.id !== id))
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSelectImage = (imageUrl: string) => {
    if (onSelectImage) {
      onSelectImage(imageUrl)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-600/30 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
          <h3 className="text-xl font-bold text-white">Image Library</h3>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-600/30 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </div>

          {/* Add Image Form */}
          {showAddForm && (
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Image name"
                  value={newImage.name}
                  onChange={(e) => setNewImage(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Emoji or URL"
                  value={newImage.url}
                  onChange={(e) => setNewImage(prev => ({ ...prev, url: e.target.value }))}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddImage} className="bg-green-600 hover:bg-green-700">
                  Add Image
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline" className="border-gray-600 text-gray-300">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Image Grid/List */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredImages.map(image => (
                <div
                  key={image.id}
                  className="bg-gray-700/50 border border-gray-600/30 rounded-lg p-4 hover:bg-gray-600/50 transition-colors group"
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">{image.emoji || '🖼️'}</div>
                    <div className="text-sm text-white font-medium truncate">{image.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{image.category}</div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onSelectImage && (
                        <Button
                          size="sm"
                          onClick={() => handleSelectImage(image.url)}
                          className="bg-purple-600 hover:bg-purple-700 text-xs px-2 py-1"
                        >
                          Select
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(image.url)}
                        className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteImage(image.id)}
                        className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredImages.map(image => (
                <div
                  key={image.id}
                  className="bg-gray-700/50 border border-gray-600/30 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{image.emoji || '🖼️'}</div>
                    <div>
                      <div className="text-white font-medium">{image.name}</div>
                      <div className="text-sm text-gray-400 capitalize">{image.category}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {onSelectImage && (
                      <Button
                        size="sm"
                        onClick={() => handleSelectImage(image.url)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Select
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(image.url)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDeleteImage(image.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredImages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🖼️</div>
              <div className="text-gray-400">No images found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
