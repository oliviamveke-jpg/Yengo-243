import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { vendorStorage } from '../../utils/storage'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    duration: null,
    benefits: ['10 Listings', 'Standard Visibility', 'Basic Analytics', 'Email Support']
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 15000,
    duration: 30,
    benefits: ['Unlimited Listings', 'Priority Visibility', 'Advanced Analytics', '24/7 Support', 'Featured Placement', 'No Commission Fees']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 45000,
    duration: 90,
    benefits: ['Everything in Premium', 'Homepage Banner', 'Dedicated Account Manager', 'API Access', 'Custom Branding']
  }
]

export default function SubscriptionModal({ isOpen, onClose, vendor, onSubscriptionUpdated }) {
  const [currentPlan, setCurrentPlan] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  useEffect(() => {
    if (vendor && isOpen) {
      const subscription = vendorStorage.getSubscription(vendor.id)
      setCurrentPlan(subscription.plan || 'free')
    }
  }, [vendor, isOpen])

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId)
  }

  const handleProceed = () => {
    if (selectedPlan === currentPlan) {
      alert('You are already on this plan')
      return
    }
    if (selectedPlan === 'free') {
      // Downgrading to free - no payment needed
      processSubscriptionChange()
    } else {
      setShowPayment(true)
    }
  }

  const processSubscriptionChange = async () => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      if (selectedPlan !== 'free') {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      const plan = PLANS.find(p => p.id === selectedPlan)
      const now = new Date()
      const expiryDate = plan.duration 
        ? new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000).toISOString()
        : null

      const updatedSubscription = {
        plan: selectedPlan,
        startDate: now.toISOString(),
        expiryDate: expiryDate,
        remainingDays: plan.duration || null,
        benefits: plan.benefits
      }

      vendorStorage.setSubscription(vendor.id, updatedSubscription)

      // Add payment history record
      const paymentHistory = JSON.parse(localStorage.getItem('yengoPaymentHistory') || '[]')
      paymentHistory.push({
        id: Date.now(),
        vendorId: vendor.id,
        plan: selectedPlan,
        amount: plan.price,
        date: now.toISOString(),
        status: 'completed'
      })
      localStorage.setItem('yengoPaymentHistory', JSON.stringify(paymentHistory))

      setPaymentSuccess(true)
      setCurrentPlan(selectedPlan)

      setTimeout(() => {
        onSubscriptionUpdated(updatedSubscription)
        handleClose()
      }, 2000)
    } catch (error) {
      console.error('Error updating subscription:', error)
      alert('Failed to update subscription. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRenew = async () => {
    setIsProcessing(true)

    try {
      const subscription = vendorStorage.getSubscription(vendor.id)
      const plan = PLANS.find(p => p.id === subscription.plan)
      const now = new Date()
      const currentExpiry = subscription.expiryDate ? new Date(subscription.expiryDate) : now
      const newExpiry = new Date(currentExpiry.getTime() + plan.duration * 24 * 60 * 60 * 1000)

      const updatedSubscription = {
        ...subscription,
        expiryDate: newExpiry.toISOString(),
        remainingDays: plan.duration
      }

      vendorStorage.setSubscription(vendor.id, updatedSubscription)

      // Add payment history record
      const paymentHistory = JSON.parse(localStorage.getItem('yengoPaymentHistory') || '[]')
      paymentHistory.push({
        id: Date.now(),
        vendorId: vendor.id,
        plan: subscription.plan,
        amount: plan.price,
        date: now.toISOString(),
        status: 'completed',
        type: 'renewal'
      })
      localStorage.setItem('yengoPaymentHistory', JSON.stringify(paymentHistory))

      onSubscriptionUpdated(updatedSubscription)
      handleClose()
      alert('Subscription renewed successfully!')
    } catch (error) {
      console.error('Error renewing subscription:', error)
      alert('Failed to renew subscription. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = async () => {
    setIsProcessing(true)

    try {
      const subscription = vendorStorage.getSubscription(vendor.id)
      subscription.cancelledAt = new Date().toISOString()
      subscription.plan = 'free'
      vendorStorage.setSubscription(vendor.id, subscription)

      onSubscriptionUpdated(subscription)
      handleClose()
      alert('Subscription cancelled. You will retain benefits until the end of your current billing period.')
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Failed to cancel subscription. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const generateInvoice = (payment) => {
    const invoiceContent = `
YENGO MARKETPLACE - INVOICE
============================
Invoice ID: INV-${payment.id}
Date: ${new Date(payment.date).toLocaleDateString()}
Vendor ID: ${vendor.id}
Vendor Name: ${vendor.name}

${payment.type === 'renewal' ? 'Subscription Renewal' : 'Subscription Plan'}: ${payment.plan.toUpperCase()}
Amount: ${payment.amount.toLocaleString()} FC
Status: ${payment.status.toUpperCase()}

Thank you for your business!
    `.trim()

    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${payment.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClose = () => {
    setSelectedPlan(null)
    setShowPayment(false)
    setPaymentSuccess(false)
    setShowHistory(false)
    setShowCancelConfirm(false)
    onClose()
  }

  const paymentHistory = JSON.parse(localStorage.getItem('yengoPaymentHistory') || '[]')
  const vendorPayments = paymentHistory.filter(p => p.vendorId === vendor.id)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Subscription Management" size="large">
      {!showHistory && !showPayment && !paymentSuccess && !showCancelConfirm && (
        <div>
          {/* Current Plan Info */}
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
            <h4 style={{ color: '#e2e8f0', margin: '0 0 12px' }}>Current Plan: {currentPlan?.toUpperCase()}</h4>
            {currentPlan !== 'free' && (
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
                {vendorStorage.getSubscription(vendor.id).expiryDate 
                  ? `Expires: ${new Date(vendorStorage.getSubscription(vendor.id).expiryDate).toLocaleDateString()}`
                  : 'No expiry date'
                }
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <Button type="button" variant="primary" onClick={() => setShowHistory(true)}>
              View Payment History
            </Button>
            {currentPlan !== 'free' && (
              <>
                <Button type="button" variant="success" onClick={handleRenew}>
                  Renew Subscription
                </Button>
                <Button type="button" variant="danger" onClick={() => setShowCancelConfirm(true)}>
                  Cancel Subscription
                </Button>
              </>
            )}
          </div>

          {/* Plan Options */}
          <h4 style={{ color: '#e2e8f0', marginBottom: '16px' }}>Upgrade or Change Plan</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {PLANS.map(plan => (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                style={{
                  padding: '20px',
                  backgroundColor: selectedPlan === plan.id ? '#1e3a5f' : '#0f172a',
                  border: selectedPlan === plan.id ? '2px solid #3b82f6' : '1px solid #334155',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedPlan !== plan.id) {
                    e.target.style.backgroundColor = '#1e293b'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPlan !== plan.id) {
                    e.target.style.backgroundColor = '#0f172a'
                  }
                }}
              >
                <h4 style={{ color: '#e2e8f0', margin: '0 0 8px' }}>{plan.name}</h4>
                <p style={{ color: plan.price === 0 ? '#10b981' : '#f59e0b', fontSize: '1.5rem', fontWeight: '700', margin: '0 0 12px' }}>
                  {plan.price === 0 ? 'FREE' : `${plan.price.toLocaleString()} FC`}
                </p>
                <p style={{ color: '#64748b', margin: '0 0 12px', fontSize: '0.9rem' }}>
                  {plan.duration ? `Every ${plan.duration} days` : 'Forever'}
                </p>
                <ul style={{ color: '#94a3b8', margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleProceed}
              disabled={!selectedPlan || selectedPlan === currentPlan}
            >
              {selectedPlan === 'free' ? 'Downgrade to Free' : 'Proceed to Payment'}
            </Button>
          </div>
        </div>
      )}

      {showHistory && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ color: '#e2e8f0', margin: 0 }}>Payment History</h4>
            <Button type="button" variant="secondary" onClick={() => setShowHistory(false)}>
              Back
            </Button>
          </div>

          {vendorPayments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {vendorPayments.map(payment => (
                <div
                  key={payment.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ color: '#e2e8f0', margin: '0 0 4px', fontWeight: '600' }}>
                      {payment.type === 'renewal' ? 'Renewal' : 'Subscription'} - {payment.plan.toUpperCase()}
                    </p>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>
                      {payment.amount.toLocaleString()} FC
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => generateInvoice(payment)}
                    >
                      Download Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              No payment history found
            </div>
          )}
        </div>
      )}

      {showPayment && (
        <div>
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <h4 style={{ color: '#e2e8f0', margin: '0 0 12px' }}>Payment Summary</h4>
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.8' }}>
              <p><strong>Plan:</strong> {selectedPlan?.toUpperCase()}</p>
              <p><strong>Duration:</strong> {PLANS.find(p => p.id === selectedPlan)?.duration} days</p>
              <p style={{ marginTop: '12px', fontSize: '1.1rem', color: '#f59e0b' }}>
                <strong>Total: {PLANS.find(p => p.id === selectedPlan)?.price.toLocaleString()} FC</strong>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '0.9rem' }}>
              Select payment method:
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button type="button" variant="secondary" fullWidth style={{ flex: 1 }}>
                Mobile Money
              </Button>
              <Button type="button" variant="secondary" fullWidth style={{ flex: 1 }}>
                Credit Card
              </Button>
              <Button type="button" variant="secondary" fullWidth style={{ flex: 1 }}>
                Bank Transfer
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowPayment(false)} disabled={isProcessing}>
              Back
            </Button>
            <Button type="button" variant="success" onClick={processSubscriptionChange} disabled={isProcessing}>
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
            Your subscription has been updated to {selectedPlan?.toUpperCase()}
          </p>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Redirecting...
          </p>
        </div>
      )}

      {showCancelConfirm && (
        <div>
          <p style={{ color: '#e2e8f0', marginBottom: '16px', lineHeight: '1.6' }}>
            Are you sure you want to cancel your subscription? You will retain your benefits until the end of your current billing period.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowCancelConfirm(false)} disabled={isProcessing}>
              Keep Subscription
            </Button>
            <Button type="button" variant="danger" onClick={handleCancel} disabled={isProcessing}>
              {isProcessing ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
