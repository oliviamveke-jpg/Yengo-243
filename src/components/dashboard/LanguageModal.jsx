import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { vendorStorage } from '../../utils/storage'

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'ln', label: 'Lingala', flag: '🇨🇩' },
  { value: 'sw', label: 'Swahili', flag: '🇨🇩' },
  { value: 'tsh', label: 'Tshiluba', flag: '🇨🇩' }
]

export default function LanguageModal({ isOpen, onClose, vendor, onLanguageChanged }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (vendor && isOpen) {
      const settings = vendorStorage.getSettings(vendor.id)
      setSelectedLanguage(settings.language || 'en')
    }
  }, [vendor, isOpen])

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const settings = vendorStorage.getSettings(vendor.id)
      settings.language = selectedLanguage
      vendorStorage.setSettings(vendor.id, settings)

      // Store language preference in localStorage for app-wide use
      localStorage.setItem('yengoReactLanguage', selectedLanguage)

      onLanguageChanged(selectedLanguage)
      handleClose()
      alert('Language updated successfully!')
    } catch (error) {
      console.error('Error updating language:', error)
      alert('Failed to update language. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Language Preference" size="medium">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {LANGUAGE_OPTIONS.map(option => (
            <div
              key={option.value}
              onClick={() => handleLanguageSelect(option.value)}
              style={{
                padding: '20px',
                backgroundColor: selectedLanguage === option.value ? '#1e3a5f' : '#0f172a',
                border: selectedLanguage === option.value ? '2px solid #3b82f6' : '1px solid #334155',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedLanguage !== option.value) {
                  e.target.style.backgroundColor = '#1e293b'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLanguage !== option.value) {
                  e.target.style.backgroundColor = '#0f172a'
                }
              }}
            >
              <span style={{ fontSize: '2rem' }}>{option.flag}</span>
              <div>
                <h4 style={{ color: '#e2e8f0', margin: 0 }}>{option.label}</h4>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Applying...' : 'Apply Language'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
