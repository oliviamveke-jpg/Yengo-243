import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { validatePhone, validateRequired } from '../../utils/validation'
<<<<<<< HEAD

export default function ChangePhoneModal({ isOpen, onClose, currentUser, onPhoneChanged }) {
  const [formData, setFormData] = useState({
    currentPhone: '',
    newPhone: '',
    otp: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
=======
import { userService } from '../../services/userService'
import { useTranslation } from '../../i18n/I18nProvider'

export default function ChangePhoneModal({ isOpen, onClose, currentUser, onPhoneChanged }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ currentPhone: '', newPhone: '', otp: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
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

    if (!validateRequired(formData.currentPhone)) {
      newErrors.currentPhone = 'Current phone number is required'
    } else if (formData.currentPhone !== currentUser.phone) {
      newErrors.currentPhone = 'Current phone number does not match'
    }

    if (!validatePhone(formData.newPhone)) {
      newErrors.newPhone = 'Please enter a valid phone number'
    } else if (formData.newPhone === currentUser.phone) {
      newErrors.newPhone = 'New phone number must be different from current'
    }

=======
    if (!validateRequired(formData.currentPhone)) newErrors.currentPhone = t('changePhone.currentRequired')
    else if (formData.currentPhone !== currentUser.phone) newErrors.currentPhone = t('changePhone.currentMismatch')
    if (!validatePhone(formData.newPhone)) newErrors.newPhone = t('changePhone.newInvalid')
    else if (formData.newPhone === currentUser.phone) newErrors.newPhone = t('changePhone.mustBeDifferent')
>>>>>>> e66c1ea (Update app)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
<<<<<<< HEAD

    if (!validate()) return

    setIsSubmitting(true)

    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(otp)
      setShowOtp(true)
      alert(`OTP sent to ${formData.newPhone}: ${otp}`)
    } catch (error) {
      console.error('Error sending OTP:', error)
      alert('Failed to send OTP. Please try again.')
=======
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowOtp(true)
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

    if (formData.otp !== generatedOtp) {
      setErrors({ otp: 'Invalid OTP' })
      return
    }

    setIsSubmitting(true)

    try {
      // Update user phone in localStorage
      const users = JSON.parse(localStorage.getItem('yengoReactUsers') || '[]')
      const userIndex = users.findIndex(u => u.id === currentUser.id)
      
      if (userIndex !== -1) {
        users[userIndex].phone = formData.newPhone
        localStorage.setItem('yengoReactUsers', JSON.stringify(users))
        
        // Update current user
        const updatedUser = { ...currentUser, phone: formData.newPhone }
        localStorage.setItem('yengoReactCurrentUser', JSON.stringify(updatedUser))
        
        onPhoneChanged(updatedUser)
        handleClose()
        
        alert('Phone number changed successfully!')
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      console.error('Error changing phone:', error)
      alert('Failed to change phone number. Please try again.')
=======
    setIsSubmitting(true)
    try {
      const updatedUser = userService.updateUser(currentUser.id, { phone: formData.newPhone }) || { ...currentUser, phone: formData.newPhone }
      if (!updatedUser) throw new Error('User not found')
      onPhoneChanged(updatedUser)
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
    setFormData({ currentPhone: '', newPhone: '', otp: '' })
    setErrors({})
    setShowOtp(false)
    setGeneratedOtp('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Phone Number" size="medium">
      {!showOtp ? (
        <form onSubmit={handleSendOtp}>
          <Input
            label="Current Phone Number"
            name="currentPhone"
            type="tel"
            value={formData.currentPhone}
            onChange={handleChange}
            error={errors.currentPhone}
            required
            placeholder={currentUser.phone}
          />
          <Input
            label="New Phone Number"
            name="newPhone"
            type="tel"
            value={formData.newPhone}
            onChange={handleChange}
            error={errors.newPhone}
            required
            placeholder="+243 81 234 5678"
          />

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send OTP'}
            </Button>
=======
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('changePhone.title')} size="medium">
      {!showOtp ? (
        <form onSubmit={handleSendOtp}>
          <Input label={t('changePhone.current')} name="currentPhone" type="tel" value={formData.currentPhone} onChange={handleChange} error={errors.currentPhone} required placeholder={currentUser.phone} />
          <Input label={t('changePhone.new')} name="newPhone" type="tel" value={formData.newPhone} onChange={handleChange} error={errors.newPhone} required placeholder="+243 81 234 5678" />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>{t('changePhone.cancel')}</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? t('changePhone.sending') : t('changePhone.sendOtp')}</Button>
>>>>>>> e66c1ea (Update app)
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndChange}>
<<<<<<< HEAD
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <p style={{ color: '#94a3b8', marginBottom: '8px' }}>
              OTP has been sent to:
            </p>
            <p style={{ color: '#e2e8f0', fontWeight: '600' }}>{formData.newPhone}</p>
          </div>

          <Input
            label="Enter OTP"
            name="otp"
            type="text"
            value={formData.otp}
            onChange={handleChange}
            error={errors.otp}
            required
            placeholder="Enter 6-digit code"
            maxLength={6}
          />

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button type="button" variant="secondary" onClick={() => setShowOtp(false)} disabled={isSubmitting}>
              Back
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify & Change'}
            </Button>
=======
          <div className="dashboard-card-surface" style={{ marginBottom: 20 }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{t('changePhone.otpSent')}</p>
            <p style={{ fontWeight: 600, color: 'var(--text)' }}>{formData.newPhone}</p>
          </div>
          <Input label={t('changePhone.otp')} name="otp" type="text" value={formData.otp} onChange={handleChange} error={errors.otp} required placeholder={t('changePhone.otpPlaceholder')} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={() => setShowOtp(false)} disabled={isSubmitting}>{t('changePhone.back')}</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? t('changePhone.verifying') : t('changePhone.verify')}</Button>
>>>>>>> e66c1ea (Update app)
          </div>
        </form>
      )}
    </Modal>
  )
}
