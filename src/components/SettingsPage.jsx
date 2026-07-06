import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Globe, Sun, Shield, Trash2, Bell, CheckCircle, X, AlertTriangle } from 'lucide-react'
import { useTranslation } from '../i18n/I18nProvider'
import { userService } from '../services/userService'
import ChangePasswordModal from './dashboard/ChangePasswordModal'
import ThemeModal from './dashboard/ThemeModal'
import LanguageModal from './dashboard/LanguageModal'
import PrivacyModal from './dashboard/PrivacyModal'

/**
 * SettingsPage — Shared settings page for buyers and vendors.
 *
 * Features:
 *   - Change password (modal)
 *   - Notification preferences
 *   - Language preference (modal)
 *   - Theme preference (modal)
 *   - Privacy & security (modal)
 *   - Delete account (confirmation dialog)
 */
export default function SettingsPage({ currentUser, onUserUpdate, onBack, onDeleteAccount }) {
  const { t } = useTranslation()
  const [toast, setToast] = useState(null)

  // Modals
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showTheme, setShowTheme] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  // Notification preferences (local state — in real app would be saved)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false
  })

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    showToast('success', 'Notification preferences updated!')
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toUpperCase() === 'DELETE') {
      if (onDeleteAccount) {
        onDeleteAccount()
      }
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="settings-page">
      {/* Header */}
      <header className="settings-page-header">
        <button className="btn btn-sm btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <h1>Settings</h1>
        <div />
      </header>

      <div className="settings-page-content">
        {/* Account Settings */}
        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="settings-card-title">Account</h2>
          <div className="settings-options">
            <button className="settings-option" onClick={() => setShowChangePassword(true)}>
              <div className="settings-option-icon" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB' }}>
                <Lock size={18} />
              </div>
              <div className="settings-option-text">
                <span className="settings-option-label">Change Password</span>
                <span className="settings-option-desc">Update your account password</span>
              </div>
              <span className="settings-option-arrow">→</span>
            </button>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <h2 className="settings-card-title">Preferences</h2>
          <div className="settings-options">
            <button className="settings-option" onClick={() => setShowTheme(true)}>
              <div className="settings-option-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                <Sun size={18} />
              </div>
              <div className="settings-option-text">
                <span className="settings-option-label">Theme</span>
                <span className="settings-option-desc">Light, Dark, or System</span>
              </div>
              <span className="settings-option-arrow">→</span>
            </button>

            <button className="settings-option" onClick={() => setShowLanguage(true)}>
              <div className="settings-option-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <Globe size={18} />
              </div>
              <div className="settings-option-text">
                <span className="settings-option-label">Language</span>
                <span className="settings-option-desc">Choose your preferred language</span>
              </div>
              <span className="settings-option-arrow">→</span>
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <h2 className="settings-card-title">Notifications</h2>
          <div className="settings-options">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
              { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
              { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional offers and updates' },
            ].map(item => (
              <div key={item.key} className="settings-option settings-option-toggle">
                <div className="settings-option-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                  <Bell size={18} />
                </div>
                <div className="settings-option-text">
                  <span className="settings-option-label">{item.label}</span>
                  <span className="settings-option-desc">{item.desc}</span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={() => handleToggleNotification(item.key)}
                  />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <h2 className="settings-card-title">Privacy & Security</h2>
          <div className="settings-options">
            <button className="settings-option" onClick={() => setShowPrivacy(true)}>
              <div className="settings-option-icon" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                <Shield size={18} />
              </div>
              <div className="settings-option-text">
                <span className="settings-option-label">Privacy Controls</span>
                <span className="settings-option-desc">Manage your privacy and visibility settings</span>
              </div>
              <span className="settings-option-arrow">→</span>
            </button>
          </div>
        </motion.div>

        {/* Delete Account */}
        <motion.div
          className="settings-card settings-card-danger"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <h2 className="settings-card-title" style={{ color: '#ef4444' }}>Danger Zone</h2>
          <div className="settings-options">
            <button className="settings-option settings-option-danger" onClick={() => setShowDeleteConfirm(true)}>
              <div className="settings-option-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                <Trash2 size={18} />
              </div>
              <div className="settings-option-text">
                <span className="settings-option-label" style={{ color: '#ef4444' }}>Delete Account</span>
                <span className="settings-option-desc">Permanently delete your account and all data</span>
              </div>
              <span className="settings-option-arrow" style={{ color: '#ef4444' }}>→</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`settings-toast settings-toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
          {toast.message}
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="settings-modal-overlay" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-icon">
              <AlertTriangle size={32} style={{ color: '#ef4444' }} />
            </div>
            <h3 className="settings-modal-title">Delete Account</h3>
            <p className="settings-modal-desc">
              This action is <strong>permanent</strong> and cannot be undone. All your data, listings, and account information will be deleted.
            </p>
            <div className="settings-modal-input-group">
              <label className="settings-modal-label">
                Type <strong>DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                className="settings-modal-input"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
              />
            </div>
            <div className="settings-modal-actions">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-danger"
                disabled={deleteConfirmText !== 'DELETE'}
                onClick={handleDeleteAccount}
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        currentUser={currentUser}
        onPasswordChanged={(updatedUser) => {
          if (updatedUser) {
            onUserUpdate(updatedUser)
            showToast('success', 'Password changed successfully!')
          }
          setShowChangePassword(false)
        }}
      />

      <ThemeModal
        isOpen={showTheme}
        onClose={() => setShowTheme(false)}
        vendor={null}
        onThemeChanged={() => setShowTheme(false)}
      />

      <LanguageModal
        isOpen={showLanguage}
        onClose={() => setShowLanguage(false)}
        vendor={null}
        onLanguageChanged={() => setShowLanguage(false)}
      />

      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        vendor={null}
        onPrivacyUpdated={() => setShowPrivacy(false)}
      />
    </div>
  )
}
