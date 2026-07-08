import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
<<<<<<< HEAD
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
=======
import { subscriptionService } from '../../services/subscriptionService'
import {
  BANK_ACCOUNTS,
  PAYMENT_METHODS,
  processBankTransferPayment,
  processMobileMoneyPayment,
  verifyBankTransferPayment
} from '../../services/paymentService'
import { useTranslation } from '../../i18n/I18nProvider'
import { validateDRCPhoneDetailed, normalizePhone } from '../../utils/phoneUtils'

const PLANS = [
  { id: 'free', nameKey: 'sub.free', price: 0, duration: null, benefitsKeys: ['dash.tenListings', 'dash.standardVisibility', 'dash.basicAnalytics', 'dash.emailSupport'] },
  { id: 'premium', nameKey: 'sub.premium', price: 15000, duration: 30, benefitsKeys: ['dash.unlimitedListings', 'dash.priorityVisibility', 'dash.advancedAnalytics', 'dash.support247', 'dash.featuredPlacement', 'dash.noCommission'] },
  { id: 'pro', nameKey: 'sub.pro', price: 45000, duration: 90, benefitsKeys: ['dash.unlimitedListings', 'dash.priorityVisibility', 'dash.advancedAnalytics', 'dash.support247', 'dash.featuredPlacement', 'dash.noCommission'] }
]

function getPaymentMethodLabel(method, details) {
  if (method === PAYMENT_METHODS.MOBILE_MONEY) {
    const labels = { orange: 'Orange Money', airtel: 'Airtel Money', mpesa: 'M-Pesa' }
    return labels[details.provider] || 'Mobile Money'
  }
  if (method === PAYMENT_METHODS.CREDIT_CARD) return 'Credit Card'
  if (method === PAYMENT_METHODS.BANK_TRANSFER) return BANK_ACCOUNTS[details.bank]?.bank || 'Bank Transfer'
  return method
}

export default function SubscriptionModal({ isOpen, onClose, vendor, onSubscriptionUpdated }) {
  const { t } = useTranslation()
>>>>>>> e66c1ea (Update app)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
<<<<<<< HEAD

  useEffect(() => {
    if (vendor && isOpen) {
      const subscription = vendorStorage.getSubscription(vendor.id)
=======
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.MOBILE_MONEY)
  const [paymentDetails, setPaymentDetails] = useState({ provider: 'mpesa', phoneNumber: '', cardNumber: '', expiryDate: '', cvv: '', cardholderName: '', bank: 'RAWBANK', accountNumber: '' })
  const [checkoutStep, setCheckoutStep] = useState('plan')
  const [paymentError, setPaymentError] = useState('')
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    if (vendor && isOpen) {
      const subscription = subscriptionService.getSubscription(vendor.id)
>>>>>>> e66c1ea (Update app)
      setCurrentPlan(subscription.plan || 'free')
    }
  }, [vendor, isOpen])

<<<<<<< HEAD
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
=======
  const updatePaymentDetail = (key, value) => {
    setPaymentDetails(prev => ({ ...prev, [key]: value }))
    setPaymentError('')
  }

  const activateSubscription = (paymentResult) => {
    const plan = PLANS.find(p => p.id === selectedPlan)
    const now = new Date()
    const paidAt = now.toISOString()
    const userId = vendor.ownerId || vendor.id
    const transactionId = paymentResult?.transaction?.id || paymentResult?.transactionId || `TX${Date.now()}`
    const paymentMethodLabel = getPaymentMethodLabel(paymentMethod, paymentDetails)
    const expiryDate = plan.duration ? new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000).toISOString() : null
    const updatedSubscription = { userId, vendorId: vendor.id, plan: selectedPlan, planName: plan.nameKey, startDate: now.toISOString(), expiryDate, remainingDays: plan.duration || null, benefits: plan.benefitsKeys, status: selectedPlan === 'free' ? 'free' : 'active', paymentTransactionId: transactionId, activatedAt: paidAt }
    const paymentRecord = { userId, vendorId: vendor.id, plan: plan.nameKey, amount: plan.price, currency: 'CDF', paymentMethod: paymentMethodLabel, status: 'successful', transactionId, paidAt, type: selectedPlan === 'free' ? 'downgrade' : 'subscription' }
    const transactionRecord = { id: transactionId, userId, vendorId: vendor.id, paymentId: transactionId, gatewayStatus: paymentResult?.status || 'success', gatewayType: paymentResult?.transaction?.type || paymentMethod, amount: plan.price, currency: 'CDF', status: 'successful', createdAt: paidAt, completedAt: paidAt, rawResponse: paymentResult || { simulated: true } }
    const invoiceRecord = { userId, vendorId: vendor.id, invoiceNumber: `INV-${transactionId}`, transactionId, plan: plan.nameKey, amount: plan.price, currency: 'CDF', status: 'paid', issuedAt: paidAt, paidAt, expiryDate }
    const savedRecords = subscriptionService.saveCheckoutRecords({ vendorId: vendor.id, userId, subscription: updatedSubscription, payment: paymentRecord, transaction: transactionRecord, invoice: invoiceRecord })
    setReceipt({ id: savedRecords.invoice.invoiceNumber, vendorName: vendor.name, plan: plan.nameKey, amount: plan.price, method: paymentMethodLabel, transactionId, date: paidAt, expiryDate, status: paymentRecord.status })
    setPaymentSuccess(true)
    setShowPayment(false)
    setCheckoutStep('receipt')
    setCurrentPlan(selectedPlan)
    onSubscriptionUpdated(updatedSubscription)
  }

  const handleSelectPlan = (planId) => { setSelectedPlan(planId) }

  const handleProceed = () => {
    if (selectedPlan === currentPlan) return
    if (selectedPlan === 'free') activateSubscription(null)
    else { setCheckoutStep('method'); setShowPayment(true) }
  }

  const callPaymentApi = async (plan) => {
    const basePayload = { amount: plan.price, currency: 'CDF', vendorId: vendor.id, planType: plan.id }
    if (paymentMethod === PAYMENT_METHODS.MOBILE_MONEY) return processMobileMoneyPayment({ ...basePayload, provider: paymentDetails.provider, phoneNumber: paymentDetails.phoneNumber })
    if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD) return { success: true, transaction: { id: `CC${Date.now()}`, type: 'credit_card' } }
    const result = await processBankTransferPayment({ ...basePayload, bank: paymentDetails.bank, accountNumber: paymentDetails.accountNumber || BANK_ACCOUNTS[paymentDetails.bank]?.accountNumber })
    if (!result.success) return result
    return verifyBankTransferPayment(result.transactionId, true)
  }

  const processSubscriptionChange = async () => {
    setIsProcessing(true); setPaymentError(''); setCheckoutStep('api')
    try {
      const plan = PLANS.find(p => p.id === selectedPlan)
      const paymentResult = await callPaymentApi(plan)
      if (!paymentResult.success) { setCheckoutStep('details'); setPaymentError(t('sub.failed') + ' ' + (paymentResult.error || '')); return }
      setCheckoutStep('firebase')
      activateSubscription(paymentResult)
    } catch (error) { setCheckoutStep('details'); setPaymentError(t('sub.failed')) }
    finally { setIsProcessing(false) }
>>>>>>> e66c1ea (Update app)
  }

  const handleRenew = async () => {
    setIsProcessing(true)
<<<<<<< HEAD

    try {
      const subscription = vendorStorage.getSubscription(vendor.id)
=======
    try {
      const subscription = subscriptionService.getSubscription(vendor.id)
>>>>>>> e66c1ea (Update app)
      const plan = PLANS.find(p => p.id === subscription.plan)
      const now = new Date()
      const currentExpiry = subscription.expiryDate ? new Date(subscription.expiryDate) : now
      const newExpiry = new Date(currentExpiry.getTime() + plan.duration * 24 * 60 * 60 * 1000)
<<<<<<< HEAD

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
=======
      subscriptionService.setSubscription(vendor.id, { ...subscription, expiryDate: newExpiry.toISOString(), remainingDays: plan.duration })
      subscriptionService.addPaymentRecord(vendor.id, { plan: subscription.plan, amount: plan.price, date: now.toISOString(), status: 'completed', type: 'renewal' })
      onSubscriptionUpdated(subscription); onClose()
    } catch (error) { console.error('Renewal error:', error) } finally { setIsProcessing(false) }
>>>>>>> e66c1ea (Update app)
  }

  const handleCancel = async () => {
    setIsProcessing(true)
<<<<<<< HEAD

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
=======
    try {
      const subscription = subscriptionService.getSubscription(vendor.id)
      subscription.cancelledAt = new Date().toISOString(); subscription.plan = 'free'
      subscriptionService.setSubscription(vendor.id, subscription)
      onSubscriptionUpdated(subscription); onClose()
    } catch (error) { console.error('Cancel error:', error) } finally { setIsProcessing(false) }
  }

  const generateInvoice = (payment) => {
    const content = `YENGO MARKETPLACE - ${t('sub.invoice')}\n${t('sub.receiptId')}: INV-${payment.id}\n${t('sub.date')}: ${new Date(payment.date).toLocaleDateString()}\n${t('sub.vendorName')}: ${vendor.name}\n${t('sub.planName')}: ${payment.plan.toUpperCase()}\n${t('sub.amount')}: ${payment.amount.toLocaleString()} FC\n${t('payment.status')}: ${payment.status.toUpperCase()}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `invoice-${payment.id}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  const vendorPayments = subscriptionService.getPaymentHistory().filter(p => p.vendorId === vendor.id)

  const handleClose = () => { setSelectedPlan(null); setShowPayment(false); setPaymentSuccess(false); setShowHistory(false); setShowCancelConfirm(false); setCheckoutStep('plan'); setPaymentError(''); setReceipt(null); onClose() }

  const selectedPlanObj = PLANS.find(p => p.id === selectedPlan)
  const currentPlanObj = PLANS.find(p => p.id === currentPlan)
  const currentSub = subscriptionService.getSubscription(vendor.id)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('sub.title')} size="large">
      {!showHistory && !showPayment && !paymentSuccess && !showCancelConfirm && (
        <div>
          <div className="dashboard-card-bg" style={{ marginBottom: 24 }}>
            <h4 style={{ margin: '0 0 12px', color: 'var(--text)' }}>{t('sub.currentPlan')} {currentPlan?.toUpperCase()}</h4>
            {currentPlan !== 'free' && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{currentSub?.expiryDate ? `${t('dash.expiry')} ${new Date(currentSub.expiryDate).toLocaleDateString()}` : ''}</p>}
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <Button type="button" variant="primary" onClick={() => setShowHistory(true)}>{t('sub.viewHistory')}</Button>
            {currentPlan !== 'free' && <><Button type="button" variant="success" onClick={handleRenew}>{t('sub.renew')}</Button><Button type="button" variant="danger" onClick={() => setShowCancelConfirm(true)}>{t('sub.cancelSub')}</Button></>}
          </div>
          <h4 style={{ color: 'var(--text)', marginBottom: 16 }}>{t('sub.upgrade')}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {PLANS.map(plan => (
              <div key={plan.id} onClick={() => handleSelectPlan(plan.id)}
                className="dashboard-card-surface"
                style={{ cursor: 'pointer', border: selectedPlan === plan.id ? '2px solid var(--primary)' : '1px solid var(--border)', background: selectedPlan === plan.id ? 'var(--bg)' : 'var(--surface)', transition: 'all 150ms ease' }}>
                <h4 style={{ margin: '0 0 8px', color: 'var(--text)' }}>{t(plan.nameKey)}</h4>
                <p style={{ color: plan.price === 0 ? '#10b981' : '#f59e0b', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 12px' }}>{plan.price === 0 ? t('sub.free') : `${plan.price.toLocaleString()} FC`}</p>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 12px', fontSize: '0.9rem' }}>{plan.duration ? `${t('sub.perMonth')}` : t('sub.forever')}</p>
                <ul style={{ color: 'var(--text-muted)', margin: 0, paddingLeft: 20, fontSize: '0.9rem' }}>{plan.benefitsKeys.map((bk, i) => <li key={i} style={{ marginBottom: 4 }}>{t(bk)}</li>)}</ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button type="button" variant="secondary" onClick={handleClose}>{t('sub.close')}</Button>
            <Button type="button" variant="primary" onClick={handleProceed} disabled={!selectedPlan || selectedPlan === currentPlan}>{selectedPlan === 'free' ? t('sub.downgrade') : t('sub.proceed')}</Button>
          </div>
        </div>
      )}
      {showHistory && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}><h4 style={{ margin: 0, color: 'var(--text)' }}>{t('sub.history')}</h4><Button type="button" variant="secondary" onClick={() => setShowHistory(false)}>{t('sub.back')}</Button></div>
          {vendorPayments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {vendorPayments.map(payment => (
                <div key={payment.id} className="dashboard-card-bg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--text)' }}>{payment.type === 'renewal' ? t('sub.renewal') : t('sub.subscription')} - {payment.plan.toUpperCase()}</p><p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(payment.date).toLocaleDateString()}</p></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ color: '#10b981', fontWeight: 600 }}>{payment.amount.toLocaleString()} FC</span><Button type="button" variant="secondary" size="sm" onClick={() => generateInvoice(payment)}>{t('sub.invoice')}</Button></div>
                </div>
              ))}
            </div>
          ) : <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>{t('sub.noHistory')}</div>}
        </div>
      )}
      {showPayment && (
        <div>
          <div className="dashboard-card-bg" style={{ marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 12px', color: 'var(--text)' }}>{t('sub.paymentSummary')}</h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8 }}>
              <p><strong>{t('sub.planName')}:</strong> {selectedPlan?.toUpperCase()}</p>
              <p><strong>{t('sub.duration')}:</strong> {selectedPlanObj?.duration} {t('sub.duration')}</p>
              <p style={{ marginTop: 12, fontSize: '1.1rem', color: '#f59e0b' }}><strong>{t('sub.price')}: {selectedPlanObj?.price.toLocaleString()} FC</strong></p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
            {[['method', t('payment.methods')], ['details', t('sub.enterDetails')], ['api', t('sub.callApi')], ['firebase', t('sub.activateSub')]].map(([step, label]) => (
              <div key={step} style={{ padding: 10, borderRadius: 8, textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, backgroundColor: checkoutStep === step ? 'var(--primary)' : 'var(--bg)', color: checkoutStep === step ? '#fff' : 'var(--text-muted)', border: checkoutStep === step ? 'none' : '1px solid var(--border)', transition: 'all 150ms' }}>{label}</div>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 12, fontSize: '0.9rem' }}>{t('sub.paymentMethod')}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[{ method: PAYMENT_METHODS.MOBILE_MONEY, labelKey: 'sub.mobileMoney' }, { method: PAYMENT_METHODS.CREDIT_CARD, labelKey: 'sub.creditCard' }, { method: PAYMENT_METHODS.BANK_TRANSFER, labelKey: 'sub.bankTransfer' }].map(({ method, labelKey }) => (
                <Button key={method} type="button" variant={paymentMethod === method ? 'primary' : 'secondary'} fullWidth onClick={() => { setPaymentMethod(method); setCheckoutStep('method') }} disabled={isProcessing}>{t(labelKey)}</Button>
              ))}
            </div>
          </div>
          <div className="dashboard-card-bg" style={{ marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 16px', color: 'var(--text)' }}>{t('sub.enterDetails')}</h4>
            {paymentMethod === PAYMENT_METHODS.MOBILE_MONEY && (
              <div style={{ display: 'grid', gap: 12 }}>
                <label style={{ color: 'var(--text-muted)', display: 'grid', gap: 8 }}>{t('payment.selectProvider')}<select value={paymentDetails.provider} onChange={e => updatePaymentDetail('provider', e.target.value)} disabled={isProcessing} className="form-select">
                  <option value="mpesa">M-Pesa</option><option value="airtel">Airtel Money</option><option value="orange">Orange Money</option>
                </select></label>
                <label style={{ color: 'var(--text-muted)', display: 'grid', gap: 8 }}>{t('payment.phoneNumber')}
                  <input
                    value={paymentDetails.phoneNumber}
                    onChange={e => {
                      const raw = e.target.value
                      updatePaymentDetail('phoneNumber', raw)
                      setCheckoutStep('details')
                      setPaymentError('')
                    }}
                    onBlur={e => {
                      const val = e.target.value
                      if (val.trim()) {
                        const result = validateDRCPhoneDetailed(val)
                        if (!result.valid) {
                          setPaymentError(t('sub.phoneValidationError', result.error || 'Invalid DRC phone number'))
                        } else {
                          // Normalize to E.164 on blur
                          updatePaymentDetail('phoneNumber', normalizePhone(val))
                        }
                      }
                    }}
                    disabled={isProcessing}
                    placeholder="+243 81 234 5678"
                    className="form-input"
                  />
                  {!paymentError && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: -4 }}>
                      Examples: +243985253499, +243 985 253 499, or 0985253499
                    </span>
                  )}
                </label>
              </div>
            )}
            {paymentMethod === PAYMENT_METHODS.CREDIT_CARD && (
              <div style={{ display: 'grid', gap: 12 }}>
                <label style={{ color: 'var(--text-muted)', display: 'grid', gap: 8 }}>{t('payment.accountName')}<input value={paymentDetails.cardholderName} onChange={e => { updatePaymentDetail('cardholderName', e.target.value); setCheckoutStep('details') }} disabled={isProcessing} placeholder="Joseph Gombe" className="form-input" /></label>
                <label style={{ color: 'var(--text-muted)', display: 'grid', gap: 8 }}>{t('payment.accountNumber')}<input value={paymentDetails.cardNumber} onChange={e => { updatePaymentDetail('cardNumber', e.target.value); setCheckoutStep('details') }} disabled={isProcessing} placeholder="4242 4242 4242 4242" className="form-input" /></label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label style={{ color: 'var(--text-muted)', display: 'grid', gap: 8 }}>Expiry<input value={paymentDetails.expiryDate} onChange={e => { updatePaymentDetail('expiryDate', e.target.value); setCheckoutStep('details') }} disabled={isProcessing} placeholder="12/29" className="form-input" /></label>
                  <label style={{ color: 'var(--text-muted)', display: 'grid', gap: 8 }}>CVV<input value={paymentDetails.cvv} onChange={e => { updatePaymentDetail('cvv', e.target.value); setCheckoutStep('details') }} disabled={isProcessing} placeholder="123" className="form-input" /></label>
                </div>
              </div>
            )}
            {paymentMethod === PAYMENT_METHODS.BANK_TRANSFER && (
              <div style={{ display: 'grid', gap: 12 }}>
                <label style={{ color: 'var(--text-muted)', display: 'grid', gap: 8 }}>{t('payment.selectBank')}<select value={paymentDetails.bank} onChange={e => { updatePaymentDetail('bank', e.target.value); setCheckoutStep('details') }} disabled={isProcessing} className="form-select">
                  {Object.keys(BANK_ACCOUNTS).map(bk => <option key={bk} value={bk}>{BANK_ACCOUNTS[bk].bank}</option>)}
                </select></label>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  <div><strong>{t('payment.accountName')}:</strong> {BANK_ACCOUNTS[paymentDetails.bank]?.accountName}</div>
                  <div><strong>{t('payment.accountNumber')}:</strong> {BANK_ACCOUNTS[paymentDetails.bank]?.accountNumber}</div>
                  <div><strong>{t('payment.swiftCode')}:</strong> {BANK_ACCOUNTS[paymentDetails.bank]?.swiftCode}</div>
                </div>
              </div>
            )}
            {isProcessing && <div style={{ marginTop: 16, color: 'var(--primary)', fontWeight: 700 }}>{checkoutStep === 'api' ? t('sub.callApi') : t('sub.activateSub')}</div>}
            {paymentError && <div style={{ marginTop: 16, color: '#fca5a5', fontWeight: 700 }}>{paymentError}</div>}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowPayment(false)} disabled={isProcessing}>{t('sub.back')}</Button>
            <Button type="button" variant="success" onClick={processSubscriptionChange} disabled={isProcessing}>{isProcessing ? t('sub.processing') : t('sub.pay')}</Button>
          </div>
        </div>
      )}
      {paymentSuccess && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
          <h3 style={{ color: '#10b981', marginBottom: 12 }}>{t('sub.success')}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{t('sub.updated')} {selectedPlan?.toUpperCase()}</p>
          {receipt && (
            <div style={{ textAlign: 'left', maxWidth: 520, margin: '0 auto 24px' }} className="dashboard-card-bg">
              <h4 style={{ margin: '0 0 12px', color: 'var(--text)' }}>{t('sub.receipt')}</h4>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                <div><strong>{t('sub.receiptId')}:</strong> {receipt.id}</div>
                <div><strong>{t('sub.vendorName')}:</strong> {receipt.vendorName}</div>
                <div><strong>{t('sub.planName')}:</strong> {receipt.plan}</div>
                <div><strong>{t('sub.amount')}:</strong> {receipt.amount.toLocaleString()} FC</div>
                <div><strong>{t('sub.method')}:</strong> {receipt.method.replace('_', ' ')}</div>
                <div><strong>{t('sub.transaction')}:</strong> {receipt.transactionId || 'N/A'}</div>
                <div><strong>{t('sub.date')}:</strong> {new Date(receipt.date).toLocaleString()}</div>
                <div><strong>{t('sub.expires')}:</strong> {receipt.expiryDate ? new Date(receipt.expiryDate).toLocaleDateString() : t('sub.forever')}</div>
              </div>
            </div>
          )}
          <Button type="button" variant="primary" onClick={handleClose}>{t('sub.done')}</Button>
        </div>
      )}
      {showCancelConfirm && (
        <div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{t('sub.cancelConfirm')}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowCancelConfirm(false)} disabled={isProcessing}>{t('sub.keep')}</Button>
            <Button type="button" variant="danger" onClick={handleCancel} disabled={isProcessing}>{isProcessing ? t('sub.cancelling') : t('sub.confirmCancel')}</Button>
>>>>>>> e66c1ea (Update app)
          </div>
        </div>
      )}
    </Modal>
  )
}
