<<<<<<< HEAD
import React, { useState } from 'react'
=======
import React, { useState, useEffect, useRef, useCallback } from 'react'
>>>>>>> e66c1ea (Update app)
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { validateRequired, validatePhone, validateUrl } from '../../utils/validation'
<<<<<<< HEAD
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

export default function AddListingWizard({ isOpen, onClose, vendor, onListingAdded }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Business Info
    businessName: vendor?.name || '',
    businessPhone: vendor?.whatsappNumber || '',
    businessEmail: '',
    
    // Step 2: Category
    category: '',
    subcategory: '',
    
    // Step 3: Location
=======
import { listingService } from '../../services/listingService'
import { subcategoryService } from '../../services/subcategoryService'
import { getProvinceOptions, getCommuneOptions, getQuartierOptions } from '../../utils/locationUtils'
import { useTranslation } from '../../i18n/I18nProvider'

const CATEGORIES = [
  { value: '', labelKey: 'addListing.selectCategory' },
  { value: 'Electronics & Technology', labelKey: 'addListing.catElectronics' },
  { value: 'Fashion & Clothing', labelKey: 'addListing.catFashion' },
  { value: 'Food & Restaurants', labelKey: 'addListing.catFood' },
  { value: 'Health & Beauty', labelKey: 'addListing.catHealth' },
  { value: 'Home & Garden', labelKey: 'addListing.catHome' },
  { value: 'Automotive', labelKey: 'addListing.catAutomotive' },
  { value: 'Education', labelKey: 'addListing.catEducation' },
  { value: 'Entertainment', labelKey: 'addListing.catEntertainment' },
  { value: 'Professional Services', labelKey: 'addListing.catProfServices' },
  { value: 'Real Estate', labelKey: 'addListing.catRealEstate' },
  { value: 'Sports & Fitness', labelKey: 'addListing.catSports' },
  { value: 'Travel & Tourism', labelKey: 'addListing.catTravel' },
  { value: 'Other', labelKey: 'addListing.catOther' }
]

const STEPS = [
  { num: 1, labelKey: 'addListing.stepBusiness' },
  { num: 2, labelKey: 'addListing.stepCategory' },
  { num: 3, labelKey: 'addListing.stepLocation' },
  { num: 4, labelKey: 'addListing.stepImages' },
  { num: 5, labelKey: 'addListing.stepDetails' },
  { num: 6, labelKey: 'addListing.stepReview' }
]

const DEFAULT_OPENING_HOURS = {
  monday: { open: '09:00', close: '18:00', closed: false },
  tuesday: { open: '09:00', close: '18:00', closed: false },
  wednesday: { open: '09:00', close: '18:00', closed: false },
  thursday: { open: '09:00', close: '18:00', closed: false },
  friday: { open: '09:00', close: '18:00', closed: false },
  saturday: { open: '09:00', close: '14:00', closed: false },
  sunday: { open: null, close: null, closed: true }
}

// ─── Subcategory Autocomplete Combobox ───
function SubcategoryAutocomplete({ category, value, onChange }) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchSuggestions = useCallback((q) => {
    if (!category || !q) {
      setSuggestions([])
      setIsNew(false)
      return
    }
    const results = subcategoryService.search(q, category)
    const existingNames = new Set(results.map(r => r.name.toLowerCase()))
    const normalizedQ = q.trim().toLowerCase()
    const shouldShowCreate = normalizedQ && !existingNames.has(normalizedQ)
    setSuggestions(results)
    setIsNew(shouldShowCreate)
  }, [category])

  const handleInputChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    onChange(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val)
      setShowDropdown(true)
    }, 150)
  }

  const handleSelect = (suggestion) => {
    setInputValue(suggestion.name)
    onChange(suggestion.name)
    setShowDropdown(false)
  }

  const handleCreateNew = () => {
    setShowDropdown(false)
  }

  const handleFocus = () => {
    if (inputValue) {
      fetchSuggestions(inputValue)
      setShowDropdown(true)
    }
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
        {t('addListing.subcategory')}
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={t('addListing.subcategoryPlaceholder')}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '2px solid var(--border)',
          borderRadius: 8,
          background: 'var(--surface)',
          color: 'var(--text)',
          fontWeight: 600,
          outline: 'none',
          fontSize: '0.85rem',
          boxSizing: 'border-box'
        }}
      />
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--surface)',
            border: '2px solid var(--border)',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {suggestions.length === 0 && !isNew && (
            <div style={{ padding: 10, color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
              {category ? t('addListing.typeToSearch') : t('addListing.selectCategoryFirst')}
            </div>
          )}
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelect(s)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: s.markerColor || '#6b7280',
                  display: 'inline-block',
                  flexShrink: 0
                }}
              />
              {s.name}
            </button>
          ))}
          {isNew && (
            <button
              type="button"
              onClick={handleCreateNew}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                borderTop: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {t('addListing.createNew')} "{inputValue}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function AddListingWizard({ isOpen, onClose, vendor, onListingAdded }) {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: vendor?.name || '',
    businessPhone: vendor?.whatsappNumber || '',
    businessEmail: '',
    category: '',
    subcategory: '',
>>>>>>> e66c1ea (Update app)
    province: vendor?.province || 'Kinshasa',
    commune: vendor?.commune || '',
    quartier: vendor?.quartier || '',
    address: vendor?.rue || '',
    latitude: '',
    longitude: '',
<<<<<<< HEAD
    
    // Step 4: Images
    images: [],
    
    // Step 5: Details
=======
    images: [],
>>>>>>> e66c1ea (Update app)
    title: '',
    price: '',
    description: '',
    website: '',
<<<<<<< HEAD
    
    // Step 6: Settings
    visibility: 'public',
    status: 'active',
    openingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '14:00', closed: false },
      sunday: { open: null, close: null, closed: true }
    }
  })

=======
    visibility: 'public',
    status: 'active',
    openingHours: DEFAULT_OPENING_HOURS
  })
>>>>>>> e66c1ea (Update app)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)

<<<<<<< HEAD
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
=======
  const provinceOptions = getProvinceOptions().map(p => ({ value: p, label: p }))
  const communeOptions = formData.province ? getCommuneOptions(formData.province).map(c => ({ value: c, label: c })) : []
  const quartierOptions = formData.commune ? getQuartierOptions(formData.commune).map(q => ({ value: q, label: q })) : []

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const next = { ...prev, [name]: value }
      if (name === 'province') { next.commune = ''; next.quartier = '' }
      if (name === 'commune') { next.quartier = '' }
      return next
    })
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
>>>>>>> e66c1ea (Update app)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    processFiles(files)
  }

  const handleDrag = (e) => {
<<<<<<< HEAD
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
=======
    e.preventDefault(); e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(false)
    processFiles(Array.from(e.dataTransfer.files))
>>>>>>> e66c1ea (Update app)
  }

  const processFiles = (files) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
<<<<<<< HEAD
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, { id: Date.now(), src: reader.result, file }]
          }))
        }
=======
        reader.onloadend = () => setFormData(prev => ({ ...prev, images: [...prev.images, { id: Date.now() + Math.random(), src: reader.result, file }] }))
>>>>>>> e66c1ea (Update app)
        reader.readAsDataURL(file)
      }
    })
  }

<<<<<<< HEAD
  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }))
  }

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...formData.images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  const validateStep = (currentStep) => {
    const newErrors = {}

    if (currentStep === 1) {
      if (!validateRequired(formData.businessName)) {
        newErrors.businessName = 'Business name is required'
      }
      if (!validatePhone(formData.businessPhone)) {
        newErrors.businessPhone = 'Valid phone number is required'
      }
    }

    if (currentStep === 2) {
      if (!validateRequired(formData.category)) {
        newErrors.category = 'Category is required'
      }
    }

    if (currentStep === 3) {
      if (!validateRequired(formData.province)) {
        newErrors.province = 'Province is required'
      }
      if (!validateRequired(formData.commune)) {
        newErrors.commune = 'Commune is required'
      }
      if (!validateRequired(formData.address)) {
        newErrors.address = 'Address is required'
      }
    }

    if (currentStep === 4) {
      if (formData.images.length === 0) {
        newErrors.images = 'At least one image is required'
      }
    }

    if (currentStep === 5) {
      if (!validateRequired(formData.title)) {
        newErrors.title = 'Title is required'
      }
      if (!validateRequired(formData.price)) {
        newErrors.price = 'Price is required'
      }
      if (!validateRequired(formData.description)) {
        newErrors.description = 'Description is required'
      }
      if (formData.website && !validateUrl(formData.website)) {
        newErrors.website = 'Please enter a valid URL'
      }
    }

=======
  const removeImage = (imageId) => setFormData(prev => ({ ...prev, images: prev.images.filter(img => img.id !== imageId) }))

  const validateStep = (currentStep) => {
    const newErrors = {}
    if (currentStep === 1) {
      if (!validateRequired(formData.businessName)) newErrors.businessName = t('addListing.businessNameRequired')
      if (!validatePhone(formData.businessPhone)) newErrors.businessPhone = t('addListing.phoneRequired')
    }
    if (currentStep === 2) {
      if (!validateRequired(formData.category)) newErrors.category = t('addListing.categoryRequired')
    }
    if (currentStep === 3) {
      if (!validateRequired(formData.province)) newErrors.province = t('addListing.provinceRequired')
      if (!validateRequired(formData.commune)) newErrors.commune = t('addListing.communeRequired')
      if (!validateRequired(formData.address)) newErrors.address = t('addListing.addressRequired')
    }
    if (currentStep === 4) {
      if (formData.images.length === 0) newErrors.images = t('addListing.imageRequired')
    }
    if (currentStep === 5) {
      if (!validateRequired(formData.title)) newErrors.title = t('addListing.titleRequired')
      if (!validateRequired(formData.price)) newErrors.price = t('addListing.priceRequired')
      if (!validateRequired(formData.description)) newErrors.description = t('addListing.descriptionRequired')
      if (formData.website && !validateUrl(formData.website)) newErrors.website = t('addListing.websiteInvalid')
    }
>>>>>>> e66c1ea (Update app)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

<<<<<<< HEAD
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(6)) return

    setIsSubmitting(true)

    try {
      const newListing = {
        vendorId: vendor.id,
        businessName: formData.businessName,
        category: formData.category,
        subcategory: formData.subcategory,
        province: formData.province,
        commune: formData.commune,
        quartier: formData.quartier,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        images: formData.images.map(img => img.src),
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        website: formData.website,
        phone: formData.businessPhone,
        email: formData.businessEmail,
        visibility: formData.visibility,
        status: formData.status === 'active',
        openingHours: formData.openingHours,
        rating: 0,
        viewCount: 0,
        promoted: false,
        promotedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Add to localStorage
      vendorStorage.addListing(vendor.id, newListing)

      // Update vendor's products in main storage
      const vendors = JSON.parse(localStorage.getItem('yengoReactVendors') || '[]')
      const vendorIndex = vendors.findIndex(v => v.id === vendor.id)
      if (vendorIndex !== -1) {
        if (!vendors[vendorIndex].products) {
          vendors[vendorIndex].products = []
        }
        vendors[vendorIndex].products.push({
          id: newListing.id,
          title: newListing.title,
          price: newListing.price,
          category: newListing.category,
          image: newListing.images[0],
          active: newListing.status
        })
        localStorage.setItem('yengoReactVendors', JSON.stringify(vendors))
      }

      onListingAdded(newListing)
      handleClose()
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Failed to create listing. Please try again.')
=======
  const handleNext = () => { if (validateStep(step)) setStep(prev => prev + 1) }
  const handleBack = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    if (!validateStep(6)) return
    setIsSubmitting(true)
    try {
      const newListing = {
        vendorId: vendor.id, businessName: formData.businessName, category: formData.category, subcategory: formData.subcategory,
        province: formData.province, commune: formData.commune, quartier: formData.quartier, address: formData.address,
        latitude: formData.latitude, longitude: formData.longitude, images: formData.images.map(img => img.src),
        title: formData.title, price: parseFloat(formData.price), description: formData.description, website: formData.website,
        phone: formData.businessPhone, email: formData.businessEmail, visibility: formData.visibility, status: formData.status === 'active',
        openingHours: formData.openingHours, rating: 0, viewCount: 0, promoted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      }
      const savedListing = listingService.addListing(vendor.id, newListing)
      onListingAdded(savedListing)
      handleClose()
    } catch (error) {
      console.error('Error creating listing:', error)
>>>>>>> e66c1ea (Update app)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
<<<<<<< HEAD
      businessName: vendor?.name || '',
      businessPhone: vendor?.whatsappNumber || '',
      businessEmail: '',
      category: '',
      subcategory: '',
      province: vendor?.province || 'Kinshasa',
      commune: vendor?.commune || '',
      quartier: vendor?.quartier || '',
      address: vendor?.rue || '',
      latitude: '',
      longitude: '',
      images: [],
      title: '',
      price: '',
      description: '',
      website: '',
      visibility: 'public',
      status: 'active',
      openingHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '14:00', closed: false },
        sunday: { open: null, close: null, closed: true }
      }
    })
    setErrors({})
    onClose()
=======
      businessName: vendor?.name || '', businessPhone: vendor?.whatsappNumber || '', businessEmail: '',
      category: '', subcategory: '', province: vendor?.province || 'Kinshasa', commune: vendor?.commune || '',
      quartier: vendor?.quartier || '', address: vendor?.rue || '', latitude: '', longitude: '',
      images: [], title: '', price: '', description: '', website: '', visibility: 'public', status: 'active',
      openingHours: DEFAULT_OPENING_HOURS
    })
    setErrors({}); onClose()
>>>>>>> e66c1ea (Update app)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
<<<<<<< HEAD
            <h4 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Step 1: Business Information</h4>
            <Input
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              error={errors.businessName}
              required
            />
            <Input
              label="Business Phone"
              name="businessPhone"
              type="tel"
              value={formData.businessPhone}
              onChange={handleChange}
              error={errors.businessPhone}
              required
              placeholder="+243 81 234 5678"
            />
            <Input
              label="Business Email (Optional)"
              name="businessEmail"
              type="email"
              value={formData.businessEmail}
              onChange={handleChange}
            />
          </div>
        )

      case 2:
        return (
          <div>
            <h4 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Step 2: Category</h4>
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
              label="Subcategory (Optional)"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
            />
          </div>
        )

      case 3:
        return (
          <div>
            <h4 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Step 3: Location</h4>
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
              label="Quartier (Optional)"
              name="quartier"
              value={formData.quartier}
              onChange={handleChange}
            />
            <Textarea
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
              rows={2}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <Input
                label="Latitude (Optional)"
                name="latitude"
                type="text"
                value={formData.latitude}
                onChange={handleChange}
              />
              <Input
                label="Longitude (Optional)"
                name="longitude"
                type="text"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div>
            <h4 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Step 4: Upload Images</h4>
            <div
              style={{
                border: dragActive ? '2px dashed #3b82f6' : '2px dashed #334155',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: dragActive ? '#1e3a5f' : '#0f172a'
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('imageInput').click()}
            >
              <p style={{ color: '#94a3b8', marginBottom: '8px' }}>
                Drag & drop images here or click to browse
              </p>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                Supported: JPG, PNG, WEBP (Max 5MB each)
              </p>
              <input
                id="imageInput"
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            {errors.images && (
              <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '8px' }}>{errors.images}</p>
            )}
            
            {formData.images.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <p style={{ color: '#e2e8f0', marginBottom: '12px', fontSize: '0.9rem' }}>
                  Uploaded Images ({formData.images.length}) - Drag to reorder
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                  {formData.images.map((image, index) => (
                    <div
                      key={image.id}
                      style={{ position: 'relative', aspectRatio: '1' }}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('fromIndex', index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        const fromIndex = parseInt(e.dataTransfer.getData('fromIndex'))
                        moveImage(fromIndex, index)
                      }}
                    >
                      <img
                        src={image.src}
                        alt={`Upload ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: index === 0 ? '2px solid #10b981' : '2px solid #334155'
                        }}
                      />
                      {index === 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          backgroundColor: '#10b981',
                          color: '#fff',
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}>
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        ×
                      </button>
=======
            <h4 style={{ color: 'var(--text)', marginBottom: 20 }}>{t('addListing.step1Title')}</h4>
            <Input label={t('addListing.businessName')} name="businessName" value={formData.businessName} onChange={handleChange} error={errors.businessName} required />
            <Input label={t('addListing.businessPhone')} name="businessPhone" type="tel" value={formData.businessPhone} onChange={handleChange} error={errors.businessPhone} required placeholder="+243 81 234 5678" />
            <Input label={t('addListing.businessEmail')} name="businessEmail" type="email" value={formData.businessEmail} onChange={handleChange} />
          </div>
        )
      case 2:
        return (
          <div>
            <h4 style={{ color: 'var(--text)', marginBottom: 20 }}>{t('addListing.step2Title')}</h4>
            <Select label={t('addListing.category')} name="category" value={formData.category} onChange={handleChange} options={CATEGORIES.map(c => ({ ...c, label: c.labelKey ? t(c.labelKey) : c.label }))} error={errors.category} required />
            <SubcategoryAutocomplete
              category={formData.category}
              value={formData.subcategory}
              onChange={(val) => setFormData(prev => ({ ...prev, subcategory: val }))}
            />
          </div>
        )
      case 3:
        return (
          <div>
            <h4 style={{ color: 'var(--text)', marginBottom: 20 }}>{t('addListing.step3Title')}</h4>
            <Select label={t('addListing.province')} name="province" value={formData.province} onChange={handleChange} options={provinceOptions} error={errors.province} required />
            <Select label={t('addListing.commune')} name="commune" value={formData.commune} onChange={handleChange} options={communeOptions} error={errors.commune} required />
            <Select label={t('addListing.quartier')} name="quartier" value={formData.quartier} onChange={handleChange} options={quartierOptions} />
            <Textarea label={t('addListing.address')} name="address" value={formData.address} onChange={handleChange} error={errors.address} required rows={2} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input label={t('addListing.lat')} name="latitude" type="text" value={formData.latitude} onChange={handleChange} />
              <Input label={t('addListing.lng')} name="longitude" type="text" value={formData.longitude} onChange={handleChange} />
            </div>
          </div>
        )
      case 4:
        return (
          <div>
            <h4 style={{ color: 'var(--text)', marginBottom: 20 }}>{t('addListing.step4Title')}</h4>
            <div
              className="dashboard-card-surface"
              style={{ border: dragActive ? '2px dashed var(--primary)' : '2px dashed var(--border)', padding: 40, textAlign: 'center', cursor: 'pointer', background: dragActive ? 'var(--bg)' : 'var(--surface)' }}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => document.getElementById('addImageInput').click()}
            >
              <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{t('addListing.dragDrop')}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('addListing.supportedFormats')}</p>
              <input id="addImageInput" type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>
            {errors.images && <p style={{ color: '#ef4444', marginTop: 8 }}>{errors.images}</p>}
            {formData.images.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ color: 'var(--text)', marginBottom: 12, fontSize: '0.9rem' }}>{t('addListing.uploaded')} ({formData.images.length})</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                  {formData.images.map((image, index) => (
                    <div key={image.id} style={{ position: 'relative', aspectRatio: '1' }}>
                      <img src={image.src} alt={`Upload ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: index === 0 ? '2px solid #10b981' : '1px solid var(--border)' }} />
                      {index === 0 && <span style={{ position: 'absolute', top: 4, left: 4, background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{t('addListing.cover')}</span>}
                      <button type="button" onClick={() => removeImage(image.id)} style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
>>>>>>> e66c1ea (Update app)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
<<<<<<< HEAD

      case 5:
        return (
          <div>
            <h4 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Step 5: Description & Pricing</h4>
            <Input
              label="Listing Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />
            <Input
              label="Price (FC)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              required
            />
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              required
              rows={4}
            />
            <Input
              label="Website (Optional)"
              name="website"
              value={formData.website}
              onChange={handleChange}
              error={errors.website}
              placeholder="https://yourwebsite.com"
            />
          </div>
        )

      case 6:
        return (
          <div>
            <h4 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Step 6: Review & Submit</h4>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
              <h5 style={{ color: '#e2e8f0', marginBottom: '12px' }}>Review Your Listing</h5>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <p><strong>Business:</strong> {formData.businessName}</p>
                <p><strong>Category:</strong> {formData.category}</p>
                <p><strong>Location:</strong> {formData.commune}, {formData.province}</p>
                <p><strong>Title:</strong> {formData.title}</p>
                <p><strong>Price:</strong> {formData.price} FC</p>
                <p><strong>Images:</strong> {formData.images.length} uploaded</p>
                <p><strong>Status:</strong> {formData.status === 'active' ? 'Active' : 'Inactive'}</p>
                <p><strong>Visibility:</strong> {formData.visibility}</p>
              </div>
            </div>
            
            <Select
              label="Listing Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'active', label: 'Active (Visible in marketplace)' },
                { value: 'inactive', label: 'Inactive (Hidden)' }
              ]}
            />
            
            <Select
              label="Visibility"
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              options={[
                { value: 'public', label: 'Public (Everyone can see)' },
                { value: 'private', label: 'Private (Only you can see)' }
              ]}
            />
          </div>
        )

      default:
        return null
=======
      case 5:
        return (
          <div>
            <h4 style={{ color: 'var(--text)', marginBottom: 20 }}>{t('addListing.step5Title')}</h4>
            <Input label={t('addListing.listingTitle')} name="title" value={formData.title} onChange={handleChange} error={errors.title} required />
            <Input label={t('addListing.price')} name="price" type="number" value={formData.price} onChange={handleChange} error={errors.price} required />
            <Textarea label={t('addListing.description')} name="description" value={formData.description} onChange={handleChange} error={errors.description} required rows={4} />
            <Input label={t('addListing.website')} name="website" value={formData.website} onChange={handleChange} error={errors.website} placeholder="https://" />
          </div>
        )
      case 6:
        return (
          <div>
            <h4 style={{ color: 'var(--text)', marginBottom: 20 }}>{t('addListing.step6Title')}</h4>
            <div className="dashboard-card-bg" style={{ marginBottom: 20 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                <p><strong>{t('addListing.businessName')}:</strong> {formData.businessName}</p>
                <p><strong>{t('addListing.category')}:</strong> {formData.category}</p>
                <p><strong>{t('addListing.location')}:</strong> {formData.commune}, {formData.province}</p>
                <p><strong>{t('addListing.listingTitle')}:</strong> {formData.title}</p>
                <p><strong>{t('addListing.price')}:</strong> {formData.price} FC</p>
                <p><strong>{t('addListing.images')}:</strong> {formData.images.length} {t('addListing.uploaded')}</p>
                <p><strong>{t('addListing.status')}:</strong> {formData.status === 'active' ? t('addListing.active') : t('addListing.inactive')}</p>
                <p><strong>{t('addListing.visibility')}:</strong> {formData.visibility === 'public' ? t('addListing.public') : t('addListing.private')}</p>
              </div>
            </div>
            <Select label={t('addListing.status')} name="status" value={formData.status} onChange={handleChange} options={[{ value: 'active', label: t('addListing.active') }, { value: 'inactive', label: t('addListing.inactive') }]} />
            <Select label={t('addListing.visibility')} name="visibility" value={formData.visibility} onChange={handleChange} options={[{ value: 'public', label: t('addListing.public') }, { value: 'private', label: t('addListing.private') }]} />
          </div>
        )
      default: return null
>>>>>>> e66c1ea (Update app)
    }
  }

  return (
<<<<<<< HEAD
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Listing" size="large">
      <div>
        {/* Progress Steps */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', position: 'relative' }}>
          {[1, 2, 3, 4, 5, 6].map((stepNum) => (
            <div
              key={stepNum}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                position: 'relative',
                zIndex: 1
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: step >= stepNum ? '#3b82f6' : '#334155',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}
              >
                {stepNum}
              </div>
              <span style={{ color: step >= stepNum ? '#3b82f6' : '#64748b', fontSize: '0.75rem' }}>
                {stepNum === 1 && 'Business'}
                {stepNum === 2 && 'Category'}
                {stepNum === 3 && 'Location'}
                {stepNum === 4 && 'Images'}
                {stepNum === 5 && 'Details'}
                {stepNum === 6 && 'Review'}
              </span>
            </div>
          ))}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '0',
              right: '0',
              height: '2px',
              backgroundColor: '#334155',
              zIndex: 0
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '0',
              width: `${((step - 1) / 5) * 100}%`,
              height: '2px',
              backgroundColor: '#3b82f6',
              zIndex: 0,
              transition: 'width 0.3s'
            }}
          />
        </div>

        {renderStep()}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
          >
            Back
          </Button>
          
          {step < 6 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              variant="success"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Submit Listing'}
            </Button>
          )}
        </div>
=======
    <Modal isOpen={isOpen} onClose={handleClose} title={t('addListing.title')} size="large">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, position: 'relative' }}>
        {STEPS.map(s => (
          <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: step >= s.num ? 'var(--primary)' : 'var(--border)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>{s.num}</div>
            <span style={{ color: step >= s.num ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.75rem' }}>{t(s.labelKey)}</span>
          </div>
        ))}
        <div style={{ position: 'absolute', top: 16, left: 0, right: 0, height: 2, background: 'var(--border)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 16, left: 0, width: `${((step - 1) / 5) * 100}%`, height: 2, background: 'var(--primary)', zIndex: 0, transition: 'width 0.3s' }} />
      </div>
      {renderStep()}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <Button type="button" variant="secondary" onClick={handleBack} disabled={step === 1 || isSubmitting}>{t('addListing.back')}</Button>
        {step < 6 ? (
          <Button type="button" variant="primary" onClick={handleNext} disabled={isSubmitting}>{t('addListing.next')}</Button>
        ) : (
          <Button type="button" variant="success" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? t('addListing.creating') : t('addListing.submit')}</Button>
        )}
>>>>>>> e66c1ea (Update app)
      </div>
    </Modal>
  )
}
