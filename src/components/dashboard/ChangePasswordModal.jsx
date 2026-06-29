import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { validateRequired } from '../../utils/validation'

export default function ChangePasswordModal({ isOpen, onClose, currentUser, onPasswordChanged }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!validateRequired(formData.currentPassword)) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!validateRequired(formData.newPassword)) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }

    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    try {
      // Update user password in localStorage
      const users = JSON.parse(localStorage.getItem('yengoReactUsers') || '[]')
      const userIndex = users.findIndex(u => u.id === currentUser.id)
      
      if (userIndex !== -1) {
        // In a real app, you'd verify the current password here
        users[userIndex].password = formData.newPassword
        localStorage.setItem('yengoReactUsers', JSON.stringify(users))
        
        // Update current user
        const updatedUser = { ...currentUser, password: formData.newPassword }
        localStorage.setItem('yengoReactCurrentUser', JSON.stringify(updatedUser))
        
        onPasswordChanged(updatedUser)
        onClose()
        
        alert('Password changed successfully!')
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password" size="medium">
      <form onSubmit={handleSubmit}>
        <Input
          label="Current Password"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
          required
        />
        <Input
          label="New Password"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          required
          placeholder="Minimum 6 characters"
        />
        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
