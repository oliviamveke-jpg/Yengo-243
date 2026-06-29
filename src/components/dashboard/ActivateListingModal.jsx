import React from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { vendorStorage } from '../../utils/storage'

export default function ActivateListingModal({ isOpen, onClose, listing, vendor, onListingStatusChanged }) {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const isActivating = !listing?.status

  const handleStatusChange = async () => {
    if (!listing) return
    
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

      onListingStatusChanged(updatedListing)
      onClose()
    } catch (error) {
      console.error('Error changing listing status:', error)
      alert('Failed to change listing status. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

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
      </div>
    </Modal>
  )
}
