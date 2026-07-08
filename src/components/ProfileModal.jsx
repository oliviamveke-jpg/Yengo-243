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
import { useTranslation } from '../i18n/I18nProvider'
import {
  getProvinces,
  getCommunes,
  getQuartiers,
  addQuartier,
  findOrCreateRue,
  normalizeWhatsAppNumber,
  validateWhatsAppNumber,
  getProvinceById,
  getCommuneById,
  getQuartierById
} from '../services/locationService'
import LocationSection from './location/LocationSection'
import { getAllCategoryConfigs } from '../data/categoryConfig'

/**
 * ProfileModal — Single unified profile implementation.
 *
 * Works for both buyers and vendors:
 * - Buyer sees: Personal Information + Contact
 * - Vendor sees: Personal Information + Contact + Location + Business + Social Media
 *
 * Uses locationService for ID-based cascading selects (Province → Commune → Quartier → Rue)
 * with Add Quartier and Rue auto-create, matching the AuthModal pattern.
 */
export default function ProfileModal({ isOpen, onClose, vendor, currentUser, onProfileUpdate }) {
  const { t } = useTranslation()
  // ─── Form state ───
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    provinceId: '',
    communeId: '',
    quartierId: '',
    rueName: '',
    latitude: 0,
    longitude: 0,
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

  // Add Quartier state
  const [showAddQuartier, setShowAddQuartier] = useState(false)
  const [newQuartierName, setNewQuartierName] = useState('')
  const [addQuartierLoading, setAddQuartierLoading] = useState(false)

  // Loading states for cascading selects
  const [loadingCommunes, setLoadingCommunes] = useState(false)
  const [loadingQuartiers, setLoadingQuartiers] = useState(false)

  // Location options (ID-based)
  const provinces = getProvinces().map(p => ({ value: p.id, label: p.name }))
  const communes = formData.provinceId ? getCommunes(formData.provinceId).map(c => ({ value: c.id, label: c.name })) : []
  const quartiers = formData.communeId ? getQuartiers(formData.communeId).map(q => ({ value: q.id, label: q.name })) : []

  // Categories
  const categories = getAllCategoryConfigs(true).map(c => ({ value: c.label, label: c.label }))

  // Determine if user is a vendor
  const isVendor = currentUser?.role === 'vendor' && vendor

  // ─── Resolve vendor's string-based location to IDs on init ───
  function resolveLocationToIds(v) {
    if (!v) return { provinceId: '', communeId: '', quartierId: '', rueName: '' }
    // If already have IDs, use them
    if (v.provinceId) {
      return {
        provinceId: v.provinceId || '',
        communeId: v.communeId || '',
        quartierId: v.quartierId || '',
        rueName: v.rue || v.street || ''
      }
    }
    // Fallback: resolve string names to IDs
    const provincesList = getProvinces()
    const province = provincesList.find(p => p.name === v.province)
    const provinceId = province?.id || ''
    let communeId = ''
    let quartierId = ''
    if (provinceId && v.commune) {
      const communesList = getCommunes(provinceId)
      const commune = communesList.find(c => c.name === v.commune)
      communeId = commune?.id || ''
      if (communeId && v.quartier) {
        const quartiersList = getQuartiers(communeId)
        const quartier = quartiersList.find(q => q.name === v.quartier)
        quartierId = quartier?.id || ''
      }
    }
    return {
      provinceId,
      communeId,
      quartierId,
      rueName: v.rue || v.street || ''
    }
  }

  // ─── Init form from user/vendor data ───
  useEffect(() => {
    if (isOpen) {
      const resolved = resolveLocationToIds(vendor)
      // Extract existing coords from vendor
      const existingLat = vendor?.latitude || (vendor?.coords ? vendor.coords[0] : 0)
      const existingLng = vendor?.longitude || (vendor?.coords ? vendor.coords[1] : 0)
      setFormData({
        fullName: currentUser?.fullName || '',
        email: currentUser?.email || '',
        phoneNumber: currentUser?.phone || '',
        whatsappNumber: vendor?.whatsappNumber || currentUser?.phone || '',
        provinceId: resolved.provinceId,
        communeId: resolved.communeId,
        quartierId: resolved.quartierId,
        rueName: resolved.rueName,
        latitude: existingLat || 0,
        longitude: existingLng || 0,
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
      setShowAddQuartier(false)
      setNewQuartierName('')
    }
  }, [vendor, currentUser, isOpen])

  // ─── Simulate loading states for cascading selects ───
  useEffect(() => {
    if (formData.provinceId) {
      setLoadingCommunes(true)
      const timer = setTimeout(() => setLoadingCommunes(false), 150)
      return () => clearTimeout(timer)
    }
  }, [formData.provinceId])

  useEffect(() => {
    if (formData.communeId) {
      setLoadingQuartiers(true)
      const timer = setTimeout(() => setLoadingQuartiers(false), 150)
      return () => clearTimeout(timer)
    }
  }, [formData.communeId])

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
      if (name === 'provinceId') { next.communeId = ''; next.quartierId = '' }
      if (name === 'communeId') { next.quartierId = '' }
      return next
    })
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // ─── Add Quartier handler ───
  function handleAddQuartier() {
    if (!newQuartierName.trim()) return
    setAddQuartierLoading(true)
    try {
      const result = addQuartier(formData.communeId, newQuartierName.trim())
      setFormData(prev => ({ ...prev, quartierId: result.id }))
      setShowAddQuartier(false)
      setNewQuartierName('')
      showToast('success', t('auth.quartierAdded', { name: result.name }))
    } catch (err) {
      setErrors(prev => ({ ...prev, quartierId: err.message }))
    } finally {
      setAddQuartierLoading(false)
    }
  }

  // ─── Validation ───
  const validate = () => {
    const newErrors = {}
    if (!validateRequired(formData.fullName)) newErrors.fullName = t('profileModal.fullNameRequired')
    if (!validateEmail(formData.email)) newErrors.email = t('profileModal.emailInvalid')
    if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) newErrors.phoneNumber = t('profileModal.phoneInvalid')
    if (formData.whatsappNumber && !validateWhatsAppNumber(formData.whatsappNumber)) newErrors.whatsappNumber = t('auth.whatsappInvalid')

    if (isVendor) {
      if (!validateRequired(formData.businessName)) newErrors.businessName = t('profileModal.businessRequired')
      if (!validateRequired(formData.provinceId)) newErrors.provinceId = t('profileModal.provinceRequired')
      if (!validateRequired(formData.communeId)) newErrors.communeId = t('profileModal.communeRequired')
      if (formData.whatsappNumber && !validateWhatsAppNumber(formData.whatsappNumber)) newErrors.whatsappNumber = t('auth.whatsappInvalid')
      // Validate coordinates
      const lat = parseFloat(formData.latitude)
      const lng = parseFloat(formData.longitude)
      if (!lat || !lng || isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        newErrors.coords = t('auth.selectLocation', 'Please select your exact business location on the map.')
      }
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

  // ─── Submit handler ───
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      // Handle Rue: check if exists, create if not
      let rueId = vendor?.rueId || ''
      if (isVendor && formData.quartierId && formData.rueName.trim()) {
        const rueResult = findOrCreateRue(formData.quartierId, formData.rueName.trim())
        rueId = rueResult.id
      }

      // Normalize WhatsApp
      let normalizedWhatsApp = vendor?.whatsappNumber || ''
      if (formData.whatsappNumber) {
        normalizedWhatsApp = normalizeWhatsAppNumber(formData.whatsappNumber) || formData.whatsappNumber
      }

      // Resolve location names from IDs
      const provinceName = formData.provinceId ? (getProvinceById(formData.provinceId)?.name || '') : ''
      const communeName = formData.communeId ? (getCommuneById(formData.communeId)?.name || '') : ''
      const quartierName = formData.quartierId ? (getQuartierById(formData.quartierId)?.name || '') : ''

      // Extract and normalize coordinates
      const newLat = parseFloat(formData.latitude) || vendor?.latitude || (vendor?.coords ? vendor.coords[0] : 0)
      const newLng = parseFloat(formData.longitude) || vendor?.longitude || (vendor?.coords ? vendor.coords[1] : 0)
      const coordsChanged = vendor && (
        parseFloat(vendor.latitude || (vendor.coords ? vendor.coords[0] : 0)) !== newLat ||
        parseFloat(vendor.longitude || (vendor.coords ? vendor.coords[1] : 0)) !== newLng
      )

      // Build updated vendor object — include coordinates for real-time marker relocation
      const updatedVendor = vendor ? {
        ...vendor,
        name: formData.businessName || vendor.name,
        category: formData.category || vendor.category,
        province: provinceName || vendor.province,
        commune: communeName || vendor.commune,
        quartier: quartierName || vendor.quartier,
        rue: formData.rueName || vendor.rue,
        provinceId: formData.provinceId || vendor.provinceId,
        communeId: formData.communeId || vendor.communeId,
        quartierId: formData.quartierId || vendor.quartierId,
        rueId: rueId || vendor.rueId,
        latitude: newLat,
        longitude: newLng,
        coords: [newLat, newLng],
        description: formData.businessDescription || vendor.description,
        whatsappNumber: normalizedWhatsApp,
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

      // Build updated user object
      const updatedUser = {
        ...currentUser,
        fullName: formData.fullName.trim(),
        email: formData.email,
        phone: formData.phoneNumber
      }

      // Save via existing services
      if (updatedVendor && isVendor) {
        listingService.updateVendorProfile(vendor.id, updatedVendor)
      }
      const savedUser = userService.updateUser(currentUser.id, updatedUser) || updatedUser
      userService.setCurrentUser(savedUser)

      // Notify parent — triggers MapView marker rebuild for instant relocation
      if (onProfileUpdate) {
        onProfileUpdate(updatedVendor, savedUser)
      }

      // Show appropriate success toast
      if (coordsChanged) {
        showToast('success', '📍 ' + t('profileModal.locationUpdated', 'Business location updated successfully'))
      } else {
        showToast('success', t('profileModal.success'))
      }
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
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[\s\-]/g, '')
                    handleChange({ target: { name: 'whatsappNumber', value: cleaned } })
                  }}
                  error={errors.whatsappNumber}
                  placeholder="+243 81 234 5678"
                />
              </div>
            </section>

            {/* Location (vendor only) — Precise Location Selection with Map */}
            {isVendor && (
              <section className="profile-modal-section">
                <h3 className="profile-modal-section-title">
                  <MapPin size={16} />
                  {t('profileModal.location')}
                </h3>
                <p className="profile-modal-section-desc">
                  {t('profileModal.locationDesc')}
                </p>
                <LocationSection
                  provinceId={formData.provinceId}
                  communeId={formData.communeId}
                  quartierId={formData.quartierId}
                  rueName={formData.rueName}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  errors={errors}
                  onChange={(field, value) => {
                    setFormData(prev => {
                      const next = { ...prev, [field]: value }
                      if (field === 'provinceId') { next.communeId = ''; next.quartierId = '' }
                      if (field === 'communeId') { next.quartierId = '' }
                      return next
                    })
                    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
                  }}
                  onCoordsChange={(lat, lng, source) => {
                    setFormData(prev => ({
                      ...prev,
                      latitude: parseFloat(Number(lat).toFixed(6)),
                      longitude: parseFloat(Number(lng).toFixed(6))
                    }))
                  }}
                  showMap={true}
                  readOnly={false}
                />
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
                    options={categories}
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
