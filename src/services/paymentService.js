// Payment Service - Simulated Payment Processing
// This service can be replaced with real payment gateways (Flutterwave, Stripe, etc.)
// without changing the UI components

const STORAGE_KEY = 'yengoPayments'

// Payment methods
export const PAYMENT_METHODS = {
  MOBILE_MONEY: 'mobile_money',
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer'
}

// Mobile money providers
export const MOBILE_MONEY_PROVIDERS = {
  ORANGE: 'orange',
  AIRTEL: 'airtel',
  MPESA: 'mpesa'
}

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING_VERIFICATION: 'pending_verification'
}

// Bank account information
export const BANK_ACCOUNTS = {
  RAWBANK: {
    bank: 'Rawbank',
    accountNumber: 'CD0012345678901234567890',
    accountName: 'Yengo+243 SARL',
    swiftCode: 'RAWBCDKI'
  },
  BCDC: {
    bank: 'BCDC',
    accountNumber: 'CD0098765432109876543210',
    accountName: 'Yengo+243 SARL',
    swiftCode: 'BCDCCDKI'
  },
  ECOBANK: {
    bank: 'Ecobank',
    accountNumber: 'CD0055555555555555555555',
    accountName: 'Yengo+243 SARL',
    swiftCode: 'ECOCCDKI'
  }
}

// Phone number validation for DRC
function validatePhoneNumber(phoneNumber, provider) {
  // Remove spaces, dashes, plus signs
  const cleaned = phoneNumber.replace(/[\s\-\+]/g, '')
  
  // DRC phone numbers are typically 9-10 digits
  // Format: +243 XXX XXX XXX or 0XXX XXX XXX
  const phoneRegex = /^(\+243|0)?[0-9]{9}$/
  
  if (!phoneRegex.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid phone number format. Use format: +243 XXX XXX XXX or 0XXX XXX XXX'
    }
  }
  
  return { valid: true }
}

// Credit card validation
function validateCreditCard(cardNumber, expiryDate, cvv, cardholderName) {
  const errors = []
  
  // Card number (basic Luhn algorithm could be added)
  const cleanedCardNumber = cardNumber.replace(/[\s\-]/g, '')
  if (!/^\d{13,19}$/.test(cleanedCardNumber)) {
    errors.push('Invalid card number')
  }
  
  // Expiry date (MM/YY)
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
    errors.push('Invalid expiry date. Use MM/YY format')
  } else {
    const [month, year] = expiryDate.split('/')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1
    
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      errors.push('Card has expired')
    }
  }
  
  // CVV
  if (!/^\d{3,4}$/.test(cvv)) {
    errors.push('Invalid CVV')
  }
  
  // Cardholder name
  if (!cardholderName || cardholderName.trim().length < 2) {
    errors.push('Cardholder name is required')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Generate transaction ID
function generateTransactionId() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TXN${timestamp}${random}`
}

// Generate payment reference for bank transfer
function generatePaymentReference() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `REF${timestamp}${random}`
}

// Simulate payment processing delay
function simulateProcessing(duration = 2000) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

// Get all payments from storage
function getPayments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch (e) {
    console.warn('Error reading payments from storage:', e)
    return []
  }
}

// Save payments to storage
function savePayments(payments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments))
  } catch (e) {
    console.warn('Error saving payments to storage:', e)
  }
}

// Process Mobile Money payment
export async function processMobileMoneyPayment({
  provider,
  phoneNumber,
  amount,
  currency,
  vendorId,
  planType
}) {
  // Validate phone number
  const phoneValidation = validatePhoneNumber(phoneNumber, provider)
  if (!phoneValidation.valid) {
    return {
      success: false,
      error: phoneValidation.error
    }
  }
  
  // Create transaction record
  const transactionId = generateTransactionId()
  const transaction = {
    id: transactionId,
    type: PAYMENT_METHODS.MOBILE_MONEY,
    provider,
    phoneNumber,
    amount,
    currency,
    vendorId,
    planType,
    status: PAYMENT_STATUS.PROCESSING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  // Save initial transaction
  const payments = getPayments()
  payments.push(transaction)
  savePayments(payments)
  
  // Simulate processing
  await simulateProcessing(2000 + Math.random() * 1000)
  
<<<<<<< HEAD
  // Randomly succeed or fail (80% success rate for simulation)
  const success = Math.random() > 0.2
=======
  // Simulated development payment: keep deterministic so checkout testing is stable.
  const success = true
>>>>>>> e66c1ea (Update app)
  
  // Update transaction status
  const updatedPayments = getPayments()
  const transactionIndex = updatedPayments.findIndex(p => p.id === transactionId)
  
  if (transactionIndex !== -1) {
    updatedPayments[transactionIndex] = {
      ...updatedPayments[transactionIndex],
      status: success ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED,
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
    savePayments(updatedPayments)
  }
  
  return {
    success,
    transactionId,
    status: success ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED,
    error: success ? null : 'Payment failed. Please try again.',
    transaction: updatedPayments[transactionIndex]
  }
}

// Process Credit Card payment
export async function processCreditCardPayment({
  cardNumber,
  expiryDate,
  cvv,
  cardholderName,
  amount,
  currency,
  vendorId,
  planType
}) {
  // Validate card details
  const cardValidation = validateCreditCard(cardNumber, expiryDate, cvv, cardholderName)
  if (!cardValidation.valid) {
    return {
      success: false,
      error: cardValidation.errors.join(', ')
    }
  }
  
  // Create transaction record
  const transactionId = generateTransactionId()
  const transaction = {
    id: transactionId,
    type: PAYMENT_METHODS.CREDIT_CARD,
    cardNumber: cardNumber.replace(/\d(?=\d{4})/g, '*'), // Mask all but last 4
    cardholderName,
    amount,
    currency,
    vendorId,
    planType,
    status: PAYMENT_STATUS.PROCESSING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  // Save initial transaction
  const payments = getPayments()
  payments.push(transaction)
  savePayments(payments)
  
  // Simulate processing
  await simulateProcessing(2500 + Math.random() * 1000)
  
<<<<<<< HEAD
  // Randomly succeed or fail (90% success rate for simulation)
  const success = Math.random() > 0.1
=======
  // Simulated development payment: keep deterministic so checkout testing is stable.
  const success = true
>>>>>>> e66c1ea (Update app)
  
  // Update transaction status
  const updatedPayments = getPayments()
  const transactionIndex = updatedPayments.findIndex(p => p.id === transactionId)
  
  if (transactionIndex !== -1) {
    updatedPayments[transactionIndex] = {
      ...updatedPayments[transactionIndex],
      status: success ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED,
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
    savePayments(updatedPayments)
  }
  
  return {
    success,
    transactionId,
    status: success ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED,
    error: success ? null : 'Payment declined. Please check your card details.',
    transaction: updatedPayments[transactionIndex]
  }
}

// Process Bank Transfer payment
export async function processBankTransferPayment({
  bank,
  accountNumber,
  amount,
  currency,
  vendorId,
  planType,
  proofOfPayment
}) {
  // Create transaction record
  const transactionId = generateTransactionId()
  const reference = generatePaymentReference()
  
  const transaction = {
    id: transactionId,
    type: PAYMENT_METHODS.BANK_TRANSFER,
    bank,
    accountNumber,
    reference,
    amount,
    currency,
    vendorId,
    planType,
    proofOfPayment: proofOfPayment || null,
    status: PAYMENT_STATUS.PENDING_VERIFICATION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  // Save transaction
  const payments = getPayments()
  payments.push(transaction)
  savePayments(payments)
  
  return {
    success: true,
    transactionId,
    reference,
    status: PAYMENT_STATUS.PENDING_VERIFICATION,
    transaction
  }
}

// Upload proof of payment (simulated - stores base64 or file reference)
export async function uploadProofOfPayment(file) {
  // In a real implementation, this would upload to a server
  // For simulation, we'll convert to base64 and store in transaction
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      resolve(reader.result)
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

// Get payment by ID
export function getPaymentById(transactionId) {
  const payments = getPayments()
  return payments.find(p => p.id === transactionId)
}

// Get payments by vendor
export function getPaymentsByVendor(vendorId) {
  const payments = getPayments()
  return payments.filter(p => p.vendorId === vendorId)
}

// Get all payments
export function getAllPayments() {
  return getPayments()
}

// Verify bank transfer payment (admin function)
export function verifyBankTransferPayment(transactionId, approved) {
  const payments = getPayments()
  const transactionIndex = payments.findIndex(p => p.id === transactionId)
  
  if (transactionIndex === -1) {
    return {
      success: false,
      error: 'Transaction not found'
    }
  }
  
  payments[transactionIndex] = {
    ...payments[transactionIndex],
    status: approved ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED,
    verifiedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  savePayments(payments)
  
  return {
    success: true,
    transaction: payments[transactionIndex]
  }
}

// Format currency
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Format date
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
