import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { vendorStorage } from '../../utils/storage'

const PROMOTION_OPTIONS = [
  {
    id: 'free-boost',
    name: 'Free Boost',
    description: 'Boost your listing for 24 hours',
    price: 0,
    duration: 1,
    visibilityBoost: 1.5
  },
  {
    id: 'premium-boost',
    name: 'Premium Boost',
    description: 'Boost your listing for 7 days with priority placement',
    price: 5000,
    duration: 7,
    visibilityBoost: 2.5
  },
  {
    id: 'featured',
    name: 'Featured Listing',
    description: 'Featured in category for 14 days',
    price: 15000,
    duration: 14,
    visibilityBoost: 3
  },
  {
    id: 'homepage-banner',
    name: 'Homepage Banner',
    description: 'Display on homepage for 30 days',
    price: 50000,
    duration: 30,
    visibilityBoost: 5
  }
]

export default function PromoteListingModal({ isOpen, onClose, listing, vendor, onListingPromoted }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleSelectOption = (option) => {
    setSelectedOption(option)
  }

  const handleProceed = () => {
    if (selectedOption && selectedOption.price === 0) {
      // Free boost - no payment needed
      processPromotion()
    } else {
      setShowPayment(true)
    }
  }

  const processPromotion = async () => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      if (selectedOption.price > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      const now = new Date()
      const expiryDate = new Date(now.getTime() + selectedOption.duration * 24 * 60 * 60 * 1000)

      const updatedListing = {
        ...listing,
        promoted: true,
        promotedAt: now.toISOString(),
        promotionExpiry: expiryDate.toISOString(),
        promotionType: selectedOption.id,
        visibilityScore: (listing.visibilityScore || 1) * selectedOption.visibilityBoost,
        updatedAt: new Date().toISOString()
      }

      // Update in localStorage
      vendorStorage.updateListing(vendor.id, listing.id, updatedListing)

      // Add notification
      vendorStorage.addNotification(vendor.id, {
        type: 'system',
        title: 'Listing Promoted',
        message: `Your listing "${listing.title}" has been promoted with ${selectedOption.name}.`,
        unread: true
      })

      setPaymentSuccess(true)
      
      setTimeout(() => {
        onListingPromoted(updatedListing)
        handleClose()
      }, 2000)
    } catch (error) {
      console.error('Error promoting listing:', error)
      alert('Failed to promote listing. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setSelectedOption(null)
    setShowPayment(false)
    setPaymentSuccess(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Promote Listing" size="medium">
      {!showPayment && !paymentSuccess && (
        <div>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            Choose a promotion package to increase your listing's visibility
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PROMOTION_OPTIONS.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option)}
                style={{
                  padding: '16px',
                  backgroundColor: selectedOption?.id === option.id ? '#1e3a5f' : '#0f172a',
                  border: selectedOption?.id === option.id ? '2px solid #3b82f6' : '1px solid #334155',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedOption?.id !== option.id) {
                    e.target.style.backgroundColor = '#1e293b'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedOption?.id !== option.id) {
                    e.target.style.backgroundColor = '#0f172a'
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '1rem' }}>
                    {option.name}
                  </span>
                  <span style={{ color: option.price === 0 ? '#10b981' : '#f59e0b', fontWeight: '700', fontSize: '1.1rem' }}>
                    {option.price === 0 ? 'FREE' : `${option.price.toLocaleString()} FC`}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
                  {option.description}
                </p>
                <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.85rem' }}>
                  Duration: {option.duration} day{option.duration > 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleProceed}
              disabled={!selectedOption}
            >
              {selectedOption?.price === 0 ? 'Apply Free Boost' : 'Proceed to Payment'}
            </Button>
          </div>
        </div>
      )}

      {showPayment && !paymentSuccess && (
        <div>
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <h4 style={{ color: '#e2e8f0', margin: '0 0 12px' }}>Payment Summary</h4>
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.8' }}>
              <p><strong>Promotion:</strong> {selectedOption.name}</p>
              <p><strong>Duration:</strong> {selectedOption.duration} day{selectedOption.duration > 1 ? 's' : ''}</p>
              <p><strong>Visibility Boost:</strong> {selectedOption.visibilityBoost}x</p>
              <p style={{ marginTop: '12px', fontSize: '1.1rem', color: '#f59e0b' }}>
                <strong>Total: {selectedOption.price.toLocaleString()} FC</strong>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '0.9rem' }}>
              Select payment method:
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                style={{ flex: 1 }}
              >
                Mobile Money
              </Button>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                style={{ flex: 1 }}
              >
                Credit Card
              </Button>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                style={{ flex: 1 }}
              >
                Bank Transfer
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowPayment(false)} disabled={isProcessing}>
              Back
            </Button>
            <Button type="button" variant="success" onClick={processPromotion} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </div>
        </div>
      )}

      {paymentSuccess && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
          <h3 style={{ color: '#10b981', marginBottom: '12px' }}>Payment Successful!</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            Your listing has been promoted with {selectedOption.name}
          </p>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Redirecting...
          </p>
        </div>
      )}
    </Modal>
  )
}
