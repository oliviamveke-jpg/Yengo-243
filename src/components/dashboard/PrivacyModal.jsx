import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Toggle from '../ui/Toggle'
import { vendorStorage } from '../../utils/storage'

export default function PrivacyModal({ isOpen, onClose, vendor, onPrivacyUpdated }) {
  const [privacySettings, setPrivacySettings] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (vendor && isOpen) {
      const settings = vendorStorage.getSettings(vendor.id)
      setPrivacySettings(settings.privacy || {
        publicProfile: true,
        showPhone: true,
        showEmail: false,
        receiveMessages: true
      })
    }
  }, [vendor, isOpen])

  const handleToggleChange = (key, value) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const settings = vendorStorage.getSettings(vendor.id)
      settings.privacy = privacySettings
      vendorStorage.setSettings(vendor.id, settings)

      onPrivacyUpdated(privacySettings)
      handleClose()
      alert('Privacy settings updated successfully!')
    } catch (error) {
      console.error('Error updating privacy settings:', error)
      alert('Failed to update privacy settings. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Privacy Settings" size="medium">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
            <div>
              <h4 style={{ color: '#e2e8f0', margin: '0 0 4px' }}>Public Profile</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Make your profile visible to all users</p>
            </div>
            <Toggle
              checked={privacySettings.publicProfile}
              onChange={(checked) => handleToggleChange('publicProfile', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
            <div>
              <h4 style={{ color: '#e2e8f0', margin: '0 0 4px' }}>Show Phone Number</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Display your phone number on listings</p>
            </div>
            <Toggle
              checked={privacySettings.showPhone}
              onChange={(checked) => handleToggleChange('showPhone', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
            <div>
              <h4 style={{ color: '#e2e8f0', margin: '0 0 4px' }}>Show Email</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Display your email address on listings</p>
            </div>
            <Toggle
              checked={privacySettings.showEmail}
              onChange={(checked) => handleToggleChange('showEmail', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
            <div>
              <h4 style={{ color: '#e2e8f0', margin: '0 0 4px' }}>Receive Messages</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Allow customers to send you messages</p>
            </div>
            <Toggle
              checked={privacySettings.receiveMessages}
              onChange={(checked) => handleToggleChange('receiveMessages', checked)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
