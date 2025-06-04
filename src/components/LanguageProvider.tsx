"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type Language, getTranslation } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load saved language from localStorage, but default to English
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language
      // Only use saved language if it's not Chinese, otherwise default to English
      if (savedLang && savedLang !== 'zh') {
        setLanguageState(savedLang)
      } else {
        setLanguageState('en')
        localStorage.setItem('language', 'en')
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string) => getTranslation(key, language)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
