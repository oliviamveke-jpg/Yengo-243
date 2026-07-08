import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Globe, Sun, Shield, Trash2, Bell, CheckCircle, X, AlertTriangle, EyeOff } from 'lucide-react'
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
 *   - Delete account (two-step: confirm + password re-auth → callback)
 */
export default function SettingsPage({ currentUser, onUserUpdate, onBack, onDeleteAccount }) {
  const { t } = useTranslation()
  const [toast, setToast] = useState(null)

  // Modals
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showTheme, setShowTheme] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  // Delete account confirmation — two steps
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  // Step 1 = confirm dialog, Step 2 = password re-auth
  const [deleteStep, setDeleteStep] = useState(1)

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

  const handleDeleteConfirm = () => {
    // Move to step 2: password re-authentication
    setDeleteStep(2)
    setDeleteError('')
    setDeletePassword('')
  }

  const handleDeleteWithPassword = () => {
    if (!deletePassword.trim()) {
      setDeleteError('Please enter your password to confirm deletion.')
      return
    }
    setDeleteLoading(true)
    setDeleteError('')

    // Verify password via userService
    const account = currentUser ? userService.findAccountByEmail(currentUser.email) : null
    if (!account) {
      setDeleteError('Account not found. Please try logging in again.')
      setDeleteLoading(false)
      return
    }
    if (account.password !== deletePassword) {
      setDeleteError('Incorrect password. Account deletion cancelled.')
      setDeleteLoading(false)
      return
    }

    // Password verified — proceed with deletion
    if (onDeleteAccount) {
      onDeleteAccount()
    }
    setShowDeleteConfirm(false)
    setDeletePassword('')
    setDeleteStep(1)
    setDeleteLoading(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setDeletePassword('')
    setDeleteError('')
    setDeleteStep(1)
    setDeleteLoading(false)
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

      {/* Delete Account Confirmation Modal — Two-Step Process */}
      {showDeleteConfirm && (
        <div className="settings-modal-overlay" onClick={handleCancelDelete}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>

            {/* Step 1 — Confirmation Dialog */}
            {deleteStep === 1 && (
              <>
                <div className="settings-modal-icon">
                  <AlertTriangle size={40} style={{ color: '#ef4444' }} />
                </div>
                <h3 className="settings-modal-title">Delete Account</h3>
                <p className="settings-modal-desc" style={{ textAlign: 'left', lineHeight: 1.6 }}>
                  This action is <strong>permanent</strong>.
                  <br /><br />
                  Your account, businesses, favorites, reviews, chats, and all associated data will be permanently deleted.
                  <br /><br />
                  This action <strong>cannot be undone</strong>.
                </p>
                <div className="settings-modal-actions" style={{ justifyContent: 'center', gap: 16, marginTop: 24 }}>
                  <button
                    className="btn btn-lg btn-ghost"
                    onClick={handleCancelDelete}
                    style={{ padding: '12px 32px', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-lg btn-danger"
                    onClick={handleDeleteConfirm}
                    style={{ padding: '12px 32px', fontWeight: 700, background: '#ef4444', color: '#fff', border: 'none' }}
                  >
                    Delete Permanently
                  </button>
                </div>
              </>
            )}

            {/* Step 2 — Password Re-authentication */}
            {deleteStep === 2 && (
              <>
                <div className="settings-modal-icon">
                  <EyeOff size={32} style={{ color: '#ef4444' }} />
                </div>
                <h3 className="settings-modal-title">Confirm Your Password</h3>
                <p className="settings-modal-desc" style={{ textAlign: 'left', lineHeight: 1.5 }}>
                  For security, please enter your password to confirm account deletion.
                </p>
                {deleteError && (
                  <div style={{
                    padding: '10px 16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 10,
                    color: '#dc2626',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: 12
                  }}>
                    {deleteError}
                  </div>
                )}
                <div className="settings-modal-input-group">
                  <label className="settings-modal-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="settings-modal-input"
                    value={deletePassword}
                    onChange={(e) => { setDeletePassword(e.target.value); setDeleteError('') }}
                    placeholder="Enter your password"
                    autoFocus
                    style={{ padding: '12px 16px', fontSize: '1rem' }}
                  />
                </div>
                <div className="settings-modal-actions" style={{ justifyContent: 'center', gap: 16, marginTop: 24 }}>
                  <button
                    className="btn btn-lg btn-ghost"
                    onClick={handleCancelDelete}
                    style={{ padding: '12px 32px', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-lg btn-danger"
                    onClick={handleDeleteWithPassword}
                    disabled={deleteLoading}
                    style={{
                      padding: '12px 32px',
                      fontWeight: 700,
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      opacity: deleteLoading ? 0.6 : 1
                    }}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </>
            )}

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
