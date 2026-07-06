import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { validateUrl } from '../../utils/validation'
<<<<<<< HEAD
import { vendorStorage } from '../../utils/storage'

const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourbusiness' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourbusiness' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/243812345678' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourbusiness' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourbusiness' },
  { key: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' }
]

export default function SocialMediaModal({ isOpen, onClose, vendor, onSocialMediaUpdated }) {
=======
import { listingService } from '../../services/listingService'
import { useTranslation } from '../../i18n/I18nProvider'

const SOCIAL_PLATFORMS = [
  { key: 'facebook', labelKey: 'socialMedia.facebook', placeholderKey: 'socialMedia.facebookPlaceholder' },
  { key: 'instagram', labelKey: 'socialMedia.instagram', placeholderKey: 'socialMedia.instagramPlaceholder' },
  { key: 'whatsapp', labelKey: 'socialMedia.whatsapp', placeholderKey: 'socialMedia.whatsappPlaceholder' },
  { key: 'tiktok', labelKey: 'socialMedia.tiktok', placeholderKey: 'socialMedia.tiktokPlaceholder' },
  { key: 'linkedin', labelKey: 'socialMedia.linkedin', placeholderKey: 'socialMedia.linkedinPlaceholder' },
  { key: 'website', labelKey: 'socialMedia.website', placeholderKey: 'socialMedia.websitePlaceholder' }
]

export default function SocialMediaModal({ isOpen, onClose, vendor, onSocialMediaUpdated }) {
  const { t } = useTranslation()
>>>>>>> e66c1ea (Update app)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (vendor && isOpen) {
<<<<<<< HEAD
      const settings = vendorStorage.getSettings(vendor.id)
      setFormData(settings.socialMedia || {
        facebook: vendor.socialMediaLinks?.facebook || '',
        instagram: vendor.socialMediaLinks?.instagram || '',
        whatsapp: vendor.whatsappNumber || '',
        tiktok: '',
        linkedin: '',
        website: ''
      })
=======
      const settings = listingService.getSettings(vendor.id)
      setFormData(settings.socialMedia || { facebook: '', instagram: '', whatsapp: '', tiktok: '', linkedin: '', website: '' })
>>>>>>> e66c1ea (Update app)
      setErrors({})
    }
  }, [vendor, isOpen])

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

    SOCIAL_PLATFORMS.forEach(platform => {
      const value = formData[platform.key]
      if (value && !validateUrl(value)) {
        newErrors[platform.key] = `Please enter a valid ${platform.label} URL`
      }
    })

=======
    SOCIAL_PLATFORMS.forEach(platform => {
      const value = formData[platform.key]
      if (value && !validateUrl(value)) newErrors[platform.key] = t('socialMedia.urlInvalid')
    })
>>>>>>> e66c1ea (Update app)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
<<<<<<< HEAD

    if (!validate()) return

    setIsSubmitting(true)

    try {
      // Update settings
      const settings = vendorStorage.getSettings(vendor.id)
      settings.socialMedia = formData
      vendorStorage.setSettings(vendor.id, settings)

      // Update vendor social media links
      const updatedVendor = {
        ...vendor,
        socialMediaLinks: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter
        },
        whatsappNumber: formData.whatsapp
      }

      const vendors = JSON.parse(localStorage.getItem('yengoReactVendors') || '[]')
      const vendorIndex = vendors.findIndex(v => v.id === vendor.id)
      if (vendorIndex !== -1) {
        vendors[vendorIndex] = updatedVendor
        localStorage.setItem('yengoReactVendors', JSON.stringify(vendors))
      }

      onSocialMediaUpdated(formData, updatedVendor)
      handleClose()
      alert('Social media links updated successfully!')
    } catch (error) {
      console.error('Error updating social media:', error)
      alert('Failed to update social media links. Please try again.')
=======
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const settings = listingService.getSettings(vendor.id)
      settings.socialMedia = formData
      listingService.setSettings(vendor.id, settings)
      const updatedVendor = { ...vendor, socialMediaLinks: { facebook: formData.facebook, instagram: formData.instagram }, whatsappNumber: formData.whatsapp }
      listingService.updateVendor(vendor.id, updatedVendor)
      onSocialMediaUpdated(formData, updatedVendor)
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
    setFormData({})
    setErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Social Media Links" size="large">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {SOCIAL_PLATFORMS.map(platform => (
            <Input
              key={platform.key}
              label={platform.label}
              name={platform.key}
              type="url"
              value={formData[platform.key] || ''}
              onChange={handleChange}
              error={errors[platform.key]}
              placeholder={platform.placeholder}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Links'}
          </Button>
=======
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('socialMedia.title')} size="large">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {SOCIAL_PLATFORMS.map(platform => (
            <Input key={platform.key} label={t(platform.labelKey)} name={platform.key} type="url" value={formData[platform.key] || ''} onChange={handleChange} error={errors[platform.key]} placeholder={t(platform.placeholderKey)} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>{t('socialMedia.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? t('socialMedia.saving') : t('socialMedia.save')}</Button>
>>>>>>> e66c1ea (Update app)
        </div>
      </form>
    </Modal>
  )
}
