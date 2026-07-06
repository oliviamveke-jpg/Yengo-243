import { storageAdapter, STORAGE_KEYS } from './storageAdapter'

const defaultSettings = {
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

const normalizeVendorProducts = (vendor, product) => ({
  id: product.id,
  title: product.title,
  price: product.price,
  category: product.category,
  image: product.image,
  active: product.active
})

export const listingService = {
  getVendors(defaultVendors = []) {
    const storedVendors = storageAdapter.read(STORAGE_KEYS.vendors, defaultVendors)
    return Array.isArray(storedVendors) ? storedVendors : defaultVendors
  },

  setVendors(vendors) {
    return storageAdapter.write(STORAGE_KEYS.vendors, Array.isArray(vendors) ? vendors : [])
  },

  getVendor(vendorId) {
    return this.getVendors().find((vendor) => vendor.id === vendorId) || null
  },

  updateVendor(vendorId, updates) {
    const vendors = this.getVendors()
    const index = vendors.findIndex((vendor) => vendor.id === vendorId)

    if (index === -1) {
      return null
    }

    vendors[index] = {
      ...vendors[index],
      ...updates
    }
    this.setVendors(vendors)
    return vendors[index]
  },

  getVendorProfile(vendorId) {
    const profiles = storageAdapter.read(STORAGE_KEYS.vendorProfile, {}) || {}
    return profiles[vendorId] || null
  },

  setVendorProfile(vendorId, profile) {
    const profiles = storageAdapter.read(STORAGE_KEYS.vendorProfile, {}) || {}
    profiles[vendorId] = profile
    storageAdapter.write(STORAGE_KEYS.vendorProfile, profiles)
    return profile
  },

  updateVendorProfile(vendorId, updates) {
    const currentProfile = this.getVendorProfile(vendorId) || {}
    const updatedProfile = {
      ...currentProfile,
      ...updates
    }
    this.setVendorProfile(vendorId, updatedProfile)
    this.updateVendor(vendorId, updatedProfile)
    return updatedProfile
  },

  getListings(vendorId) {
    const bucket = storageAdapter.read(STORAGE_KEYS.vendorListings, {}) || {}
    return Array.isArray(bucket[vendorId]) ? bucket[vendorId] : []
  },

  setListings(vendorId, listings) {
    const bucket = storageAdapter.read(STORAGE_KEYS.vendorListings, {}) || {}
    bucket[vendorId] = Array.isArray(listings) ? listings : []
    storageAdapter.write(STORAGE_KEYS.vendorListings, bucket)
    return bucket[vendorId]
  },

  addListing(vendorId, listing) {
    const normalizedListing = {
      ...listing,
      id: listing.id || Date.now(),
      createdAt: listing.createdAt || new Date().toISOString(),
      updatedAt: listing.updatedAt || new Date().toISOString()
    }

    const listings = [...this.getListings(vendorId), normalizedListing]
    this.setListings(vendorId, listings)

    const vendor = this.getVendor(vendorId)
    if (vendor) {
      const products = [...(vendor.products || []), normalizeVendorProducts(vendor, normalizedListing)]
      this.updateVendor(vendorId, { products })
    }

    return normalizedListing
  },

  updateListing(vendorId, listingId, updates) {
    const listings = this.getListings(vendorId)
    const index = listings.findIndex((listing) => listing.id === listingId)

    if (index === -1) {
      return null
    }

    const updatedListing = {
      ...listings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    listings[index] = updatedListing
    this.setListings(vendorId, listings)

    const vendor = this.getVendor(vendorId)
    if (vendor?.products) {
      const products = vendor.products.map((product) => product.id === listingId ? normalizeVendorProducts(vendor, updatedListing) : product)
      this.updateVendor(vendorId, { products })
    }

    return updatedListing
  },

  deleteListing(vendorId, listingId) {
    const listings = this.getListings(vendorId).filter((listing) => listing.id !== listingId)
    this.setListings(vendorId, listings)

    const vendor = this.getVendor(vendorId)
    if (vendor?.products) {
      const products = vendor.products.filter((product) => product.id !== listingId)
      this.updateVendor(vendorId, { products })
    }

    return true
  },

  getSettings(vendorId) {
    const bucket = storageAdapter.read(STORAGE_KEYS.vendorSettings, {}) || {}
    return bucket[vendorId] || defaultSettings
  },

  setSettings(vendorId, settings) {
    const bucket = storageAdapter.read(STORAGE_KEYS.vendorSettings, {}) || {}
    bucket[vendorId] = settings
    storageAdapter.write(STORAGE_KEYS.vendorSettings, bucket)
    return settings
  },

  getAnalytics(vendorId) {
    const bucket = storageAdapter.read(STORAGE_KEYS.vendorAnalytics, {}) || {}
    return bucket[vendorId] || {
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

  setAnalytics(vendorId, analytics) {
    const bucket = storageAdapter.read(STORAGE_KEYS.vendorAnalytics, {}) || {}
    bucket[vendorId] = analytics
    storageAdapter.write(STORAGE_KEYS.vendorAnalytics, bucket)
    return analytics
  }
}
