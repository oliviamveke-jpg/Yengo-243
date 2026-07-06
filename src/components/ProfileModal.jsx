import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, User, Mail, Phone, MessageCircle, MapPin, Briefcase, Globe, ExternalLink, Save, CheckCircle, AlertCircle, Share2, Link, Music } from 'lucide-react'
import Modal from './ui/Modal'
import Input from './ui/Input'
import Textarea from './ui/Textarea'
import Select from './ui/Select'
import Button from './ui/Button'
import ProfilePhotoModal from './dashboard/ProfilePhotoModal'
import { validateEmail, validatePhone, validateRequired, validateUrl, validateImageFile } from '../utils/validation'
import { listingService } from '../services/listingService'
import { userService } from '../services/userService'
import { getProvinceOptions, getCommuneOptions, getQuartierOptions, assignLocationId } from '../utils/locationUtils'
import { useTranslation } from '../i18n/I18nProvider'

const CATEGORIES = [
  { value: '', label: '' },
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

/**
 * ProfileModal — Single unified profile implementation.
 *
 * Works for both buyers and vendors:
 * - Buyer sees: Personal Information + Contact
 * - Vendor sees: Personal Information + Contact + Location + Business + Social Media
 *
 * Reuses the backend from ProfileEditModal (listingService + userService).
 * Syncs location fields to the vendor document so the map reflects changes.
 */
export default function ProfileModal({ isOpen, onClose, vendor, currentUser, onProfileUpdate }) {
  const { t } = useTranslation()
  // ─── Form state ───
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    province: '',
    commune: '',
    quartier: '',
    streetAddress: '',
    businessName: '',
    category: '',
    businessDescription: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    tiktok: '',
    website: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  // Photo modal
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  // Location options
  const provinceOptions = getProvinceOptions().map(p => ({ value: p, label: p }))
  const communeOptions = formData.province ? getCommuneOptions(formData.province).map(c => ({ value: c, label: c })) : []
  const quartierOptions = formData.commune ? getQuartierOptions(formData.commune).map(q => ({ value: q, label: q })) : []

  // Determine if user is a vendor
  const isVendor = currentUser?.role === 'vendor' && vendor

  // ─── Init form from user/vendor data ───
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: currentUser?.fullName || '',
        email: currentUser?.email || '',
        phoneNumber: currentUser?.phone || '',
        whatsappNumber: vendor?.whatsappNumber || currentUser?.phone || '',
        province: vendor?.province || '',
        commune: vendor?.commune || '',
        quartier: vendor?.quartier || '',
        streetAddress: vendor?.rue || vendor?.street || '',
        businessName: vendor?.name || '',
        category: vendor?.category || '',
        businessDescription: vendor?.description || '',
        facebook: vendor?.socialMediaLinks?.facebook || '',
        instagram: vendor?.socialMediaLinks?.instagram || '',
        twitter: vendor?.socialMediaLinks?.twitter || '',
        linkedin: vendor?.socialMediaLinks?.linkedin || '',
        tiktok: vendor?.socialMediaLinks?.tiktok || '',
        website: vendor?.socialMediaLinks?.website || ''
      })
      setErrors({})
      setToast(null)
    }
  }, [vendor, currentUser, isOpen])

  // ─── Toast helper ───
  const showToast = useCallback((type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // ─── Change handler ───
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const next = { ...prev, [name]: value }
      // Reset downstream location fields when parent changes
      if (name === 'province') { next.commune = ''; next.quartier = '' }
      if (name === 'commune') { next.quartier = '' }
      return next
    })
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // ─── Validation ───
  const validate = () => {
    const newErrors = {}
    if (!validateRequired(formData.fullName)) newErrors.fullName = t('profileModal.fullNameRequired')
    if (!validateEmail(formData.email)) newErrors.email = t('profileModal.emailInvalid')
    if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) newErrors.phoneNumber = t('profileModal.phoneInvalid')
    if (formData.whatsappNumber && !validatePhone(formData.whatsappNumber)) newErrors.whatsappNumber = t('profileModal.phoneInvalid')

    if (isVendor) {
      if (!validateRequired(formData.businessName)) newErrors.businessName = t('profileModal.businessRequired')
      if (!validateRequired(formData.province)) newErrors.province = t('profileModal.provinceRequired')
      if (!validateRequired(formData.commune)) newErrors.commune = t('profileModal.communeRequired')
    }

    // Social URLs — only validate if provided
    if (formData.facebook && !validateUrl(formData.facebook)) newErrors.facebook = t('socialMedia.urlInvalid')
    if (formData.instagram && !validateUrl(formData.instagram)) newErrors.instagram = t('socialMedia.urlInvalid')
    if (formData.twitter && !validateUrl(formData.twitter)) newErrors.twitter = t('socialMedia.urlInvalid')
    if (formData.linkedin && !validateUrl(formData.linkedin)) newErrors.linkedin = t('socialMedia.urlInvalid')
    if (formData.tiktok && !validateUrl(formData.tiktok)) newErrors.tiktok = t('socialMedia.urlInvalid')
    if (formData.website && !validateUrl(formData.website)) newErrors.website = t('socialMedia.urlInvalid')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ─── Submit handler — matches ProfileEditModal backend ───
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      // Build updated vendor object
      const updatedVendor = vendor ? {
        ...vendor,
        name: formData.businessName || vendor.name,
        category: formData.category || vendor.category,
        province: formData.province || vendor.province,
        commune: formData.commune || vendor.commune,
        quartier: formData.quartier || vendor.quartier,
        rue: formData.streetAddress || vendor.rue,
        description: formData.businessDescription || vendor.description,
        whatsappNumber: formData.whatsappNumber || vendor.whatsappNumber,
        socialMediaLinks: {
          ...vendor.socialMediaLinks,
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          tiktok: formData.tiktok,
          website: formData.website
        }
      } : null

      // Assign locationId so map can find this vendor
      if (updatedVendor) {
        assignLocationId(updatedVendor)
      }

      // Build updated user object
      const updatedUser = {
        ...currentUser,
        fullName: formData.fullName.trim(),
        email: formData.email,
        phone: formData.phoneNumber
      }

      // Save via existing services (same as ProfileEditModal)
      if (updatedVendor && isVendor) {
        listingService.updateVendorProfile(vendor.id, updatedVendor)
      }
      const savedUser = userService.updateUser(currentUser.id, updatedUser) || updatedUser
      userService.setCurrentUser(savedUser)

      // Notify parent
      if (onProfileUpdate) {
        onProfileUpdate(updatedVendor, savedUser)
      }

      showToast('success', t('profileModal.success'))
      setTimeout(() => onClose(), 800)
    } catch (error) {
      console.error('Error saving profile:', error)
      showToast('error', t('profileModal.failed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Photo update handler ───
  const handlePhotoUpdate = (updatedVendor, updatedUser) => {
    if (onProfileUpdate) {
      onProfileUpdate(
        updatedVendor || vendor,
        updatedUser || currentUser
      )
    }
    showToast('success', t('profileModal.photoSuccess'))
  }

  // ─── Compute avatar ───
  const avatarImage = currentUser?.profileImage || vendor?.profileImage || null
  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="" size="large">
        <form onSubmit={handleSubmit}>
          {/* ─── Header section ─── */}
          <div className="profile-modal-header">
            <div className="profile-modal-avatar-wrapper">
              {avatarImage ? (
                <img src={avatarImage} alt={formData.fullName} className="profile-modal-avatar" />
              ) : (
                <div className="profile-modal-avatar-placeholder">
                  {getInitials(formData.fullName || currentUser?.fullName)}
                </div>
              )}
              <button
                type="button"
                className="profile-modal-camera-btn"
                onClick={() => setShowPhotoModal(true)}
                title={t('profileModal.changePhoto')}
              >
                <Camera size={14} />
              </button>
            </div>
            <div className="profile-modal-header-info">
              <h2 className="profile-modal-name">{formData.fullName || currentUser?.fullName || 'Your Name'}</h2>
              {isVendor && formData.businessName && (
                <p className="profile-modal-secondary">{formData.businessName}</p>
              )}
              {isVendor && formData.category && (
                <span className="profile-modal-category-pill">{formData.category}</span>
              )}
              {!isVendor && (
                <p className="profile-modal-secondary">{t('profileModal.accountBuyer')}</p>
              )}
            </div>
            <div className="profile-modal-header-actions">
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowPhotoModal(true)}>
                <Camera size={14} /> {t('profileModal.changePhoto')}
              </Button>
            </div>
          </div>

          {/* ─── Sections ─── */}
          <div className="profile-modal-sections">

            {/* Personal Information */}
            <section className="profile-modal-section">
              <h3 className="profile-modal-section-title">
                <User size={16} />
                {t('profileModal.personalInfo')}
              </h3>
              <div className="profile-modal-grid">
                <Input
                  label={t('profileModal.fullNameLabel')}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                />
              </div>
            </section>

            {/* Contact */}
            <section className="profile-modal-section">
              <h3 className="profile-modal-section-title">
                <Mail size={16} />
                {t('profileModal.contact')}
              </h3>
              <div className="profile-modal-grid">
                <Input
                  label={t('profileModal.emailLabel')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                <Input
                  label={t('profileModal.phoneLabel')}
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber}
                  placeholder="+243 81 234 5678"
                />
                <Input
                  label={t('profileModal.whatsappLabel')}
                  name="whatsappNumber"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  error={errors.whatsappNumber}
                  placeholder="+243 81 234 5678"
                />
              </div>
            </section>

            {/* Location (vendor only) */}
            {isVendor && (
              <section className="profile-modal-section">
                <h3 className="profile-modal-section-title">
                  <MapPin size={16} />
                  {t('profileModal.location')}
                </h3>
                <p className="profile-modal-section-desc">
                  {t('profileModal.locationDesc')}
                </p>
                <div className="profile-modal-grid">
                  <Select
                    label={t('profileModal.provinceLabel')}
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    options={provinceOptions}
                    error={errors.province}
                    required
                  />
                  <Select
                    label={t('profileModal.communeLabel')}
                    name="commune"
                    value={formData.commune}
                    onChange={handleChange}
                    options={communeOptions}
                    error={errors.commune}
                    required
                  />
                  <Select
                    label={t('profileModal.quartierLabel')}
                    name="quartier"
                    value={formData.quartier}
                    onChange={handleChange}
                    options={quartierOptions}
                  />
                  <Input
                    label={t('profileModal.streetLabel')}
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="Avenue, number..."
                  />
                </div>
              </section>
            )}

            {/* Business Information (vendor only) */}
            {isVendor && (
              <section className="profile-modal-section">
                <h3 className="profile-modal-section-title">
                  <Briefcase size={16} />
                  {t('profileModal.businessInfo')}
                </h3>
                <div className="profile-modal-grid">
                  <Input
                    label={t('profileModal.businessNameLabel')}
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    error={errors.businessName}
                    required
                  />
                  <Select
                    label={t('profileModal.categoryLabel')}
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={CATEGORIES}
                    error={errors.category}
                  />
                </div>
                <Textarea
                  label={t('profileModal.businessDescLabel')}
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t('profileModal.descriptionPlaceholder')}
                />
              </section>
            )}

            {/* Social Media */}
            <section className="profile-modal-section">
              <h3 className="profile-modal-section-title">
                <Globe size={16} />
                {t('profileModal.socialMedia')}
              </h3>
              <p className="profile-modal-section-desc">
                {t('profileModal.socialDesc')}
              </p>
              <div className="profile-modal-grid profile-modal-grid-3">
                <Input
                  label={t('profileModal.facebookLabel')}
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  error={errors.facebook}
                  placeholder={t('profileModal.facebookPlaceholder')}
                  leftIcon={<Share2 size={14} />}
                />
                <Input
                  label={t('profileModal.instagramLabel')}
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  error={errors.instagram}
                  placeholder={t('profileModal.instagramPlaceholder')}
                  leftIcon={<Camera size={14} />}
                />
                <Input
                  label={t('profileModal.twitterLabel')}
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  error={errors.twitter}
                  placeholder={t('profileModal.twitterPlaceholder')}
                  leftIcon={<MessageCircle size={14} />}
                />
                <Input
                  label={t('profileModal.linkedinLabel')}
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  error={errors.linkedin}
                  placeholder={t('profileModal.linkedinPlaceholder')}
                  leftIcon={<Link size={14} />}
                />
                <Input
                  label={t('profileModal.tiktokLabel')}
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  error={errors.tiktok}
                  placeholder={t('profileModal.tiktokPlaceholder')}
                  leftIcon={<Music size={14} />}
                />
                <Input
                  label={t('profileModal.websiteLabel')}
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  error={errors.website}
                  placeholder={t('profileModal.websitePlaceholder')}
                  leftIcon={<ExternalLink size={14} />}
                />
              </div>
            </section>

          </div>

          {/* ─── Actions ─── */}
          <div className="profile-modal-actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              {t('profileModal.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? t('profileModal.saving') : t('profileModal.save')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── Toast ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`profile-modal-toast profile-modal-toast-${toast.type}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Photo Modal (reuses existing component) ─── */}
      <ProfilePhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        vendor={vendor}
        currentUser={currentUser}
        onPhotoUpdate={(v, u) => {
          handlePhotoUpdate(v, u)
          setShowPhotoModal(false)
        }}
      />
    </>
  )
}
