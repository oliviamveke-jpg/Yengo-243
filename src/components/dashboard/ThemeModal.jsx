<<<<<<< HEAD
import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { vendorStorage } from '../../utils/storage'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' }
]

export default function ThemeModal({ isOpen, onClose, vendor, onThemeChanged }) {
  const [selectedTheme, setSelectedTheme] = useState('dark')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (vendor && isOpen) {
      const settings = vendorStorage.getSettings(vendor.id)
      setSelectedTheme(settings.theme || 'dark')
    }
  }, [vendor, isOpen])

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const settings = vendorStorage.getSettings(vendor.id)
      settings.theme = selectedTheme
      vendorStorage.setSettings(vendor.id, settings)

      // Apply theme immediately
      if (selectedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
      } else if (selectedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
      }

      onThemeChanged(selectedTheme)
      handleClose()
      alert('Theme updated successfully!')
    } catch (error) {
      console.error('Error updating theme:', error)
      alert('Failed to update theme. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
=======
import React from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useTheme } from '../../theme/ThemeProvider'
import { useTranslation } from '../../i18n/I18nProvider'

const THEME_OPTIONS = [
  { value: 'light', labelKey: 'theme.light', icon: '☀️', descKey: 'theme.lightDesc' },
  { value: 'dark', labelKey: 'theme.dark', icon: '🌙', descKey: 'theme.darkDesc' },
  { value: 'system', labelKey: 'theme.system', icon: '💻', descKey: 'theme.systemDesc' }
]

export default function ThemeModal({ isOpen, onClose, vendor, onThemeChanged }) {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const selectedTheme = theme

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTheme(selectedTheme)
    onThemeChanged(selectedTheme)
>>>>>>> e66c1ea (Update app)
    onClose()
  }

  return (
<<<<<<< HEAD
    <Modal isOpen={isOpen} onClose={handleClose} title="Theme Preference" size="medium">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {THEME_OPTIONS.map(option => (
            <div
              key={option.value}
              onClick={() => handleThemeSelect(option.value)}
              style={{
                padding: '20px',
                backgroundColor: selectedTheme === option.value ? '#1e3a5f' : '#0f172a',
                border: selectedTheme === option.value ? '2px solid #3b82f6' : '1px solid #334155',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedTheme !== option.value) {
                  e.target.style.backgroundColor = '#1e293b'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTheme !== option.value) {
                  e.target.style.backgroundColor = '#0f172a'
                }
=======
    <Modal isOpen={isOpen} onClose={onClose} title={t('theme.title')} size="medium">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {THEME_OPTIONS.map(option => (
            <div
              key={option.value}
              onClick={() => setTheme(option.value)}
              className="dashboard-card-surface"
              style={{
                display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                border: selectedTheme === option.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: selectedTheme === option.value ? 'var(--bg)' : 'var(--surface)',
                transition: 'all 150ms ease'
>>>>>>> e66c1ea (Update app)
              }}
            >
              <span style={{ fontSize: '2rem' }}>{option.icon}</span>
              <div>
<<<<<<< HEAD
                <h4 style={{ color: '#e2e8f0', margin: '0 0 4px' }}>{option.label}</h4>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
                  {option.value === 'light' && 'Always use light mode'}
                  {option.value === 'dark' && 'Always use dark mode'}
                  {option.value === 'system' && 'Follow system preference'}
=======
                <h4 style={{ margin: '0 0 4px', color: 'var(--text)' }}>{t(option.labelKey)}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {t(option.descKey)}
>>>>>>> e66c1ea (Update app)
                </p>
              </div>
            </div>
          ))}
        </div>
<<<<<<< HEAD

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Applying...' : 'Apply Theme'}
          </Button>
=======
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button type="button" variant="secondary" onClick={onClose}>{t('theme.cancel')}</Button>
          <Button type="submit" variant="primary">{t('theme.apply')}</Button>
>>>>>>> e66c1ea (Update app)
        </div>
      </form>
    </Modal>
  )
}
