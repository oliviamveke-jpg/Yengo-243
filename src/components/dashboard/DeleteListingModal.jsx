import React from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
<<<<<<< HEAD
import { vendorStorage } from '../../utils/storage'

export default function DeleteListingModal({ isOpen, onClose, listing, vendor, onListingDeleted }) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!listing) return
    
    setIsDeleting(true)

    try {
      // Delete from localStorage
      vendorStorage.deleteListing(vendor.id, listing.id)

      // Remove from vendor's products in main storage
      const vendors = JSON.parse(localStorage.getItem('yengoReactVendors') || '[]')
      const vendorIndex = vendors.findIndex(v => v.id === vendor.id)
      if (vendorIndex !== -1 && vendors[vendorIndex].products) {
        vendors[vendorIndex].products = vendors[vendorIndex].products.filter(p => p.id !== listing.id)
        localStorage.setItem('yengoReactVendors', JSON.stringify(vendors))
      }

      onListingDeleted(listing.id)
      onClose()
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Failed to delete listing. Please try again.')
=======
import { listingService } from '../../services/listingService'
import { useTranslation } from '../../i18n/I18nProvider'

export default function DeleteListingModal({ isOpen, onClose, listing, onDeleted }) {
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async (e) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      listingService.deleteListing(listing.id)
      onDeleted(listing.id)
      onClose()
    } catch (error) {
      console.error('Error deleting listing:', error)
>>>>>>> e66c1ea (Update app)
    } finally {
      setIsDeleting(false)
    }
  }

<<<<<<< HEAD
  if (!listing) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Listing" size="small">
      <div>
        <p style={{ color: '#e2e8f0', marginBottom: '16px', lineHeight: '1.6' }}>
          Are you sure you want to delete this listing?
        </p>
        
        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#cbd5e1', margin: '0 0 8px', fontWeight: '600' }}>{listing.title}</p>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
            {listing.category} • {listing.commune}, {listing.province}
          </p>
        </div>

        <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '20px' }}>
          ⚠️ This action cannot be undone. The listing will be permanently removed from the marketplace.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Listing'}
          </Button>
        </div>
      </div>
=======
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('deleteListing.title')} size="medium">
      <form onSubmit={handleDelete}>
        <p style={{ color: 'var(--text)', marginBottom: 8 }}>{t('deleteListing.confirm')}</p>
        <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: 24 }}>{t('deleteListing.warning')}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>{t('deleteListing.cancel')}</Button>
          <Button type="submit" variant="danger" disabled={isDeleting}>{isDeleting ? t('deleteListing.deleting') : t('deleteListing.confirmButton')}</Button>
        </div>
      </form>
>>>>>>> e66c1ea (Update app)
    </Modal>
  )
}
