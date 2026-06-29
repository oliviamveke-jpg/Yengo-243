import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { validateRequired, validatePhone, validateUrl } from '../../utils/validation'
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
    province: vendor?.province || 'Kinshasa',
    commune: vendor?.commune || '',
    quartier: vendor?.quartier || '',
    address: vendor?.rue || '',
    latitude: '',
    longitude: '',
    
    // Step 4: Images
    images: [],
    
    // Step 5: Details
    title: '',
    price: '',
    description: '',
    website: '',
    
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

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    processFiles(files)
  }

  const handleDrag = (e) => {
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
  }

  const processFiles = (files) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, { id: Date.now(), src: reader.result, file }]
          }))
        }
        reader.readAsDataURL(file)
      }
    })
  }

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
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
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

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
    }
  }

  return (
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
      </div>
    </Modal>
  )
}
