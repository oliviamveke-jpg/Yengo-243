import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
<<<<<<< HEAD
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
=======
import { listingService } from '../../services/listingService'
import { notificationService } from '../../services/notificationService'
import { useTranslation } from '../../i18n/I18nProvider'

const PROMOTION_OPTIONS = [
  { id: 'free-boost', nameKey: 'promote.freeBoost', descKey: 'promote.freeBoostDesc', price: 0, duration: 1, visibilityBoost: 1.5 },
  { id: 'premium-boost', nameKey: 'promote.premiumBoost', descKey: 'promote.premiumBoostDesc', price: 5000, duration: 7, visibilityBoost: 2.5 },
  { id: 'featured', nameKey: 'promote.featured', descKey: 'promote.featuredDesc', price: 15000, duration: 14, visibilityBoost: 3 },
  { id: 'homepage-banner', nameKey: 'promote.banner', descKey: 'promote.bannerDesc', price: 50000, duration: 30, visibilityBoost: 5 }
]

export default function PromoteListingModal({ isOpen, onClose, listing, vendor, onListingPromoted }) {
  const { t } = useTranslation()
>>>>>>> e66c1ea (Update app)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

<<<<<<< HEAD
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
=======
  const handleProceed = () => {
    if (selectedOption && selectedOption.price === 0) processPromotion()
    else setShowPayment(true)
>>>>>>> e66c1ea (Update app)
  }

  const processPromotion = async () => {
    setIsProcessing(true)
<<<<<<< HEAD

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
=======
    try {
      if (selectedOption.price > 0) await new Promise(resolve => setTimeout(resolve, 2000))
      const now = new Date()
      const expiryDate = new Date(now.getTime() + selectedOption.duration * 24 * 60 * 60 * 1000)
      const updatedListing = { ...listing, promoted: true, promotedAt: now.toISOString(), promotionExpiry: expiryDate.toISOString(), promotionType: selectedOption.id, visibilityScore: (listing.visibilityScore || 1) * selectedOption.visibilityBoost, updatedAt: new Date().toISOString() }
      listingService.updateListing(vendor.id, listing.id, updatedListing)
      notificationService.addNotification(vendor.id, { type: 'system', title: 'Listing Promoted', message: `Your listing "${listing.title}" has been promoted with ${t(selectedOption.nameKey)}.`, unread: true })
      setPaymentSuccess(true)
      setTimeout(() => { onListingPromoted(updatedListing); handleClose() }, 2000)
    } catch (error) {
      console.error('Error promoting listing:', error)
>>>>>>> e66c1ea (Update app)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
<<<<<<< HEAD
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
=======
    setSelectedOption(null); setShowPayment(false); setPaymentSuccess(false); onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('promote.title')} size="medium">
      {!showPayment && !paymentSuccess && (
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{t('promote.choosePackage')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PROMOTION_OPTIONS.map(option => (
              <div key={option.id} onClick={() => setSelectedOption(option)}
                className="dashboard-card-surface"
                style={{ cursor: 'pointer', border: selectedOption?.id === option.id ? '2px solid var(--primary)' : '1px solid var(--border)', background: selectedOption?.id === option.id ? 'var(--bg)' : 'var(--surface)', transition: 'all 150ms ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>{t(option.nameKey)}</span>
                  <span style={{ color: option.price === 0 ? '#10b981' : '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>{option.price === 0 ? t('promote.free') : `${option.price.toLocaleString()} FC`}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t(option.descKey)}</p>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('promote.duration')} {option.duration} {t('promote.days')}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button type="button" variant="secondary" onClick={handleClose}>{t('promote.cancel')}</Button>
            <Button type="button" variant="primary" onClick={handleProceed} disabled={!selectedOption}>{selectedOption?.price === 0 ? t('promote.apply') : t('promote.proceed')}</Button>
          </div>
        </div>
      )}
      {showPayment && !paymentSuccess && (
        <div>
          <div className="dashboard-card-surface" style={{ marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 12px', color: 'var(--text)' }}>{t('promote.paymentSummary')}</h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8 }}>
              <p><strong>{t('promote.promotion')}</strong> {t(selectedOption.nameKey)}</p>
              <p><strong>{t('promote.duration')}</strong> {selectedOption.duration} {t('promote.days')}</p>
              <p><strong>{t('promote.visibility')}</strong> {selectedOption.visibilityBoost}x</p>
              <p style={{ marginTop: 12, fontSize: '1.1rem', color: '#f59e0b' }}><strong>{t('promote.total')} {selectedOption.price.toLocaleString()} FC</strong></p>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 12, fontSize: '0.9rem' }}>{t('promote.selectMethod')}</p>
            <div style={{ display: 'flex', gap: 12 }}><Button type="button" variant="secondary" fullWidth>{t('sub.mobileMoney')}</Button><Button type="button" variant="secondary" fullWidth>{t('sub.creditCard')}</Button><Button type="button" variant="secondary" fullWidth>{t('sub.bankTransfer')}</Button></div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowPayment(false)} disabled={isProcessing}>{t('promote.back')}</Button>
            <Button type="button" variant="success" onClick={processPromotion} disabled={isProcessing}>{isProcessing ? t('sub.processing') : t('promote.confirm')}</Button>
          </div>
        </div>
      )}
      {paymentSuccess && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
          <h3 style={{ color: '#10b981', marginBottom: 12 }}>{t('promote.success')}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{t('promote.successMsg')} {t(selectedOption.nameKey)}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('promote.redirecting')}</p>
>>>>>>> e66c1ea (Update app)
        </div>
      )}
    </Modal>
  )
}
