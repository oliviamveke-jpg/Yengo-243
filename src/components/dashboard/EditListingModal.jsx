import React, { useState, useEffect } from 'react'
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

export default function EditListingModal({ isOpen, onClose, listing, vendor, onListingUpdated }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    price: '',
    description: '',
    province: '',
    commune: '',
    quartier: '',
    address: '',
    phone: '',
    whatsapp: '',
    website: '',
    visibility: 'public',
    status: 'active',
    images: []
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (listing && isOpen) {
      setFormData({
        title: listing.title || '',
        category: listing.category || '',
        subcategory: listing.subcategory || '',
        price: listing.price || '',
        description: listing.description || '',
        province: listing.province || 'Kinshasa',
        commune: listing.commune || '',
        quartier: listing.quartier || '',
        address: listing.address || '',
        phone: listing.phone || '',
        whatsapp: listing.whatsapp || '',
        website: listing.website || '',
        visibility: listing.visibility || 'public',
        status: listing.status ? 'active' : 'inactive',
        images: listing.images || []
      })
      setErrors({})
    }
  }, [listing, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!validateRequired(formData.title)) {
      newErrors.title = 'Title is required'
    }

    if (!validateRequired(formData.price)) {
      newErrors.price = 'Price is required'
    }

    if (!validateRequired(formData.category)) {
      newErrors.category = 'Category is required'
    }

    if (!validateRequired(formData.description)) {
      newErrors.description = 'Description is required'
    }

    if (!validateRequired(formData.province)) {
      newErrors.province = 'Province is required'
    }

    if (!validateRequired(formData.commune)) {
      newErrors.commune = 'Commune is required'
    }

    if (!validateRequired(formData.address)) {
      newErrors.address = 'Address is required'
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const updatedListing = {
        ...listing,
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price),
        description: formData.description,
        province: formData.province,
        commune: formData.commune,
        quartier: formData.quartier,
        address: formData.address,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        website: formData.website,
        visibility: formData.visibility,
        status: formData.status === 'active',
        images: formData.images,
        updatedAt: new Date().toISOString()
      }

      // Update in localStorage
      vendorStorage.updateListing(vendor.id, listing.id, updatedListing)

      // Update vendor's products in main storage
      const vendors = JSON.parse(localStorage.getItem('yengoReactVendors') || '[]')
      const vendorIndex = vendors.findIndex(v => v.id === vendor.id)
      if (vendorIndex !== -1 && vendors[vendorIndex].products) {
        const productIndex = vendors[vendorIndex].products.findIndex(p => p.id === listing.id)
        if (productIndex !== -1) {
          vendors[vendorIndex].products[productIndex] = {
            ...vendors[vendorIndex].products[productIndex],
            title: updatedListing.title,
            price: updatedListing.price,
            category: updatedListing.category,
            image: updatedListing.images[0],
            active: updatedListing.status
          }
          localStorage.setItem('yengoReactVendors', JSON.stringify(vendors))
        }
      }

      onListingUpdated(updatedListing)
      onClose()
    } catch (error) {
      console.error('Error updating listing:', error)
      alert('Failed to update listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Listing" size="large">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <Input
            label="Title"
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
          <Input
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+243 81 234 5678"
          />
          <Input
            label="WhatsApp Number (Optional)"
            name="whatsapp"
            type="tel"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="+243 81 234 5678"
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

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          required
          rows={4}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
          <Select
            label="Visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            options={[
              { value: 'public', label: 'Public' },
              { value: 'private', label: 'Private' }
            ]}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
