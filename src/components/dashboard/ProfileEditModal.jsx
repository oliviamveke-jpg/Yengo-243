import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
<<<<<<< HEAD
import Textarea from '../ui/Textarea'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { validateEmail, validatePhone, validateRequired, validateUrl } from '../../utils/validation'
import { vendorStorage } from '../../utils/storage'

const PROVINCES = [
  { value: 'Kinshasa', label: 'Kinshasa' },
  { value: 'Bas-Uele', label: 'Bas-Uele' },
  { value: 'Équateur', label: 'Équateur' },
  { value: 'Haut-Katanga', label: 'Haut-Katanga' },
  { value: 'Haut-Lomami', label: 'Haut-Lomami' },
  { value: 'Ituri', label: 'Ituri' },
  { value: 'Kasaï', label: 'Kasaï' },
  { value: 'Kasaï-Central', label: 'Kasaï-Central' },
  { value: 'Kasaï-Oriental', label: 'Kasaï-Oriental' },
  { value: 'Kongo-Central', label: 'Kongo-Central' },
  { value: 'Kwango', label: 'Kwango' },
  { value: 'Kwilu', label: 'Kwilu' },
  { value: 'Lomami', label: 'Lomami' },
  { value: 'Lualaba', label: 'Lualaba' },
  { value: 'Mai-Ndombe', label: 'Mai-Ndombe' },
  { value: 'Maniema', label: 'Maniema' },
  { value: 'Mongala', label: 'Mongala' },
  { value: 'Nord-Kivu', label: 'Nord-Kivu' },
  { value: 'Nord-Ubangi', label: 'Nord-Ubangi' },
  { value: 'Sankuru', label: 'Sankuru' },
  { value: 'Sud-Kivu', label: 'Sud-Kivu' },
  { value: 'Sud-Ubangi', label: 'Sud-Ubangi' },
  { value: 'Tanganyika', label: 'Tanganyika' },
  { value: 'Tshopo', label: 'Tshopo' },
  { value: 'Tshuapa', label: 'Tshuapa' }
]

const CATEGORIES = [
  { value: 'Electronics & Technology', label: 'Electronics & Technology' },
  { value: 'Fashion & Clothing', label: 'Fashion & Clothing' },
  { value: 'Food & Restaurants', label: 'Food & Restaurants' },
  { value: 'Health & Beauty', label: 'Health & Beauty' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Education', label: 'Education' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Professional Services', label: 'Professional Services' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Sports & Fitness', label: 'Sports & Fitness' },
  { value: 'Travel & Tourism', label: 'Travel & Tourism' },
  { value: 'Other', label: 'Other' }
]

export default function ProfileEditModal({ isOpen, onClose, vendor, currentUser, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    category: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    province: '',
    commune: '',
    quartier: '',
    streetAddress: '',
    businessDescription: '',
    facebook: '',
    instagram: '',
    twitter: ''
  })

=======
import Button from '../ui/Button'
import { listingService } from '../../services/listingService'
import { userService } from '../../services/userService'
import { useTranslation } from '../../i18n/I18nProvider'

export default function ProfileEditModal({ isOpen, onClose, vendor, currentUser, onProfileUpdate }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    province: '',
    commune: '',
    quartier: '',
    street: '',
    email: '',
    phone: '',
    website: ''
  })
>>>>>>> e66c1ea (Update app)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
<<<<<<< HEAD
    if (vendor && isOpen) {
      setFormData({
        fullName: currentUser?.fullName || '',
        businessName: vendor.name || '',
        category: vendor.category || '',
        email: currentUser?.email || '',
        phoneNumber: currentUser?.phone || '',
        whatsappNumber: vendor.whatsappNumber || currentUser?.phone || '',
        province: vendor.province || 'Kinshasa',
        commune: vendor.commune || '',
        quartier: vendor.quartier || '',
        streetAddress: vendor.rue || '',
        businessDescription: vendor.description || '',
        facebook: vendor.socialMediaLinks?.facebook || '',
        instagram: vendor.socialMediaLinks?.instagram || '',
        twitter: vendor.socialMediaLinks?.twitter || ''
      })
      setErrors({})
    }
  }, [vendor, currentUser, isOpen])
=======
    if (vendor) {
      setFormData({
        businessName: vendor.name || '',
        category: vendor.category || '',
        description: vendor.description || '',
        province: vendor.province || '',
        commune: vendor.commune || '',
        quartier: vendor.quartier || '',
        street: vendor.rue || vendor.street || '',
        email: vendor.email || currentUser?.email || '',
        phone: vendor.phone || vendor.phoneNumber || currentUser?.phoneNumber || '',
        website: vendor.website || ''
      })
    }
  }, [vendor, currentUser])
>>>>>>> e66c1ea (Update app)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
<<<<<<< HEAD
    // Clear error for this field when user starts typing
=======
>>>>>>> e66c1ea (Update app)
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
<<<<<<< HEAD

    if (!validateRequired(formData.fullName)) {
      newErrors.fullName = 'Full name is required'
    }

    if (!validateRequired(formData.businessName)) {
      newErrors.businessName = 'Business name is required'
    }

    if (!validateRequired(formData.category)) {
      newErrors.category = 'Category is required'
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    if (!validateRequired(formData.province)) {
      newErrors.province = 'Province is required'
    }

    if (!validateRequired(formData.commune)) {
      newErrors.commune = 'Commune is required'
    }

    if (!validateRequired(formData.streetAddress)) {
      newErrors.streetAddress = 'Street address is required'
    }

    if (formData.facebook && !validateUrl(formData.facebook)) {
      newErrors.facebook = 'Please enter a valid URL'
    }

    if (formData.instagram && !validateUrl(formData.instagram)) {
      newErrors.instagram = 'Please enter a valid URL'
    }

    if (formData.twitter && !validateUrl(formData.twitter)) {
      newErrors.twitter = 'Please enter a valid URL'
    }

=======
    if (!formData.businessName.trim()) newErrors.businessName = t('profileEdit.businessName')
    if (!formData.category.trim()) newErrors.category = t('profileEdit.category')
    if (!formData.description.trim()) newErrors.description = t('profileEdit.businessDescription')
>>>>>>> e66c1ea (Update app)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
<<<<<<< HEAD
    
    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Update vendor profile in localStorage
      const updatedVendor = {
        ...vendor,
        name: formData.businessName,
        category: formData.category,
        province: formData.province,
        commune: formData.commune,
        quartier: formData.quartier,
        rue: formData.streetAddress,
        description: formData.businessDescription,
        whatsappNumber: formData.whatsappNumber,
        socialMediaLinks: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter
        }
      }

      // Update user profile
      const updatedUser = {
        ...currentUser,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber
      }

      // Save to localStorage
      vendorStorage.setProfile(vendor.id, updatedVendor)
      
      // Update vendors in main storage
      const vendors = JSON.parse(localStorage.getItem('yengoReactVendors') || '[]')
      const vendorIndex = vendors.findIndex(v => v.id === vendor.id)
      if (vendorIndex !== -1) {
        vendors[vendorIndex] = updatedVendor
        localStorage.setItem('yengoReactVendors', JSON.stringify(vendors))
      }

      // Update users in main storage
      const users = JSON.parse(localStorage.getItem('yengoReactUsers') || '[]')
      const userIndex = users.findIndex(u => u.id === currentUser.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem('yengoReactUsers', JSON.stringify(users))
      }

      // Update current user
      localStorage.setItem('yengoReactCurrentUser', JSON.stringify(updatedUser))

      // Call callback to update parent state
      onProfileUpdate(updatedVendor, updatedUser)
      
      onClose()
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
=======
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const vendorId = vendor?.id || vendor?.vendorId || currentUser?.id

      const updatedVendor = listingService.updateVendor(vendorId, {
        name: formData.businessName,
        category: formData.category,
        description: formData.description,
        province: formData.province,
        commune: formData.commune,
        quartier: formData.quartier,
        rue: formData.street,
        email: formData.email,
        phone: formData.phone,
        phoneNumber: formData.phone,
        website: formData.website
      })

      let updatedUser = null
      if (currentUser && formData.email !== currentUser.email) {
        updatedUser = userService.updateUser(currentUser.id, { email: formData.email })
      }

      if (onProfileUpdate) {
        onProfileUpdate(
          listingService.getVendor(vendorId) || updatedVendor,
          updatedUser || currentUser
        )
      }

      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
>>>>>>> e66c1ea (Update app)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
<<<<<<< HEAD
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="large">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />
          <Input
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            error={errors.businessName}
            required
          />
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={CATEGORIES}
            error={errors.category}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            required
            placeholder="+243 81 234 5678"
          />
          <Input
            label="WhatsApp Number"
            name="whatsappNumber"
            type="tel"
            value={formData.whatsappNumber}
            onChange={handleChange}
            placeholder="+243 81 234 5678"
          />
          <Select
            label="Province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            options={PROVINCES}
            error={errors.province}
            required
          />
          <Input
            label="Commune"
            name="commune"
            value={formData.commune}
            onChange={handleChange}
            error={errors.commune}
            required
          />
          <Input
            label="Quartier"
            name="quartier"
            value={formData.quartier}
            onChange={handleChange}
          />
          <Input
            label="Street Address"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            error={errors.streetAddress}
            required
          />
        </div>
        
        <Textarea
          label="Business Description"
          name="businessDescription"
          value={formData.businessDescription}
          onChange={handleChange}
          rows={4}
          placeholder="Describe your business..."
        />

        <h4 style={{ margin: '24px 0 16px', color: '#e2e8f0', fontSize: '1rem' }}>Social Media Links</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <Input
            label="Facebook"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            error={errors.facebook}
            placeholder="https://facebook.com/yourbusiness"
          />
          <Input
            label="Instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            error={errors.instagram}
            placeholder="https://instagram.com/yourbusiness"
          />
          <Input
            label="Twitter"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            error={errors.twitter}
            placeholder="https://twitter.com/yourbusiness"
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
=======
    <Modal isOpen={isOpen} onClose={onClose} title={t('profileEdit.title')} size="large">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label={t('profileEdit.businessName')} name="businessName" value={formData.businessName} onChange={handleChange} error={errors.businessName} required />
          <Input label={t('profileEdit.category')} name="category" value={formData.category} onChange={handleChange} error={errors.category} required />
        </div>
        <div style={{ marginTop: 8 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>{t('profileEdit.businessDescription')}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 8, border: errors.description ? '1px solid #ef4444' : '1px solid var(--border)',
              background: 'var(--surface)', color: 'var(--text)', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          />
          {errors.description && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.description}</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 8 }}>
          <Input label={t('profileEdit.province')} name="province" value={formData.province} onChange={handleChange} />
          <Input label={t('profileEdit.commune')} name="commune" value={formData.commune} onChange={handleChange} />
          <Input label={t('profileEdit.quartier')} name="quartier" value={formData.quartier} onChange={handleChange} />
        </div>
        <Input label={t('profileEdit.street')} name="street" value={formData.street} onChange={handleChange} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
          <Input label={t('profileEdit.email')} name="email" type="email" value={formData.email} onChange={handleChange} />
          <Input label={t('profileEdit.phone')} name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        </div>
        <Input label={t('profileEdit.website')} name="website" type="url" value={formData.website} onChange={handleChange} placeholder={t('addListing.website')} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>{t('profileEdit.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? t('profileEdit.saving') : t('profileEdit.save')}</Button>
>>>>>>> e66c1ea (Update app)
        </div>
      </form>
    </Modal>
  )
}
