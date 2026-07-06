import React, { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, CreditCard, Smartphone, Landmark, CheckCircle, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from '../i18n/I18nProvider'
import { processMobileMoneyPayment, processBankTransferPayment, BANK_ACCOUNTS } from '../services/paymentService'

/* ──────────────────────────────────────
   Helpers
   ────────────────────────────────────── */
function formatPrice(value, currency) {
  if (currency === 'FC') return `${Number(value || 0).toFixed(0)} FC`
  return `$${Number(value || 0).toFixed(2)}`
}

/* ──────────────────────────────────────
   PAYMENT OPTION CARD
   ────────────────────────────────────── */
function PaymentOptionCard({ icon: Icon, label, desc, selected, onClick, color }) {
  return (
    <button
      type="button"
      className={`payment-option-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      style={{
        '--payment-accent': color
      }}
    >
      <span className="payment-option-icon" style={{ background: selected ? color : 'var(--bg)', color: selected ? '#fff' : 'var(--text-secondary)' }}>
        <Icon size={22} />
      </span>
      <span className="payment-option-text">
        <span className="payment-option-label">{label}</span>
        <span className="payment-option-desc">{desc}</span>
      </span>
      <span className={`payment-option-radio ${selected ? 'checked' : ''}`} />
    </button>
  )
}

/* ──────────────────────────────────────
   MOBILE MONEY PROVIDER CARD
   ────────────────────────────────────── */
function ProviderCard({ name, icon, selected, onClick }) {
  return (
    <button
      type="button"
      className={`provider-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="provider-icon">{icon}</span>
      <span className="provider-name">{name}</span>
      {selected && <CheckCircle size={18} className="provider-check" />}
    </button>
  )
}

/* ──────────────────────────────────────
   MAIN CART + PAYMENT MODAL
   ────────────────────────────────────── */
export default function CartPaymentModal({
  cart = {},
  cartCount = 0,
  onClose = () => {},
  onRemove = () => {},
  currency = '$',
  currentUser = null,
  onOrderComplete = () => {}
}) {
  const { t } = useTranslation()
  const items = useMemo(() => Object.values(cart), [cart])
  const total = useMemo(() => items.reduce((sum, item) => sum + (item.product.price || 0) * (item.qty || 0), 0), [items])

  /* ─── Internal state ─── */
  const [step, setStep] = useState('cart')          // cart | payment | processing | confirmation
  const [paymentMethod, setPaymentMethod] = useState(null)  // cash | mobile_money | bank_transfer
  const [mobileProvider, setMobileProvider] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('+243')
  const [selectedBank, setSelectedBank] = useState('RAWBANK')
  const [transferConfirmed, setTransferConfirmed] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const [orderResult, setOrderResult] = useState(null)
  const [error, setError] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)
  const phoneRef = useRef(null)

  /* ─── Bank accounts list ─── */
  const bankAccounts = useMemo(() => Object.entries(BANK_ACCOUNTS), [])

  /* ─── Generate order ID ─── */
  const orderRef = useMemo(() => `ORDER-${Date.now().toString(36).toUpperCase()}`, [])

  /* ─── Go to payment step ─── */
  const handleProceedToPayment = () => {
    setStep('payment')
    setPaymentMethod(null)
    setError(null)
  }

  /* ─── Select payment method ─── */
  const handleSelectMethod = (method) => {
    setPaymentMethod(method)
    setError(null)
    if (method === 'mobile_money') {
      setExpandedSection('mobile_money')
    } else if (method === 'bank_transfer') {
      setExpandedSection('bank_transfer')
    } else {
      setExpandedSection(null)
    }
  }

  /* ─── Confirm payment & process ─── */
  const handleConfirmOrder = async () => {
    setError(null)

    if (paymentMethod === 'cash') {
      // Cash on delivery — no processing needed
      setStep('confirmation')
      setOrderResult({
        status: 'pending_cash',
        message: t('payment.cashMessage', 'You will pay when you receive the order.')
      })
      createOrders('pending_cash')
      return
    }

    if (paymentMethod === 'mobile_money') {
      if (!mobileProvider) {
        setError(t('payment.selectProviderError', 'Please select a mobile money provider'))
        return
      }
      const cleanedPhone = phoneNumber.replace(/[\s\-]/g, '')
      if (cleanedPhone.length < 10) {
        setError(t('payment.phoneError', 'Please enter a valid phone number'))
        return
      }

      setStep('processing')
      setProcessing(true)
      setProcessingStatus(t('payment.mobileProcessing', 'Processing mobile money payment...'))

      try {
        const result = await processMobileMoneyPayment({
          provider: mobileProvider,
          phoneNumber: cleanedPhone,
          amount: total,
          currency: currency === 'FC' ? 'CDF' : 'USD'
        })

        setProcessing(false)
        if (result.success) {
          setStep('confirmation')
          setOrderResult({
            status: 'processing_mobile_money',
            message: t('payment.mobileSuccess', 'Payment request sent to your phone. Please check your phone and enter your PIN to complete the payment.')
          })
          createOrders('processing_mobile_money', result.transactionId)
        } else {
          setError(result.error || 'Payment failed')
          setStep('payment')
        }
      } catch (err) {
        setProcessing(false)
        setError('An error occurred. Please try again.')
        setStep('payment')
      }
      return
    }

    if (paymentMethod === 'bank_transfer') {
      if (!transferConfirmed) {
        setError(t('payment.confirmTransferError', 'Please confirm that you have completed the transfer'))
        return
      }

      try {
        const bank = BANK_ACCOUNTS[selectedBank]
        const result = await processBankTransferPayment({
          bank: bank.bank,
          accountNumber: bank.accountNumber,
          amount: total,
          currency: currency === 'FC' ? 'CDF' : 'USD',
          reference: orderRef
        })

        setStep('confirmation')
        setOrderResult({
          status: 'pending_verification',
          message: t('payment.bankSuccess', 'Your transfer is being verified. We will notify you once confirmed.'),
          reference: result.reference
        })
        createOrders('pending_verification', result.reference)
      } catch (err) {
        setError('An error occurred. Please try again.')
        setStep('payment')
      }
      return
    }

    setError(t('payment.selectMethodError', 'Please select a payment method'))
  }

  /* ─── Create orders after payment ─── */
  const createOrders = (paymentStatus, reference) => {
    const entries = items.map((entry) => ({
      id: `order-${Date.now()}-${entry.product.id}`,
      customerId: currentUser?.id || 'guest',
      vendorId: entry.product.vendorId,
      productId: entry.product.id,
      qty: entry.qty,
      amount: entry.product.price,
      total: (entry.product.price || 0) * (entry.qty || 0),
      status: paymentStatus,
      paymentMethod: paymentMethod,
      paymentReference: reference || null,
      createdAt: new Date().toISOString()
    }))
    onOrderComplete(entries)
  }

  /* ─── Back to cart ─── */
  const handleBackToCart = () => {
    setStep('cart')
    setError(null)
  }

  /* ─── Back to payment method selection ─── */
  const handleBackToMethods = () => {
    setStep('payment')
    setPaymentMethod(null)
    setExpandedSection(null)
    setError(null)
  }

  /* ─── Close on complete ─── */
  const handleComplete = () => {
    onClose()
  }

  // ─── RENDER: EMPTY CART ───
  if (cartCount === 0 && step === 'cart') {
    return (
      <div className="cp-overlay" onClick={onClose}>
        <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cp-header">
            <h3>{t('cart.title', 'Cart')}</h3>
            <button className="btn btn-sm btn-ghost" onClick={onClose}>{t('general.close', 'Close')}</button>
          </div>
          <div className="cp-body">
            <div className="cp-empty">
              <ShoppingCart size={48} />
              <p>{t('cart.empty', 'Your cart is empty.')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── RENDER: PROCESSING ───
  if (step === 'processing') {
    return (
      <div className="cp-overlay" onClick={onClose}>
        <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cp-header">
            <h3>{t('payment.processing', 'Processing Payment')}</h3>
            <button className="btn btn-sm btn-ghost" onClick={onClose}>{t('general.close', 'Close')}</button>
          </div>
          <div className="cp-body cp-body-centered">
            <div className="cp-processing-animation">
              <div className="cp-spinner" />
            </div>
            <p className="cp-processing-text">{processingStatus}</p>
          </div>
        </div>
      </div>
    )
  }

  // ─── RENDER: CONFIRMATION ───
  if (step === 'confirmation') {
    return (
      <div className="cp-overlay" onClick={onClose}>
        <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cp-header">
            <h3>{t('payment.confirmation', 'Order Confirmed')}</h3>
          </div>
          <div className="cp-body cp-body-centered">
            <div className="cp-confirmation-icon">
              <CheckCircle size={56} />
            </div>
            <h2 className="cp-confirmation-title">{t('payment.thankYou', 'Thank you for your order!')}</h2>
            <p className="cp-confirmation-msg">{orderResult?.message}</p>

            {paymentMethod === 'bank_transfer' && orderResult?.reference && (
              <div className="cp-reference-box">
                <span className="cp-reference-label">{t('payment.reference', 'Reference')}:</span>
                <span className="cp-reference-value">{orderResult.reference}</span>
              </div>
            )}

            <div className="cp-confirmation-details">
              <div className="cp-confirmation-row">
                <span>{t('payment.orderRef', 'Order Reference')}</span>
                <span className="cp-confirmation-highlight">{orderRef}</span>
              </div>
              <div className="cp-confirmation-row">
                <span>{t('payment.totalPaid', 'Total')}</span>
                <span className="cp-confirmation-highlight">{formatPrice(total, currency)}</span>
              </div>
              <div className="cp-confirmation-row">
                <span>{t('payment.status', 'Status')}</span>
                <span className={`cp-status-badge ${
                  orderResult?.status === 'pending_cash' ? 'badge-cash' :
                  orderResult?.status === 'processing_mobile_money' ? 'badge-mobile' :
                  'badge-bank'
                }`}>
                  {orderResult?.status === 'pending_cash' && t('payment.statusPendingCash', 'Pending (Cash on Delivery)')}
                  {orderResult?.status === 'processing_mobile_money' && t('payment.statusProcessing', 'Processing (Mobile Money)')}
                  {orderResult?.status === 'pending_verification' && t('payment.statusPendingVerification', 'Pending Verification')}
                </span>
              </div>
            </div>

            <button className="cp-btn-primary cp-btn-full" onClick={handleComplete}>
              {t('general.done', 'Done')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── RENDER: PAYMENT STEP ───
  if (step === 'payment') {
    return (
      <div className="cp-overlay" onClick={onClose}>
        <div className="cp-modal cp-modal-wide" onClick={(e) => e.stopPropagation()}>
          <div className="cp-header">
            <div className="cp-header-left">
              <button className="cp-back-btn" onClick={handleBackToCart} title={t('general.back', 'Back')}>
                <ArrowLeft size={20} />
              </button>
              <h3>{t('payment.chooseMethod', 'Choose Payment Method')}</h3>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={onClose}>{t('general.close', 'Close')}</button>
          </div>

          <div className="cp-body">
            {/* Order summary */}
            <div className="cp-summary-card">
              <div className="cp-summary-header">
                <ShoppingCart size={16} />
                <span>{t('cart.title', 'Cart')} ({cartCount} {t('cart.items', 'items')})</span>
              </div>
              <div className="cp-summary-total">
                <span>{t('cart.total', 'Total')}:</span>
                <span className="cp-total-amount">{formatPrice(total, currency)}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="cp-payment-methods">
              <h4 className="cp-section-title">{t('payment.methods', 'Payment Methods')}</h4>

              <PaymentOptionCard
                icon={Landmark}
                label={t('payment.cashLabel', 'Cash on Delivery')}
                desc={t('payment.cashDesc', 'Pay when you receive your order')}
                color="#10b981"
                selected={paymentMethod === 'cash'}
                onClick={() => handleSelectMethod('cash')}
              />

              <PaymentOptionCard
                icon={Smartphone}
                label={t('payment.mobileLabel', 'Mobile Money')}
                desc={t('payment.mobileDesc', 'Pay with M-Pesa, Airtel Money or Orange Money')}
                color="#8b5cf6"
                selected={paymentMethod === 'mobile_money'}
                onClick={() => handleSelectMethod('mobile_money')}
              />

              <PaymentOptionCard
                icon={CreditCard}
                label={t('payment.bankLabel', 'Bank Transfer')}
                desc={t('payment.bankDesc', 'Transfer to our bank account')}
                color="#2563eb"
                selected={paymentMethod === 'bank_transfer'}
                onClick={() => handleSelectMethod('bank_transfer')}
              />
            </div>

            {/* ─── Cash on Delivery — no extra form ─── */}
            {paymentMethod === 'cash' && (
              <motion.div
                className="cp-method-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="cp-cash-message">
                  <Landmark size={24} />
                  <p>{t('payment.cashMessage', 'You will pay when you receive the order.')}</p>
                </div>
              </motion.div>
            )}

            {/* ─── Mobile Money Form ─── */}
            {paymentMethod === 'mobile_money' && (
              <motion.div
                className="cp-method-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="cp-form-section">
                  <label className="cp-form-label">{t('payment.selectProvider', 'Select Provider')}</label>
                  <div className="cp-provider-grid">
                    <ProviderCard
                      name="M-Pesa"
                      icon="📱"
                      selected={mobileProvider === 'mpesa'}
                      onClick={() => setMobileProvider('mpesa')}
                    />
                    <ProviderCard
                      name="Airtel Money"
                      icon="📲"
                      selected={mobileProvider === 'airtel'}
                      onClick={() => setMobileProvider('airtel')}
                    />
                    <ProviderCard
                      name="Orange Money"
                      icon="🟠"
                      selected={mobileProvider === 'orange'}
                      onClick={() => setMobileProvider('orange')}
                    />
                  </div>
                </div>

                <div className="cp-form-section">
                  <label className="cp-form-label">{t('payment.phoneNumber', 'Phone Number')}</label>
                  <div className="cp-phone-input-wrapper">
                    <span className="cp-phone-prefix">{t('payment.phonePrefix', '+243')}</span>
                    <input
                      ref={phoneRef}
                      type="tel"
                      className="cp-phone-input"
                      value={phoneNumber.replace('+243', '')}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        setPhoneNumber(`+243${val}`)
                      }}
                      placeholder="  XXX XXX XXX"
                      maxLength={9}
                    />
                  </div>
                  <p className="cp-form-hint">{t('payment.phoneHint', 'Enter your mobile money phone number')}</p>
                </div>
              </motion.div>
            )}

            {/* ─── Bank Transfer Form ─── */}
            {paymentMethod === 'bank_transfer' && (
              <motion.div
                className="cp-method-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Bank selector */}
                <div className="cp-form-section">
                  <label className="cp-form-label">{t('payment.selectBank', 'Select Bank')}</label>
                  <select
                    className="cp-bank-select"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    {bankAccounts.map(([key, account]) => (
                      <option key={key} value={key}>{account.bank}</option>
                    ))}
                  </select>
                </div>

                {/* Bank details card */}
                {bankAccounts.filter(([key]) => key === selectedBank).map(([key, account]) => (
                  <div key={key} className="cp-bank-details">
                    <div className="cp-bank-detail-row">
                      <span className="cp-bank-detail-label">{t('payment.bankName', 'Bank')}</span>
                      <span className="cp-bank-detail-value">{account.bank}</span>
                    </div>
                    <div className="cp-bank-detail-row">
                      <span className="cp-bank-detail-label">{t('payment.accountName', 'Account Name')}</span>
                      <span className="cp-bank-detail-value">{account.accountName}</span>
                    </div>
                    <div className="cp-bank-detail-row">
                      <span className="cp-bank-detail-label">{t('payment.accountNumber', 'Account Number')}</span>
                      <span className="cp-bank-detail-value cp-bank-number">{account.accountNumber}</span>
                    </div>
                    <div className="cp-bank-detail-row">
                      <span className="cp-bank-detail-label">{t('payment.swiftCode', 'Swift Code')}</span>
                      <span className="cp-bank-detail-value">{account.swiftCode}</span>
                    </div>
                    <div className="cp-bank-detail-row">
                      <span className="cp-bank-detail-label">{t('payment.reference', 'Reference')}</span>
                      <span className="cp-bank-detail-value cp-reference-highlight">{orderRef}</span>
                    </div>
                  </div>
                ))}

                {/* Transfer confirmation */}
                <div className="cp-transfer-confirm">
                  <label className="cp-transfer-checkbox">
                    <input
                      type="checkbox"
                      checked={transferConfirmed}
                      onChange={(e) => setTransferConfirmed(e.target.checked)}
                    />
                    <span className="cp-transfer-checkmark" />
                    <span>{t('payment.confirmTransfer', 'I have completed the transfer')}</span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <div className="cp-error">
                {error}
              </div>
            )}

            {/* Confirm Button */}
            <button
              className="cp-btn-primary cp-btn-full"
              onClick={handleConfirmOrder}
              disabled={!paymentMethod || (paymentMethod === 'mobile_money' && (!mobileProvider || phoneNumber.length < 10))}
            >
              {paymentMethod === 'cash' && t('payment.confirmCash', 'Confirm Order (Cash on Delivery)')}
              {paymentMethod === 'mobile_money' && t('payment.payMobile', 'Pay with Mobile Money')}
              {paymentMethod === 'bank_transfer' && (transferConfirmed ? t('payment.submitTransfer', 'Submit Transfer') : t('payment.confirmOrder', 'Confirm Order'))}
              {!paymentMethod && t('payment.selectMethod', 'Select a Payment Method')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── RENDER: CART STEP (default) ───
  return (
    <div className="cp-overlay" onClick={onClose}>
      <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cp-header">
          <h3>{t('cart.title', 'Cart')}</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>{t('general.close', 'Close')}</button>
        </div>

        <div className="cp-body">
          {/* Cart items */}
          <div className="cp-items">
            {items.map(item => (
              <div key={item.product.id} className="cp-item">
                <div className="cp-item-info">
                  <div className="cp-item-title">{item.product.title}</div>
                  <div className="cp-item-meta">{item.product.vendorName}</div>
                </div>
                <div className="cp-item-actions">
                  <span className="cp-item-price">{item.qty} × {formatPrice(item.product.price, currency)}</span>
                  <button className="cp-remove-btn" onClick={() => onRemove(item.product.id)}>
                    {t('cart.remove', 'Remove')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="cp-total-row">
            <span>{t('cart.total', 'Total')}:</span>
            <span className="cp-total-amount">{formatPrice(total, currency)}</span>
          </div>

          {/* Proceed to payment */}
          <button className="cp-btn-primary cp-btn-full" onClick={handleProceedToPayment}>
            {t('payment.proceed', 'Proceed to Payment')}
          </button>
        </div>
      </div>
    </div>
  )
}
