import React from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
<<<<<<< HEAD
import { vendorStorage } from '../../utils/storage'

export default function ActivateListingModal({ isOpen, onClose, listing, vendor, onListingStatusChanged }) {
=======
import { listingService } from '../../services/listingService'
import { notificationService } from '../../services/notificationService'
import { useTranslation } from '../../i18n/I18nProvider'

export default function ActivateListingModal({ isOpen, onClose, listing, vendor, onListingStatusChanged }) {
  const { t } = useTranslation()
>>>>>>> e66c1ea (Update app)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const isActivating = !listing?.status

  const handleStatusChange = async () => {
    if (!listing) return
<<<<<<< HEAD
    
    setIsProcessing(true)

    try {
      const updatedListing = {
        ...listing,
        status: isActivating,
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
          vendors[vendorIndex].products[productIndex].active = isActivating
          localStorage.setItem('yengoReactVendors', JSON.stringify(vendors))
        }
      }

      // Add notification
      vendorStorage.addNotification(vendor.id, {
        type: 'system',
        title: `Listing ${isActivating ? 'Activated' : 'Deactivated'}`,
        message: `Your listing "${listing.title}" has been ${isActivating ? 'activated' : 'deactivated'}.`,
        unread: true
      })

=======
    setIsProcessing(true)
    try {
      const updatedListing = { ...listing, status: isActivating, updatedAt: new Date().toISOString() }
      listingService.updateListing(vendor.id, listing.id, updatedListing)
      notificationService.addNotification(vendor.id, { type: 'system', title: `Listing ${isActivating ? 'Activated' : 'Deactivated'}`, message: `Your listing "${listing.title}" has been ${isActivating ? 'activated' : 'deactivated'}.`, unread: true })
>>>>>>> e66c1ea (Update app)
      onListingStatusChanged(updatedListing)
      onClose()
    } catch (error) {
      console.error('Error changing listing status:', error)
<<<<<<< HEAD
      alert('Failed to change listing status. Please try again.')
=======
>>>>>>> e66c1ea (Update app)
    } finally {
      setIsProcessing(false)
    }
  }

<<<<<<< HEAD
  if (!listing) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isActivating ? 'Activate Listing' : 'Deactivate Listing'} size="small">
      <div>
        <p style={{ color: '#e2e8f0', marginBottom: '16px', lineHeight: '1.6' }}>
          {isActivating 
            ? 'Are you sure you want to activate this listing? It will be visible in the marketplace.'
            : 'Are you sure you want to deactivate this listing? It will be hidden from the marketplace.'
          }
        </p>
        
        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#cbd5e1', margin: '0 0 8px', fontWeight: '600' }}>{listing.title}</p>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
            {listing.category} • {listing.commune}, {listing.province}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant={isActivating ? 'success' : 'danger'} 
            onClick={handleStatusChange} 
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : (isActivating ? 'Activate' : 'Deactivate')}
          </Button>
        </div>
=======
  if (!listing) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isActivating ? t('activateListing.title') : t('activateListing.deactivateTitle')} size="medium">
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {isActivating ? t('activateListing.confirmActivate') : t('activateListing.confirmDeactivate')}
      </p>
      <div className="dashboard-card-surface" style={{ marginBottom: 20 }}>
        <p style={{ fontWeight: 600, margin: '0 0 4px', color: 'var(--text)' }}>{listing.title}</p>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{listing.category} &bull; {listing.commune}, {listing.province}</p>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button type="button" variant="secondary" onClick={onClose} disabled={isProcessing}>{t('activateListing.cancel')}</Button>
        <Button type="button" variant={isActivating ? 'success' : 'danger'} onClick={handleStatusChange} disabled={isProcessing}>{isProcessing ? t('activateListing.processing') : isActivating ? t('activateListing.activate') : t('activateListing.deactivate')}</Button>
>>>>>>> e66c1ea (Update app)
      </div>
    </Modal>
  )
}
