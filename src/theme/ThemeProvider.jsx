import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { storageAdapter } from '../services/storageAdapter'

const ThemeContext = createContext(null)

const THEME_STORAGE_KEY = 'yengoTheme'

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getEffectiveTheme(saved) {
  if (saved === 'dark') return 'dark'
  if (saved === 'light') return 'light'
  return getSystemTheme()
}

export function ThemeProvider({ children }) {
  const [saved, setSaved] = useState(() => {
    return storageAdapter.readString(THEME_STORAGE_KEY, 'system')
  })
  const [effectiveTheme, setEffectiveTheme] = useState(() => getEffectiveTheme(saved))

  // Apply theme to <html>
  const applyTheme = useCallback((effective) => {
    document.documentElement.setAttribute('data-theme', effective)
  }, [])

  // On mount + saved change
  useEffect(() => {
    const effective = getEffectiveTheme(saved)
    setEffectiveTheme(effective)
    applyTheme(effective)
    storageAdapter.writeString(THEME_STORAGE_KEY, saved)
  }, [saved, applyTheme])

  // Listen for system preference changes when in 'system' mode
  useEffect(() => {
    if (saved !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const effective = getSystemTheme()
      setEffectiveTheme(effective)
      applyTheme(effective)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [saved, applyTheme])

  const setTheme = useCallback((newTheme) => {
    setSaved(newTheme)
  }, [])

  const value = {
    theme: saved,      // 'light', 'dark', or 'system'
    effectiveTheme,    // 'light' or 'dark' (resolved)
    setTheme,
    isDark: effectiveTheme === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
