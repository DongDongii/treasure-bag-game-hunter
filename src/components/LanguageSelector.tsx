"use client"

import { useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { languages, type Language } from '@/lib/i18n'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{currentLanguage?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-40 bg-gray-900/98 backdrop-blur-md border border-gray-500/50 rounded-lg shadow-2xl z-[999] max-h-60 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as Language)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-600/30 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  language === lang.code
                    ? 'bg-purple-600/40 text-purple-200 font-semibold'
                    : 'text-gray-100 hover:text-white'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
