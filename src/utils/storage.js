const STORAGE_KEYS = {
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
  vendorAnalytics: 'yengoVendorAnalytics'
}

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return null
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
      return false
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      sessionStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing storage:', error)
      return false
    }
  }
}

export const vendorStorage = {
  getProfile: (vendorId) => {
    const profiles = storage.get(STORAGE_KEYS.vendorProfile) || {}
    return profiles[vendorId] || null
  },

  setProfile: (vendorId, profile) => {
    const profiles = storage.get(STORAGE_KEYS.vendorProfile) || {}
    profiles[vendorId] = profile
    return storage.set(STORAGE_KEYS.vendorProfile, profiles)
  },

  getListings: (vendorId) => {
    const listings = storage.get(STORAGE_KEYS.vendorListings) || {}
    return listings[vendorId] || []
  },

  setListings: (vendorId, listings) => {
    const allListings = storage.get(STORAGE_KEYS.vendorListings) || {}
    allListings[vendorId] = listings
    return storage.set(STORAGE_KEYS.vendorListings, allListings)
  },

  addListing: (vendorId, listing) => {
    const listings = vendorStorage.getListings(vendorId)
    listings.push({ ...listing, id: Date.now(), createdAt: new Date().toISOString() })
    return vendorStorage.setListings(vendorId, listings)
  },

  updateListing: (vendorId, listingId, updates) => {
    const listings = vendorStorage.getListings(vendorId)
    const index = listings.findIndex(l => l.id === listingId)
    if (index !== -1) {
      listings[index] = { ...listings[index], ...updates, updatedAt: new Date().toISOString() }
      return vendorStorage.setListings(vendorId, listings)
    }
    return false
  },

  deleteListing: (vendorId, listingId) => {
    const listings = vendorStorage.getListings(vendorId)
    const filtered = listings.filter(l => l.id !== listingId)
    return vendorStorage.setListings(vendorId, filtered)
  },

  getSubscription: (vendorId) => {
    const subscriptions = storage.get(STORAGE_KEYS.vendorSubscription) || {}
    return subscriptions[vendorId] || { plan: 'free', startDate: null, expiryDate: null }
  },

  setSubscription: (vendorId, subscription) => {
    const subscriptions = storage.get(STORAGE_KEYS.vendorSubscription) || {}
    subscriptions[vendorId] = subscription
    return storage.set(STORAGE_KEYS.vendorSubscription, subscriptions)
  },

  getNotifications: (vendorId) => {
    const notifications = storage.get(STORAGE_KEYS.vendorNotifications) || {}
    return notifications[vendorId] || []
  },

  setNotifications: (vendorId, notifications) => {
    const allNotifications = storage.get(STORAGE_KEYS.vendorNotifications) || {}
    allNotifications[vendorId] = notifications
    return storage.set(STORAGE_KEYS.vendorNotifications, allNotifications)
  },

  addNotification: (vendorId, notification) => {
    const notifications = vendorStorage.getNotifications(vendorId)
    notifications.unshift({ ...notification, id: Date.now(), createdAt: new Date().toISOString() })
    return vendorStorage.setNotifications(vendorId, notifications)
  },

  markNotificationRead: (vendorId, notificationId) => {
    const notifications = vendorStorage.getNotifications(vendorId)
    const index = notifications.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications[index].unread = false
      return vendorStorage.setNotifications(vendorId, notifications)
    }
    return false
  },

  deleteNotification: (vendorId, notificationId) => {
    const notifications = vendorStorage.getNotifications(vendorId)
    const filtered = notifications.filter(n => n.id !== notificationId)
    return vendorStorage.setNotifications(vendorId, filtered)
  },

  clearAllNotifications: (vendorId) => {
    return vendorStorage.setNotifications(vendorId, [])
  },

  getSettings: (vendorId) => {
    const settings = storage.get(STORAGE_KEYS.vendorSettings) || {}
    return settings[vendorId] || {
      theme: 'dark',
      language: 'en',
      notifications: true,
      privacy: {
        publicProfile: true,
        showPhone: true,
        showEmail: false,
        receiveMessages: true
      },
      businessHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '14:00', closed: false },
        sunday: { open: null, close: null, closed: true }
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        whatsapp: '',
        tiktok: '',
        linkedin: '',
        website: ''
      }
    }
  },

  setSettings: (vendorId, settings) => {
    const allSettings = storage.get(STORAGE_KEYS.vendorSettings) || {}
    allSettings[vendorId] = settings
    return storage.set(STORAGE_KEYS.vendorSettings, allSettings)
  },

  getAnalytics: (vendorId) => {
    const analytics = storage.get(STORAGE_KEYS.vendorAnalytics) || {}
    return analytics[vendorId] || {
      profileViews: 0,
      listingViews: 0,
      phoneClicks: 0,
      whatsappClicks: 0,
      websiteClicks: 0,
      directionRequests: 0,
      monthlyGrowth: 0,
      history: []
    }
  },

  setAnalytics: (vendorId, analytics) => {
    const allAnalytics = storage.get(STORAGE_KEYS.vendorAnalytics) || {}
    allAnalytics[vendorId] = analytics
    return storage.set(STORAGE_KEYS.vendorAnalytics, allAnalytics)
  },

  incrementAnalytics: (vendorId, metric) => {
    const analytics = vendorStorage.getAnalytics(vendorId)
    analytics[metric] = (analytics[metric] || 0) + 1
    return vendorStorage.setAnalytics(vendorId, analytics)
  }
}

export { STORAGE_KEYS }
