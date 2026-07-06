import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
<<<<<<< HEAD
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
=======
import Button from '../ui/Button'
import { listingService } from '../../services/listingService'
import { useTranslation } from '../../i18n/I18nProvider'

const PROVINCES = [
  { value: 'Kinshasa', label: 'Kinshasa' },
  { value: 'Lubumbashi', label: 'Lubumbashi' },
  { value: 'Mbuji-Mayi', label: 'Mbuji-Mayi' },
  { value: 'Kananga', label: 'Kananga' },
  { value: 'Kisangani', label: 'Kisangani' },
  { value: 'Goma', label: 'Goma' },
  { value: 'Bukavu', label: 'Bukavu' },
  { value: 'Tshikapa', label: 'Tshikapa' },
  { value: 'Masina', label: 'Masina' },
  { value: 'Kikwit', label: 'Kikwit' },
  { value: 'Mbandaka', label: 'Mbandaka' },
  { value: 'Matadi', label: 'Matadi' },
  { value: 'Uvira', label: 'Uvira' },
  { value: 'Boma', label: 'Boma' },
  { value: 'Likasi', label: 'Likasi' },
  { value: 'Kolwezi', label: 'Kolwezi' },
  { value: 'Kasumbalesa', label: 'Kasumbalesa' },
  { value: 'Kalemie', label: 'Kalemie' },
  { value: 'Kindu', label: 'Kindu' },
  { value: 'Isiro', label: 'Isiro' }
]

export default function EditListingModal({ isOpen, onClose, listing, listingData, onUpdated }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    subcategory: '',
>>>>>>> e66c1ea (Update app)
    province: '',
    commune: '',
    quartier: '',
    address: '',
    phone: '',
    whatsapp: '',
    website: '',
<<<<<<< HEAD
    visibility: 'public',
    status: 'active',
    images: []
  })

=======
    description: '',
    status: true,
    visibility: 'public'
  })
>>>>>>> e66c1ea (Update app)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (listing && isOpen) {
<<<<<<< HEAD
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
=======
      const data = listingData || listing
      setFormData({
        title: data.title || '',
        price: data.price || '',
        category: data.category || '',
        subcategory: data.subcategory || '',
        province: data.province || '',
        commune: data.commune || '',
        quartier: data.quartier || '',
        address: data.rue || data.street || data.address || '',
        phone: data.phone || data.phoneNumber || '',
        whatsapp: data.whatsapp || '',
        website: data.website || '',
        description: data.description || '',
        status: data.status !== false,
        visibility: data.visibility || 'public'
      })
      setErrors({})
    }
  }, [listing, listingData, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
>>>>>>> e66c1ea (Update app)
  }

  const validate = () => {
    const newErrors = {}
<<<<<<< HEAD

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

=======
    if (!formData.title.trim()) newErrors.title = t('editListing.titleRequired')
    if (!formData.price.trim()) newErrors.price = t('editListing.priceRequired')
    if (!formData.category.trim()) newErrors.category = t('editListing.categoryRequired')
    if (!formData.description.trim()) newErrors.description = t('editListing.descriptionRequired')
    if (!formData.province.trim()) newErrors.province = t('editListing.provinceRequired')
    if (!formData.commune.trim()) newErrors.commune = t('editListing.communeRequired')
    if (!formData.address.trim()) newErrors.address = t('editListing.addressRequired')
    if (formData.phone && formData.phone.length < 5) newErrors.phone = t('editListing.phoneInvalid')
    if (formData.website && !formData.website.startsWith('http')) newErrors.website = t('editListing.websiteInvalid')
>>>>>>> e66c1ea (Update app)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
<<<<<<< HEAD

    if (!validate()) return

    setIsSubmitting(true)

=======
    if (!validate()) return
    setIsSubmitting(true)
>>>>>>> e66c1ea (Update app)
    try {
      const updatedListing = {
        ...listing,
        title: formData.title,
<<<<<<< HEAD
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
=======
        price: formData.price,
        category: formData.category,
        subcategory: formData.subcategory,
        province: formData.province,
        commune: formData.commune,
        quartier: formData.quartier,
        rue: formData.address,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        website: formData.website,
        description: formData.description,
        status: formData.status,
        visibility: formData.visibility,
        updatedAt: new Date().toISOString()
      }
      const vendorId = listing.vendorId || listing.ownerId
      listingService.updateListing(vendorId, listing.id, updatedListing)
      if (onUpdated) onUpdated(updatedListing)
      onClose()
    } catch (error) {
      console.error('Error updating listing:', error)
>>>>>>> e66c1ea (Update app)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
<<<<<<< HEAD
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
=======
    <Modal isOpen={isOpen} onClose={onClose} title={t('editListing.title')} size="large">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label={t('editListing.titleLabel')} name="title" value={formData.title} onChange={handleChange} error={errors.title} required />
          <Input label={t('editListing.priceLabel')} name="price" type="number" value={formData.price} onChange={handleChange} error={errors.price} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
          <Input label={t('editListing.categoryLabel')} name="category" value={formData.category} onChange={handleChange} error={errors.category} required />
          <Input label={t('editListing.subcategoryLabel')} name="subcategory" value={formData.subcategory} onChange={handleChange} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 8 }}>
          <select name="province" value={formData.province} onChange={handleChange} className="form-select" style={{ border: errors.province ? '1px solid #ef4444' : '1px solid var(--border)' }}>
            <option value="">{t('filter.allProvinces')}</option>
            {PROVINCES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <Input label={t('editListing.communeLabel')} name="commune" value={formData.commune} onChange={handleChange} error={errors.commune} required />
          <Input label={t('editListing.quartierLabel')} name="quartier" value={formData.quartier} onChange={handleChange} />
        </div>
        <Input label={t('editListing.addressLabel')} name="address" value={formData.address} onChange={handleChange} error={errors.address} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 8 }}>
          <Input label={t('editListing.phoneLabel')} name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} />
          <Input label={t('editListing.whatsappLabel')} name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange} />
          <Input label={t('editListing.websiteLabel')} name="website" type="url" value={formData.website} onChange={handleChange} error={errors.website} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>{t('editListing.descriptionLabel')}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 8,
              border: errors.description ? '1px solid #ef4444' : '1px solid var(--border)',
              background: 'var(--surface)', color: 'var(--text)', fontSize: '0.9rem',
              resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          />
          {errors.description && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.description}</span>}
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginTop: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{formData.status ? t('editListing.activeOption') : t('editListing.inactiveOption')}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{t('editListing.visibilityLabel')}:</span>
            <select name="visibility" value={formData.visibility} onChange={handleChange} className="form-select" style={{ width: 'auto' }}>
              <option value="public">{t('editListing.publicOption')}</option>
              <option value="private">{t('editListing.privateOption')}</option>
            </select>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>{t('editListing.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? t('editListing.saving') : t('editListing.save')}</Button>
>>>>>>> e66c1ea (Update app)
        </div>
      </form>
    </Modal>
  )
}
