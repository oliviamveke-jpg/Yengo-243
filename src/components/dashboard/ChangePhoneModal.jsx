import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { validatePhone, validateRequired } from '../../utils/validation'

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyAndChange = async (e) => {
    e.preventDefault()

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
    } finally {
      setIsSubmitting(false)
    }
  }

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
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndChange}>
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
          </div>
        </form>
      )}
    </Modal>
  )
}
