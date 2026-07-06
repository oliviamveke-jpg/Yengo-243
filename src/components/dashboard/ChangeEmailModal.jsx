import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { validateEmail, validateRequired } from '../../utils/validation'
<<<<<<< HEAD

export default function ChangeEmailModal({ isOpen, onClose, currentUser, onEmailChanged }) {
  const [formData, setFormData] = useState({
    currentEmail: '',
    newEmail: '',
    confirmEmail: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
=======
import { userService } from '../../services/userService'
import { useTranslation } from '../../i18n/I18nProvider'

export default function ChangeEmailModal({ isOpen, onClose, currentUser, onEmailChanged }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ currentEmail: '', newEmail: '', confirmEmail: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
>>>>>>> e66c1ea (Update app)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
<<<<<<< HEAD
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
=======
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
>>>>>>> e66c1ea (Update app)
  }

  const validate = () => {
    const newErrors = {}
<<<<<<< HEAD

    if (!validateRequired(formData.currentEmail)) {
      newErrors.currentEmail = 'Current email is required'
    } else if (formData.currentEmail !== currentUser.email) {
      newErrors.currentEmail = 'Current email does not match'
    }

    if (!validateEmail(formData.newEmail)) {
      newErrors.newEmail = 'Please enter a valid email address'
    } else if (formData.newEmail === currentUser.email) {
      newErrors.newEmail = 'New email must be different from current email'
    }

    if (!validateRequired(formData.confirmEmail)) {
      newErrors.confirmEmail = 'Please confirm your email'
    } else if (formData.newEmail !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Emails do not match'
    }

=======
    if (!validateRequired(formData.currentEmail)) newErrors.currentEmail = t('changeEmail.currentRequired')
    else if (formData.currentEmail !== currentUser.email) newErrors.currentEmail = t('changeEmail.currentMismatch')
    if (!validateEmail(formData.newEmail)) newErrors.newEmail = t('changeEmail.newInvalid')
    else if (formData.newEmail === currentUser.email) newErrors.newEmail = t('changeEmail.mustBeDifferent')
    if (!validateRequired(formData.confirmEmail)) newErrors.confirmEmail = t('changeEmail.confirmRequired')
    else if (formData.newEmail !== formData.confirmEmail) newErrors.confirmEmail = t('changeEmail.emailsDontMatch')
>>>>>>> e66c1ea (Update app)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendVerification = async (e) => {
    e.preventDefault()
<<<<<<< HEAD

    if (!validate()) return

    setIsSubmitting(true)

    try {
      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowVerification(true)
      setVerificationCode(Math.floor(100000 + Math.random() * 900000).toString())
      alert(`Verification code sent to ${formData.newEmail}: ${verificationCode}`)
    } catch (error) {
      console.error('Error sending verification:', error)
      alert('Failed to send verification code. Please try again.')
=======
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowVerification(true)
    } catch (error) {
      // Error handled silently
>>>>>>> e66c1ea (Update app)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyAndChange = async (e) => {
    e.preventDefault()
<<<<<<< HEAD

    if (verificationCode !== formData.verificationCode) {
      setErrors({ verificationCode: 'Invalid verification code' })
      return
    }

    setIsSubmitting(true)

    try {
      // Update user email in localStorage
      const users = JSON.parse(localStorage.getItem('yengoReactUsers') || '[]')
      const userIndex = users.findIndex(u => u.id === currentUser.id)
      
      if (userIndex !== -1) {
        users[userIndex].email = formData.newEmail
        localStorage.setItem('yengoReactUsers', JSON.stringify(users))
        
        // Update current user
        const updatedUser = { ...currentUser, email: formData.newEmail }
        localStorage.setItem('yengoReactCurrentUser', JSON.stringify(updatedUser))
        
        onEmailChanged(updatedUser)
        handleClose()
        
        alert('Email changed successfully!')
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      console.error('Error changing email:', error)
      alert('Failed to change email. Please try again.')
=======
    setIsSubmitting(true)
    try {
      const updatedUser = userService.updateUser(currentUser.id, { email: formData.newEmail }) || { ...currentUser, email: formData.newEmail }
      if (!updatedUser) throw new Error('User not found')
      onEmailChanged(updatedUser)
      onClose()
    } catch (error) {
      // Error handled silently
>>>>>>> e66c1ea (Update app)
    } finally {
      setIsSubmitting(false)
    }
  }

<<<<<<< HEAD
  const handleClose = () => {
    setFormData({ currentEmail: '', newEmail: '', confirmEmail: '', verificationCode: '' })
    setErrors({})
    setShowVerification(false)
    setVerificationCode('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Email" size="medium">
      {!showVerification ? (
        <form onSubmit={handleSendVerification}>
          <Input
            label="Current Email"
            name="currentEmail"
            type="email"
            value={formData.currentEmail}
            onChange={handleChange}
            error={errors.currentEmail}
            required
            placeholder={currentUser.email}
          />
          <Input
            label="New Email"
            name="newEmail"
            type="email"
            value={formData.newEmail}
            onChange={handleChange}
            error={errors.newEmail}
            required
          />
          <Input
            label="Confirm New Email"
            name="confirmEmail"
            type="email"
            value={formData.confirmEmail}
            onChange={handleChange}
            error={errors.confirmEmail}
            required
          />

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Verification'}
            </Button>
=======
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('changeEmail.title')} size="medium">
      {!showVerification ? (
        <form onSubmit={handleSendVerification}>
          <Input label={t('changeEmail.current')} name="currentEmail" type="email" value={formData.currentEmail} onChange={handleChange} error={errors.currentEmail} required placeholder={currentUser.email} />
          <Input label={t('changeEmail.new')} name="newEmail" type="email" value={formData.newEmail} onChange={handleChange} error={errors.newEmail} required />
          <Input label={t('changeEmail.confirm')} name="confirmEmail" type="email" value={formData.confirmEmail} onChange={handleChange} error={errors.confirmEmail} required />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>{t('changeEmail.cancel')}</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? t('changeEmail.sending') : t('changeEmail.sendVerification')}</Button>
>>>>>>> e66c1ea (Update app)
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndChange}>
<<<<<<< HEAD
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <p style={{ color: '#94a3b8', marginBottom: '8px' }}>
              A verification code has been sent to:
            </p>
            <p style={{ color: '#e2e8f0', fontWeight: '600' }}>{formData.newEmail}</p>
          </div>

          <Input
            label="Verification Code"
            name="verificationCode"
            type="text"
            value={formData.verificationCode}
            onChange={handleChange}
            error={errors.verificationCode}
            required
            placeholder="Enter 6-digit code"
            maxLength={6}
          />

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button type="button" variant="secondary" onClick={() => setShowVerification(false)} disabled={isSubmitting}>
              Back
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify & Change Email'}
            </Button>
=======
          <div className="dashboard-card-surface" style={{ marginBottom: 20 }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{t('changeEmail.verificationSent')}</p>
            <p style={{ fontWeight: 600, color: 'var(--text)' }}>{formData.newEmail}</p>
          </div>
          <Input label={t('changeEmail.verificationCode')} name="verificationCode" type="text" value={formData.verificationCode} onChange={handleChange} required placeholder={t('changeEmail.codePlaceholder')} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={() => setShowVerification(false)} disabled={isSubmitting}>{t('changeEmail.back')}</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? t('changeEmail.verifying') : t('changeEmail.verify')}</Button>
>>>>>>> e66c1ea (Update app)
          </div>
        </form>
      )}
    </Modal>
  )
}
