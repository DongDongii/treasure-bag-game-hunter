"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Send, Users, Copy, ExternalLink } from 'lucide-react'

interface SocialIntegrationProps {
  itemId: string
  itemName: string
  itemUrl?: string
}

export function SocialIntegration({ itemId, itemName, itemUrl }: SocialIntegrationProps) {
  const [copied, setCopied] = useState(false)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareUrl = itemUrl ? `${baseUrl}/items/${itemUrl}` : `${baseUrl}/items?search=${itemId}`
  const shareText = `Check out this item: ${itemName} (ID: ${itemId})`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToWhatsApp = () => {
    const message = encodeURIComponent(`${shareText}\n${shareUrl}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const shareToTelegram = () => {
    const message = encodeURIComponent(shareText)
    const url = encodeURIComponent(shareUrl)
    window.open(`https://t.me/share/url?url=${url}&text=${message}`, '_blank')
  }

  const shareToDiscord = () => {
    // Discord doesn't have a direct share URL, so we copy the message format
    const discordMessage = `**${itemName}**\nItem ID: \`${itemId}\`\n${shareUrl}`
    navigator.clipboard.writeText(discordMessage).then(() => {
      alert('Discord message copied to clipboard! Paste it in your Discord channel.')
    }).catch(err => {
      console.error('Failed to copy Discord message:', err)
    })
  }

  return (
    <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
      <h4 className="text-white font-semibold mb-3 flex items-center">
        <Users className="w-4 h-4 mr-2" />
        Share Item
      </h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button
          onClick={shareToWhatsApp}
          className="bg-green-600 hover:bg-green-700 text-white text-xs p-2 h-auto flex flex-col items-center space-y-1"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </Button>

        <Button
          onClick={shareToTelegram}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs p-2 h-auto flex flex-col items-center space-y-1"
        >
          <Send className="w-4 h-4" />
          <span>Telegram</span>
        </Button>

        <Button
          onClick={shareToDiscord}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs p-2 h-auto flex flex-col items-center space-y-1"
        >
          <Users className="w-4 h-4" />
          <span>Discord</span>
        </Button>

        <Button
          onClick={copyToClipboard}
          className={`text-xs p-2 h-auto flex flex-col items-center space-y-1 transition-colors ${
            copied
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </Button>
      </div>

      <div className="mt-3 p-2 bg-gray-700/50 rounded text-xs text-gray-300">
        <div className="flex items-center justify-between">
          <span className="truncate flex-1 mr-2">{shareUrl}</span>
          <button
            onClick={() => window.open(shareUrl, '_blank')}
            className="text-purple-400 hover:text-purple-300"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Quick Share Button Component for inline use
export function QuickShareButton({ itemId, itemName, itemUrl }: SocialIntegrationProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (isOpen) {
    return (
      <div className="relative">
        <SocialIntegration itemId={itemId} itemName={itemName} itemUrl={itemUrl} />
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => setIsOpen(true)}
      variant="outline"
      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
      size="sm"
    >
      <Users className="w-4 h-4 mr-1" />
      Share
    </Button>
  )
}
