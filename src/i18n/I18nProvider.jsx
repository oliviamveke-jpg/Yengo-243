import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { storageAdapter } from '../services/storageAdapter'
import locales from './index'

const I18nContext = createContext(null)

const LANGUAGE_STORAGE_KEY = 'yengoLanguage'

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    return storageAdapter.readString(LANGUAGE_STORAGE_KEY, 'en')
  })

  useEffect(() => {
    storageAdapter.writeString(LANGUAGE_STORAGE_KEY, locale)
  }, [locale])

  const t = useCallback((key) => {
    const translations = locales[locale]
    if (translations && translations[key] !== undefined) return translations[key]
    // fallback to English
    if (locale !== 'en' && locales.en && locales.en[key] !== undefined) return locales.en[key]
    // last resort: return the key itself
    return key
  }, [locale])

  const setLocale = useCallback((newLocale) => {
    if (locales[newLocale]) setLocaleState(newLocale)
  }, [])

  return (
    <I18nContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider')
  return ctx
}
