import { storageAdapter, STORAGE_KEYS } from './storageAdapter'

function appendRecord(key, record) {
  const records = storageAdapter.read(key, []) || []
  const nextRecord = {
    ...record,
    id: record.id || `${key}-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
  storageAdapter.write(key, [...records, nextRecord])
  return nextRecord
}

export const subscriptionService = {
  getSubscription(vendorId) {
    const bucket = storageAdapter.read(STORAGE_KEYS.vendorSubscription, {}) || {}
    return bucket[vendorId] || { plan: 'free', startDate: null, expiryDate: null }
  },

  setSubscription(vendorId, subscription) {
    const bucket = storageAdapter.read(STORAGE_KEYS.vendorSubscription, {}) || {}
    bucket[vendorId] = subscription
    storageAdapter.write(STORAGE_KEYS.vendorSubscription, bucket)
    return subscription
  },

  getPaymentHistory() {
    return storageAdapter.read('yengoPaymentHistory', []) || []
  },

  setPaymentHistory(history) {
    return storageAdapter.write('yengoPaymentHistory', Array.isArray(history) ? history : [])
  },

  addPaymentRecord(vendorId, payment) {
    const history = [...this.getPaymentHistory(), { ...payment, vendorId, id: payment.id || Date.now() }]
    this.setPaymentHistory(history)
    return history[history.length - 1]
  },

  saveCheckoutRecords({ vendorId, userId, subscription, payment, transaction, invoice }) {
    this.setSubscription(vendorId, subscription)

    const savedPayment = appendRecord(STORAGE_KEYS.payments, payment)
    const savedTransaction = appendRecord(STORAGE_KEYS.transactions, transaction)
    const savedInvoice = appendRecord(STORAGE_KEYS.invoices, invoice)

    this.addPaymentRecord(vendorId, {
      id: savedPayment.id,
      plan: payment.plan,
      amount: payment.amount,
      date: payment.paidAt,
      status: payment.status,
      method: payment.paymentMethod,
      transactionId: payment.transactionId,
      type: payment.type || 'subscription'
    })

    return {
      userId,
      subscription,
      payment: savedPayment,
      transaction: savedTransaction,
      invoice: savedInvoice
    }
  }
}
