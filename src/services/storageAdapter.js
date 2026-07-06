export const STORAGE_KEYS = {
  currentUser: 'yengoReactCurrentUser',
  vendors: 'yengoReactVendors',
  reviews: 'yengoReactReviews',
  orders: 'yengoReactOrders',
  users: 'yengoReactUsers',
  currency: 'yengoReactCurrency',
  sessions: 'yengoReactSessions',
  vendorListings: 'yengoVendorListings',
  vendorProfile: 'yengoVendorProfile',
  vendorSubscription: 'yengoVendorSubscription',
  vendorNotifications: 'yengoVendorNotifications',
  vendorSettings: 'yengoVendorSettings',
  vendorAnalytics: 'yengoVendorAnalytics',
  subscriptions: 'yengoSubscriptions',
  payments: 'yengoSubscriptionPayments',
  transactions: 'yengoTransactions',
  invoices: 'yengoInvoices'
}

const storage = typeof window !== 'undefined' ? window.localStorage : null

const read = (key, fallback = null) => {
  if (!storage) return fallback

  try {
    const item = storage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch (error) {
    console.warn(`storageAdapter read failed for ${key}`, error)
    return fallback
  }
}

const write = (key, value) => {
  if (!storage) return false

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`storageAdapter write failed for ${key}`, error)
    return false
  }
}

const readString = (key, fallback = '') => {
  if (!storage) return fallback

  try {
    return storage.getItem(key) || fallback
  } catch (error) {
    console.warn(`storageAdapter readString failed for ${key}`, error)
    return fallback
  }
}

const writeString = (key, value) => {
  if (!storage) return false

  try {
    storage.setItem(key, value)
    return true
  } catch (error) {
    console.warn(`storageAdapter writeString failed for ${key}`, error)
    return false
  }
}

const remove = (key) => {
  if (!storage) return false

  try {
    storage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`storageAdapter remove failed for ${key}`, error)
    return false
  }
}

export const storageAdapter = {
  read,
  write,
  readString,
  writeString,
  remove
}
