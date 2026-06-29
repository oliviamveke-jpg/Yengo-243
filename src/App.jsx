import React, { useEffect, useMemo, useState, useRef } from 'react'
import L from 'leaflet'
import MapView from './components/MapView'
import Marketplace from './components/Marketplace'
import AnalyticsModal from './components/AnalyticsModal'
import MonetizationModal from './components/MonetizationModal'
import VendorDashboard from './components/VendorDashboard'
import ProfileDropdown from './components/ProfileDropdown'
import { vendors as seedVendors, seedReviews, sampleUsers } from './data/marketplaceData'
import { kinshasaLocationData } from './data/locationData'
import { getDefaultSubscriptionExpiry } from './data/monetizationData'

const STORAGE_KEYS = {
  vendors: 'yengoReactVendors',
  reviews: 'yengoReactReviews',
  orders: 'yengoReactOrders',
  users: 'yengoReactUsers',
  currentUser: 'yengoReactCurrentUser',
  currency: 'yengoReactCurrency',
  sessions: 'yengoReactSessions'
}

function saveSession(vendors, orders, reviews) {
  try {
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.sessions) || '[]')
    const newSession = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      vendors: vendors,
      orders: orders,
      reviews: reviews,
      vendorCount: vendors.length,
      orderCount: orders.length
    }
    sessions.unshift(newSession)
    if (sessions.length > 10) sessions.pop() // Keep only last 10 sessions
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions))
  } catch (e) {
    console.warn('saveSession error', e)
  }
}

function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.sessions) || '[]')
  } catch (e) {
    console.warn('getSessions error', e)
    return []
  }
}

function readStorage(key, fallback) {
  try {
    var raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('readStorage', key, e)
  }
  return fallback
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('writeStorage', key, e)
  }
}

function normalizeText(value) {
  return String(value || '').toLowerCase().trim()
}

function productMatchesSearch(product, q) {
  if (!q) return true
  var haystack = [product.title, product.category, product.subcategory, product.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

function vendorMatchesSearch(vendor, q) {
  if (!q) return true
  var haystack = [vendor.name, vendor.category, vendor.province, vendor.commune, vendor.quartier, vendor.rue, vendor.street, vendor.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

function filterVendors(vendors, filters, q) {
  const normalizedQuery = normalizeText(q)
  return vendors.filter(vendor => {
    if (filters.province && vendor.province !== filters.province) return false
    if (filters.commune && vendor.commune !== filters.commune) return false
    if (filters.category && vendor.category !== filters.category) return false
    if (filters.subcategory && !vendor.products.some(product => product.subcategory === filters.subcategory)) return false
    if (filters.quartier && vendor.quartier !== filters.quartier) return false
    if (filters.ville && vendor.ville !== filters.ville) return false
    if (filters.street) {
      const streetQuery = normalizeText(filters.street)
      const matchRue = normalizeText(vendor.rue || '').includes(streetQuery)
      const matchStreetField = normalizeText(vendor.street || '').includes(streetQuery)
      if (!matchRue && !matchStreetField) return false
    }
    if (!normalizedQuery) return true
    return vendorMatchesSearch(vendor, normalizedQuery) || vendor.products.some(product => productMatchesSearch(product, normalizedQuery))
  })
}

function filterProducts(vendor, filters, q) {
  const normalizedQuery = normalizeText(q)
  return vendor.products.filter(product => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.subcategory && product.subcategory !== filters.subcategory) return false
    if (!normalizedQuery) return true
    if (vendorMatchesSearch(vendor, normalizedQuery)) return true
    return productMatchesSearch(product, normalizedQuery)
  })
}

export default function App() {
  const [vendors, setVendors] = useState(() => readStorage(STORAGE_KEYS.vendors, seedVendors))
  const [reviews, setReviews] = useState(() => readStorage(STORAGE_KEYS.reviews, seedReviews))
  const [orders, setOrders] = useState(() => readStorage(STORAGE_KEYS.orders, []))
  const [users, setUsers] = useState(() => {
    const savedUsers = readStorage(STORAGE_KEYS.users, sampleUsers);
    // Migration: Convert old 'type' field to 'role' for all users
    return savedUsers.map(user => {
      if (user.type && !user.role) {
        console.log('[App] Migrating user from type to role:', user);
        return {
          ...user,
          role: user.type === 'vendor' ? 'vendor' : 'buyer',
          type: undefined // Remove old type field
        };
      }
      return user;
    });
  })
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = readStorage(STORAGE_KEYS.currentUser, null)
    if (saved) {
      console.log('[App] Loading saved user from storage:', saved);
      // Migration: Convert old 'type' field to 'role'
      if (saved.type && !saved.role) {
        const migratedUser = {
          ...saved,
          role: saved.type === 'vendor' ? 'vendor' : 'buyer',
          type: undefined // Remove old type field
        };
        console.log('[App] Migrating user from type to role:', migratedUser);
        writeStorage(STORAGE_KEYS.currentUser, migratedUser);
        return migratedUser;
      }
      return saved
    }
    // Fix: Default to vendor user instead of buyer for testing
    const defaultUser = sampleUsers.find(u => u.role === 'vendor') || sampleUsers[0]
    writeStorage(STORAGE_KEYS.currentUser, defaultUser)
    console.log('[App] Using default user:', defaultUser);
    return defaultUser
  })
  const [currency, setCurrency] = useState(() => localStorage.getItem(STORAGE_KEYS.currency) || '$')
  const [filters, setFilters] = useState({ province: '', commune: '', quartier: '', street: '', ville: '', category: '', subcategory: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || null)
  const [activeVendorShopId, setActiveVendorShopId] = useState(null)
  const [activeProduct, setActiveProduct] = useState(null)
  const [manageVendorId, setManageVendorId] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [markersVisible, setMarkersVisible] = useState(true)
  const [cart, setCart] = useState({})
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  const [spatialTab, setSpatialTab] = useState('real-time')
  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [viewMode, setViewMode] = useState('marketplace')
  const [authMode, setAuthMode] = useState('login')
  const [showAuthPanel, setShowAuthPanel] = useState(false)
  const kinshasaCommunes = useMemo(() => Object.keys(kinshasaLocationData?.communes || {}).sort(), [])
  const allKinshasaQuartiers = useMemo(
    () => Array.from(new Set(Object.values(kinshasaLocationData?.communes || {}).flatMap(commune => Object.keys(commune?.quartiers || {})))).sort(),
    []
  )

  const [isMonetizationOpen, setIsMonetizationOpen] = useState(false)
  const registrationMapRef = useRef(null)
  const registrationMapInstanceRef = useRef(null)
  const [locationDetection, setLocationDetection] = useState({
    loading: false,
    error: null,
    status: null
  })

  const [authForm, setAuthForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    profilePicture: null,
    accountType: 'buyer', // New field: 'buyer' or 'vendor'
    businessName: '',
    category: 'Électronique',
    commune: '',
    quartier: '',
    rue: '',
    description: '',
    businessImage: null,
    coords: null
  })

  const availableQuartiers = useMemo(() => {
    if (authForm.commune && kinshasaLocationData.communes && kinshasaLocationData.communes[authForm.commune]) {
      return Object.keys(kinshasaLocationData.communes[authForm.commune]?.quartiers || {}).sort()
    }
    return allKinshasaQuartiers
  }, [authForm.commune, allKinshasaQuartiers])

  // Reverse geocoding function using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      return data.address
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      throw new Error('Unable to determine location from coordinates')
    }
  }

  // Match detected commune against kinshasaLocationData
  const matchCommune = (detectedCommune) => {
    if (!detectedCommune) return null
    const normalizedDetected = detectedCommune.toLowerCase().trim()
    const communeNames = Object.keys(kinshasaLocationData?.communes || {})
    
    // Try exact match first
    const exactMatch = communeNames.find(
      commune => commune.toLowerCase() === normalizedDetected
    )
    if (exactMatch) return exactMatch
    
    // Try partial match
    const partialMatch = communeNames.find(
      commune => normalizedDetected.includes(commune.toLowerCase()) || 
                commune.toLowerCase().includes(normalizedDetected)
    )
    return partialMatch || null
  }

  // Match detected quartier against commune's quartiers
  const matchQuartier = (detectedQuartier, commune) => {
    if (!detectedQuartier || !commune || !kinshasaLocationData.communes[commune]) return null
    const normalizedDetected = detectedQuartier.toLowerCase().trim()
    const communeQuartiers = Object.keys(kinshasaLocationData.communes[commune]?.quartiers || {})
    
    // Try exact match first
    const exactMatch = communeQuartiers.find(
      quartier => quartier.toLowerCase() === normalizedDetected
    )
    if (exactMatch) return exactMatch
    
    // Try partial match
    const partialMatch = communeQuartiers.find(
      quartier => normalizedDetected.includes(quartier.toLowerCase()) || 
                quartier.toLowerCase().includes(normalizedDetected)
    )
    return partialMatch || null
  }

  // Handle "Use My Location" button click
  const handleUseMyLocation = () => {
    setLocationDetection({ loading: true, error: null, status: 'Detecting location...' })
    
    if (!navigator.geolocation) {
      setLocationDetection({ loading: false, error: 'Geolocation is not supported by your browser', status: null })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocationDetection({ loading: true, error: null, status: 'Determining address...' })
        
        try {
          const address = await reverseGeocode(latitude, longitude)
          
          // Extract commune and quartier from address
          const detectedCommune = address.city || address.town || address.suburb || address.county || address.district
          const detectedQuartier = address.suburb || address.neighbourhood || address.residential
          
          // Match against kinshasaLocationData
          const matchedCommune = matchCommune(detectedCommune)
          const matchedQuartier = matchedCommune ? matchQuartier(detectedQuartier, matchedCommune) : null
          
          // Update form state
          setAuthForm(prev => ({
            ...prev,
            province: 'Kinshasa',
            commune: matchedCommune || '',
            quartier: matchedQuartier || '',
            coords: [latitude, longitude]
          }))
          
          setLocationDetection({
            loading: false,
            error: null,
            status: matchedCommune ? 'Location detected successfully' : 'Location detected but commune not found in database'
          })
          
          // Clear status message after 3 seconds
          setTimeout(() => {
            setLocationDetection(prev => ({ ...prev, status: null }))
          }, 3000)
          
        } catch (error) {
          setLocationDetection({ loading: false, error: error.message, status: null })
        }
      },
      (error) => {
        let errorMessage = 'Unable to determine location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access or select your location manually.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
          default:
            errorMessage = 'An unknown error occurred.'
        }
        setLocationDetection({ loading: false, error: errorMessage, status: null })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  useEffect(() => {
    writeStorage(STORAGE_KEYS.vendors, vendors)
  }, [vendors])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.reviews, reviews)
  }, [reviews])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.orders, orders)
  }, [orders])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.users, users)
  }, [users])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.currentUser, currentUser)
  }, [currentUser])

  useEffect(() => {
    const htmlCurrentUser = localStorage.getItem('currentUser')
    if (htmlCurrentUser && !currentUser) {
      const parsedUser = JSON.parse(htmlCurrentUser)
      console.log('[App] Restoring user from localStorage (legacy key):', parsedUser);
      setCurrentUser(parsedUser)
    }
  }, [])

  useEffect(() => {
    if (currentUser && !users.some(u => u.id === currentUser.id)) {
      setUsers(prev => [...prev, currentUser])
    }
  }, [currentUser, users])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.currency, currency)
  }, [currency])

  useEffect(() => {
    if (!selectedVendorId && vendors.length) {
      setSelectedVendorId(vendors[0].id)
    }
  }, [selectedVendorId, vendors])

  // Auto-save session every 30 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveSession(vendors, orders, reviews)
    }, 30000)
    return () => clearInterval(saveInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendors, orders, reviews])

  // Initialize registration map for coordinate selection
  useEffect(() => {
    if (!showAuthPanel || authMode !== 'register') {
      if (registrationMapInstanceRef.current) {
        registrationMapInstanceRef.current.remove()
        registrationMapInstanceRef.current = null
      }
      return
    }

    const mapContainer = document.getElementById('vendor-registration-map')
    if (!mapContainer || registrationMapInstanceRef.current) return

    const map = L.map('vendor-registration-map', {
      zoomControl: true
    }).setView([-4.325, 15.3222], 12)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap © CARTO'
    }).addTo(map)

    let marker = null

    map.on('click', e => {
      const { lat, lng } = e.latlng
      setAuthForm(prev => ({ ...prev, coords: [lat, lng] }))

      if (marker) {
        marker.setLatLng([lat, lng])
      } else {
        marker = L.marker([lat, lng]).addTo(map)
        map._marker = marker
      }
    })

    registrationMapInstanceRef.current = map

    return () => {
      if (registrationMapInstanceRef.current) {
        registrationMapInstanceRef.current.remove()
        registrationMapInstanceRef.current = null
      }
    }
  }, [showAuthPanel, authMode])

  // Get cached sessions
  const cachedSessions = useMemo(() => getSessions(), [])

  const filteredVendors = useMemo(
  () => filterVendors(vendors, filters, searchQuery),
  [vendors, filters, searchQuery]
)

console.log('Filters:', filters)
console.log('Filtered vendors:', filteredVendors)

  useEffect(() => {
    if (selectedVendorId && !filteredVendors.some(v => v.id === selectedVendorId)) {
      setSelectedVendorId(filteredVendors[0]?.id || null)
    }
  }, [selectedVendorId, filteredVendors])

  const selectedVendor = useMemo(() => vendors.find(v => v.id === selectedVendorId) || vendors[0] || null, [vendors, selectedVendorId])

  const targetCoordinate = useMemo(() => {
    if (filters.street && kinshasaLocationData.streets) {
      const street = kinshasaLocationData.streets.find(s => s.name === filters.street)
      if (street && street.coords) {
        return street.coords
      }
    }
    if (filters.province === 'Kinshasa' && filters.commune && kinshasaLocationData.communes && kinshasaLocationData.communes[filters.commune]) {
      const communeData = kinshasaLocationData.communes[filters.commune]
      // Quartiers are objects, not arrays with coordinates
      // Return commune coordinates since quartiers don't have individual coordinates in the current structure
      // Add a tiny offset based on quartier to trigger map pan when quartier changes within same commune
      if (filters.quartier) {
        const offset = filters.quartier.length * 0.00001
        return [communeData.coords[0] + offset, communeData.coords[1]]
      }
      return communeData.coords
    }
    if (filters.province === 'Kinshasa' && !filters.commune) {
      return kinshasaLocationData.coords
    }
    return null
  }, [filters.province, filters.commune, filters.quartier, filters.street])

  const targetZoom = useMemo(() => {
    if (filters.street) {
      return 17 // Street selection → zoom level around 17-18
    }
    if (filters.province === 'Kinshasa' && filters.quartier) {
      return 15 // Quartier selection → zoom level around 15-16
    }
    if (filters.province === 'Kinshasa' && filters.commune) {
      return 13 // Commune selection → zoom level around 12-13
    }
    if (filters.province === 'Kinshasa') {
      return 12 // Province selection → zoom level around 12
    }
    return null // No specific zoom level
  }, [filters.province, filters.commune, filters.quartier, filters.street])

  const filteredProducts = useMemo(() => {
    return filteredVendors.flatMap(vendor => {
      return filterProducts(vendor, filters, searchQuery).map(product => ({
        ...product,
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorCategory: vendor.category,
        vendorCoords: vendor.coords,
        vendorOwnerId: vendor.ownerId || null
      }))
    })
  }, [filteredVendors, filters, searchQuery])

  const cartCount = useMemo(() => Object.values(cart).reduce((sum, entry) => sum + entry.qty, 0), [cart])

  const handleVendorSelection = (vendorId, openShop = false) => {
    setSelectedVendorId(vendorId)
    if (openShop) setActiveVendorShopId(vendorId)
    // Increment view count for store traffic tracking
    setVendors(prev => prev.map(v => 
      v.id === vendorId ? { ...v, viewCount: (v.viewCount || 0) + 1 } : v
    ))
  }

  const addToCart = product => {
    setCart(prev => {
      const next = { ...prev }
      if (!next[product.id]) next[product.id] = { product, qty: 0 }
      next[product.id].qty += 1
      return next
    })
  }

  const removeFromCart = productId => {
    setCart(prev => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }

  const checkoutCart = () => {
    const entries = Object.values(cart).map(entry => ({
      id: `order-${Date.now()}-${entry.product.id}`,
      customerId: currentUser.id,
      vendorId: entry.product.vendorId,
      productId: entry.product.id,
      qty: entry.qty,
      amount: entry.product.price,
      status: 'completed',
      createdAt: new Date().toISOString()
    }))
    if (entries.length) {
      setOrders(prev => [...prev, ...entries])
      setCart({})
      setIsCartOpen(false)
    }
  }

  const saveReview = review => {
    setReviews(prev => [...prev, review])
  }

  const updateVendorProducts = (vendorId, nextProducts) => {
    setVendors(prev => prev.map(v => (v.id === vendorId ? { ...v, products: nextProducts } : v)))
  }

  const loginAs = userId => {
    const next = users.find(u => u.id === userId)
    if (next) setCurrentUser(next)
  }

  const registerCustomer = () => {
    if (!authForm.rue || !authForm.rue.trim()) {
      return window.alert('Veuillez saisir votre rue pour créer un compte client.')
    }
    if (!authForm.email || !authForm.email.trim()) {
      return window.alert('Please enter an email address.')
    }
    if (!authForm.password || authForm.password.length < 6) {
      return window.alert('Password must be at least 6 characters.')
    }

    const userId = `buyer-${Date.now()}`
    const newUser = {
      id: userId,
      role: 'buyer', // Changed from type to role
      fullName: authForm.fullName || 'Client Yengo',
      email: authForm.email.trim().toLowerCase(),
      phone: authForm.phone || '',
      password: authForm.password,
      profilePicture: authForm.profilePicture || null,
      rue: authForm.rue || '',
      quartier: authForm.quartier || '',
      commune: authForm.commune || '',
      label: `Client ${authForm.fullName || ''}`.trim()
    }

    console.log('[App] Registering new buyer:', newUser);

    const storedAccounts = JSON.parse(localStorage.getItem('yengoAccounts') || '[]')
    const existingAccount = storedAccounts.find(u => u.email === newUser.email)
    if (existingAccount) {
      console.log('[App] Registration failed - email already exists:', newUser.email);
      return window.alert('An account with this email already exists.')
    }

    storedAccounts.push(newUser)
    localStorage.setItem('yengoAccounts', JSON.stringify(storedAccounts))

    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    setAuthMode('login')
    setAuthForm(prev => ({ ...prev, fullName: '', email: '', phone: '', password: '', profilePicture: null, accountType: 'buyer', commune: '', quartier: '', rue: '', description: '', businessName: '', category: 'Électronique', businessImage: null, coords: null }))
    
    console.log('[App] Buyer registration successful - current user set to:', newUser);
  }

  const registerVendor = () => {
    if (!authForm.rue || !authForm.rue.trim()) {
      return window.alert('Veuillez saisir la rue de votre boutique.')
    }
    if (!authForm.email || !authForm.email.trim()) {
      return window.alert('Please enter an email address.')
    }
    if (!authForm.password || authForm.password.length < 6) {
      return window.alert('Password must be at least 6 characters.')
    }

    const ownerId = `vendor-${Date.now()}`
    const vendorId = `v-local-${ownerId}`
    const newVendor = {
      id: vendorId,
      ownerId,
      name: authForm.businessName || authForm.fullName || 'Nouvelle boutique',
      province: 'Kinshasa',
      commune: authForm.commune || 'Kinshasa',
      ville: 'Kinshasa Ville',
      quartier: authForm.quartier || 'Centre',
      rue: authForm.rue || '',
      coords: authForm.coords || [-4.325, 15.3222],
      rating: 4.2,
      category: authForm.category || 'Services',
      description: authForm.description || 'Nouvelle boutique sur Yengo+243',
      profileImage: authForm.businessImage || null,
      products: [],
      subscription: { plan: 'free', expiresAt: null, subscribedAt: null },
      boostPin: { active: false, expiresAt: null, boostedAt: null, days: 0 },
      delivery: { enabled: false, feeFC: 0, commissionRate: 0.10 }
    }
    setVendors(prev => [...prev, newVendor])
    const newUser = {
      id: ownerId,
      role: 'vendor', // Changed from type to role
      fullName: authForm.fullName || 'Propriétaire',
      email: authForm.email.trim().toLowerCase(),
      phone: authForm.phone || '',
      password: authForm.password,
      profilePicture: authForm.profilePicture || null,
      label: `Vendeur ${authForm.fullName || ''}`.trim()
    }

    console.log('[App] Registering new vendor:', newUser);
    console.log('[App] Creating vendor profile:', newVendor);

    const storedAccounts = JSON.parse(localStorage.getItem('yengoAccounts') || '[]')
    const existingAccount = storedAccounts.find(u => u.email === newUser.email)
    if (existingAccount) {
      console.log('[App] Registration failed - email already exists:', newUser.email);
      return window.alert('An account with this email already exists.')
    }

    storedAccounts.push(newUser)
    localStorage.setItem('yengoAccounts', JSON.stringify(storedAccounts))

    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    setSelectedVendorId(vendorId)
    setAuthMode('login')
    setAuthForm(prev => ({ ...prev, fullName: '', businessName: '', email: '', phone: '', password: '', profilePicture: null, accountType: 'buyer', businessImage: null, coords: null, description: '', commune: '', quartier: '', rue: '', category: 'Électronique' }))
    
    console.log('[App] Vendor registration successful - current user set to:', newUser);
  }

  const handleLogin = () => {
    const email = authForm.email?.trim().toLowerCase()
    const password = authForm.password?.trim()

    if (!email || !password) {
      return window.alert('Please enter email and password')
    }

    let storedAccounts = JSON.parse(localStorage.getItem('yengoAccounts') || '[]')
    
    // Migration: Convert old 'type' field to 'role' for all accounts
    storedAccounts = storedAccounts.map(account => {
      if (account.type && !account.role) {
        console.log('[App] Migrating account from type to role:', account);
        return {
          ...account,
          role: account.type === 'vendor' ? 'vendor' : 'buyer',
          type: undefined // Remove old type field
        };
      }
      return account;
    });
    
    // Save migrated accounts back to localStorage
    localStorage.setItem('yengoAccounts', JSON.stringify(storedAccounts));
    
    console.log('[App] Login attempt - stored accounts:', storedAccounts);
    const user = storedAccounts.find(u => u.email && u.email.toLowerCase() === email)

    if (!user) {
      console.log('[App] Login failed - account not found for email:', email);
      return window.alert('Account not found. Please register first.')
    }

    if (user.password !== password) {
      console.log('[App] Login failed - wrong password for email:', email);
      return window.alert('Wrong password.')
    }

    console.log('[App] Login successful - user data:', user);
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    setShowAuthPanel(false)
    setAuthForm(prev => ({ ...prev, fullName: '', email: '', phone: '', password: '', profilePicture: null, accountType: 'buyer', businessName: '', category: 'Électronique', commune: '', quartier: '', rue: '', description: '', businessImage: null, coords: null }))
  }

  const handleLogout = () => {
    // Clear authentication state
    setCurrentUser(null)
    
    // Clear all authentication-related localStorage items
    localStorage.removeItem(STORAGE_KEYS.currentUser)
    localStorage.removeItem('currentUser')
    localStorage.removeItem(STORAGE_KEYS.sessions)
    
    // Clear sessionStorage completely
    sessionStorage.clear()
    
    // Reset view mode to marketplace
    setViewMode('marketplace')
    
    // Close any open panels
    setShowAuthPanel(false)
  }

  const handleRegister = () => {
    if (authForm.accountType === 'vendor') {
      registerVendor()
    } else {
      registerCustomer()
    }
    setShowAuthPanel(false)
  }


  // ─── Monetization handlers ─────────────────────────────────
  const handleSubscribe = vendorId => {
    setVendors(prev => prev.map(v =>
      v.id === vendorId
        ? { ...v, subscription: { plan: 'pro', expiresAt: getDefaultSubscriptionExpiry(), subscribedAt: new Date().toISOString() } }
        : v
    ))
  }

  const handleBoost = (vendorId, days) => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)
    setVendors(prev => prev.map(v =>
      v.id === vendorId
        ? { ...v, boostPin: { active: true, expiresAt: expiresAt.toISOString(), boostedAt: new Date().toISOString(), days } }
        : v
    ))
  }

  const handleSetDelivery = vendorId => {
    setVendors(prev => prev.map(v =>
      v.id === vendorId
        ? { ...v, delivery: { enabled: true, feeFC: 3000, commissionRate: 0.10 } }
        : v
    ))
  }

  const handleUpdateVendorMonetization = (vendorId, patch) => {
    setVendors(prev => prev.map(v =>
      v.id === vendorId ? { ...v, ...patch } : v
    ))
  }

  // ─── End monetization handlers ─────────────────────────────

  return (
    <div className="app-shell">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Yengo+243 Dashboard</h1>
          <p className="dashboard-subtitle">MARKETPLACE CONTROL CENTER</p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn-ghost" onClick={() => setViewMode(viewMode === 'dashboard' ? 'marketplace' : 'dashboard')}>
            {viewMode === 'dashboard' ? '← Marketplace' : '→ Dashboard'}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setIsMonetizationOpen(true)}>
            💎 Monétisation
          </button>
          {currentUser ? (
            <ProfileDropdown 
              user={currentUser} 
              onLogout={handleLogout} 
              onNavigate={(target) => console.log('[App] Navigating to:', target)}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          ) : (
            <>
              <button type="button" className="btn-ghost" onClick={() => {
                setAuthMode('login')
                setShowAuthPanel(true)
              }}>
                Login
              </button>
              <button type="button" className="btn-ghost" onClick={() => {
                setAuthMode('register')
                setShowAuthPanel(true)
              }}>
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {viewMode === 'dashboard' ? (
        <main className="dashboard-main">
          {(() => {
            console.log('[App] Dashboard access check:', {
              currentUser,
              userRole: currentUser?.role,
              isVendor: currentUser?.role === 'vendor',
              viewMode
            });
            
            if (currentUser && currentUser.role === 'vendor') {
              return (
                <VendorDashboard
                  currentUser={currentUser}
                  vendors={vendors}
                  setVendors={setVendors}
                  orders={orders}
                  reviews={reviews}
                  cart={cart}
                />
              );
            } else {
              return (
                <div className="dashboard-message">
                  <h2>Vendor Dashboard</h2>
                  <p>This dashboard is only available for vendor accounts. Please register as a vendor to access this feature.</p>
                  <p>Current user role: {currentUser?.role || 'None'}</p>
                </div>
              );
            }
          })()}
        </main>
      ) : (
        <main className="app-main">
          <section className="map-panel">
            <MapView
              vendors={filteredVendors}
              selectedVendorId={selectedVendor?.id}
              onVendorSelect={vendorId => handleVendorSelection(vendorId, false)}
              markersVisible={markersVisible}
              targetCoordinate={targetCoordinate}
              targetZoom={targetZoom}
            />
          </section>

          <aside className="market-panel">
            <Marketplace
              vendors={filteredVendors}
              currentUser={currentUser}
              filters={filters}
              onFiltersChange={setFilters}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              currency={currency}
              onCurrencyChange={setCurrency}
              filteredVendors={filteredVendors}
              filteredProducts={filteredProducts}
              selectedVendor={selectedVendor}
              cart={cart}
              cartCount={cartCount}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              onOpenCart={() => setIsCartOpen(true)}
              onToggleMarkers={() => setMarkersVisible(prev => !prev)}
              markersVisible={markersVisible}
              onVendorClick={vendorId => handleVendorSelection(vendorId, true)}
              activeVendorShopId={activeVendorShopId}
              onCloseVendorShop={() => setActiveVendorShopId(null)}
              activeProduct={activeProduct}
              onOpenProduct={product => setActiveProduct(product)}
              onCloseProduct={() => setActiveProduct(null)}
              isCartOpen={isCartOpen}
              onCloseCart={() => setIsCartOpen(false)}
              onCheckout={checkoutCart}
              manageVendorId={manageVendorId}
              onManageVendor={setManageVendorId}
              onCloseManage={() => setManageVendorId(null)}
              reviews={reviews}
              onSaveReview={saveReview}
              orders={orders}
              onUpdateVendorProducts={updateVendorProducts}
            />
          </aside>
        </main>
      )}

      {isAnalyticsOpen && (
        <AnalyticsModal
          vendors={vendors}
          orders={orders}
          onClose={() => setIsAnalyticsOpen(false)}
        />
      )}

      {isMonetizationOpen && (
        <MonetizationModal
          vendors={vendors}
          orders={orders}
          onClose={() => setIsMonetizationOpen(false)}
          onSubscribe={handleSubscribe}
          onBoost={handleBoost}
          onSetDelivery={handleSetDelivery}
          onUpdateVendor={handleUpdateVendorMonetization}
        />
      )}

      {showAuthPanel && (
        <div className="modal-overlay" onClick={() => setShowAuthPanel(false)}>
          <div className="modal-panel auth-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{authMode === 'login' ? 'Login' : 'Create Account'}</h3>
              <button type="button" className="btn ghost" onClick={() => setShowAuthPanel(false)}>Fermer</button>
            </div>
            <div className="modal-body">
              <div className="auth-tabs">
                <button 
                  className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => setAuthMode('login')}
                >
                  Login
                </button>
                <button 
                  className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                  onClick={() => setAuthMode('register')}
                >
                  Register
                </button>
              </div>
              {authMode === 'login' ? (
                <div className="auth-body">
                  <div className="auth-field">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={authForm.email}
                      onChange={e => setAuthForm({...authForm, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="auth-field">
                    <label>Password</label>
                    <input 
                      type="password" 
                      value={authForm.password}
                      onChange={e => setAuthForm({...authForm, password: e.target.value})}
                      placeholder="Enter your password"
                    />
                  </div>
                  <button className="btn-primary" onClick={handleLogin}>
                    Login
                  </button>
                </div>
              ) : (
                <div className="auth-body">
                  <div className="auth-field">
                    <label>Select Account Type</label>
                    <div className="account-type-selection">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="accountType"
                          value="buyer"
                          checked={authForm.accountType === 'buyer'}
                          onChange={e => setAuthForm({...authForm, accountType: e.target.value})}
                        />
                        <span>Acheteur (Buyer)</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="accountType"
                          value="vendor"
                          checked={authForm.accountType === 'vendor'}
                          onChange={e => setAuthForm({...authForm, accountType: e.target.value})}
                        />
                        <span>Vendeur (Vendor)</span>
                      </label>
                    </div>
                  </div>
                  <div className="auth-field">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={authForm.fullName}
                      onChange={e => setAuthForm({...authForm, fullName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="auth-field">
                    <label>Profile Picture</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = () => setAuthForm({...authForm, profilePicture: reader.result})
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </div>
                  <div className="auth-field">
                    <label>Phone</label>
                    <input 
                      type="tel" 
                      value={authForm.phone}
                      onChange={e => setAuthForm({...authForm, phone: e.target.value})}
                      placeholder="+243..."
                    />
                  </div>
                  <div className="auth-field">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={authForm.email}
                      onChange={e => setAuthForm({...authForm, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="auth-field">
                    <label>Password</label>
                    <input 
                      type="password" 
                      value={authForm.password}
                      onChange={e => setAuthForm({...authForm, password: e.target.value})}
                      placeholder="Enter password (min 6 characters)"
                      minLength={6}
                    />
                  </div>
                  <div className="auth-field">
                    <label>Business Name</label>
                    <input 
                      type="text" 
                      value={authForm.businessName}
                      onChange={e => setAuthForm({...authForm, businessName: e.target.value})}
                      placeholder="Enter business name"
                    />
                  </div>
                  <div className="auth-field">
                    <label>Category</label>
                    <select 
                      value={authForm.category}
                      onChange={e => setAuthForm({...authForm, category: e.target.value})}
                    >
                      <option value="Électronique">Électronique</option>
                      <option value="Vêtements">Vêtements</option>
                      <option value="Alimentation">Alimentation</option>
                      <option value="Maison">Maison</option>
                      <option value="Beauté">Beauté</option>
                      <option value="Outillage">Outillage</option>
                    </select>
                  </div>
                  <div className="auth-field">
                    <label>Commune</label>
                    <select 
                      value={authForm.commune}
                      onChange={e => setAuthForm({...authForm, commune: e.target.value})}
                    >
                      <option value="">Select commune</option>
                      {kinshasaCommunes.map(commune => (
                        <option key={commune} value={commune}>{commune}</option>
                      ))}
                    </select>
                  </div>
                  <div className="auth-field">
                    <label>Quartier</label>
                    <select 
                      value={authForm.quartier}
                      onChange={e => setAuthForm({...authForm, quartier: e.target.value})}
                      disabled={!authForm.commune}
                    >
                      <option value="">Select quartier</option>
                      {availableQuartiers.map(quartier => (
                        <option key={quartier} value={quartier}>{quartier}</option>
                      ))}
                    </select>
                  </div>
                  <div className="auth-field">
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={handleUseMyLocation}
                      disabled={locationDetection.loading}
                    >
                      {locationDetection.loading ? 'Detecting location...' : '📍 Use My Location'}
                    </button>
                    {locationDetection.status && (
                      <div className="location-status">{locationDetection.status}</div>
                    )}
                    {locationDetection.error && (
                      <div className="location-error">{locationDetection.error}</div>
                    )}
                  </div>
                  <div className="auth-field">
                    <label>Rue (Street)</label>
                    <input 
                      type="text" 
                      value={authForm.rue}
                      onChange={e => setAuthForm({...authForm, rue: e.target.value})}
                      placeholder="Enter street name"
                    />
                  </div>
                  <div className="auth-field">
                    <label>Description</label>
                    <textarea 
                      value={authForm.description}
                      onChange={e => setAuthForm({...authForm, description: e.target.value})}
                      placeholder="Describe your business"
                      rows={3}
                    />
                  </div>
                  <div className="auth-field">
                    <label>Business Profile Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = () => setAuthForm({...authForm, businessImage: reader.result})
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </div>
                  <div className="auth-field">
                    <label>Location on Map (Click to set coordinates)</label>
                    <button 
                      type="button" 
                      className="btn-ghost" 
                      style={{ marginBottom: '8px', fontSize: '14px' }}
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            position => {
                              const { latitude, longitude } = position.coords
                              setAuthForm({...authForm, coords: [latitude, longitude]})
                              if (registrationMapInstanceRef.current) {
                                registrationMapInstanceRef.current.setView([latitude, longitude], 15)
                                if (registrationMapInstanceRef.current._marker) {
                                  registrationMapInstanceRef.current._marker.setLatLng([latitude, longitude])
                                } else {
                                  const marker = L.marker([latitude, longitude]).addTo(registrationMapInstanceRef.current)
                                  registrationMapInstanceRef.current._marker = marker
                                }
                              }
                            },
                            error => {
                              window.alert('Unable to get your location. Please enable location services.')
                            }
                          )
                        } else {
                          window.alert('Geolocation is not supported by your browser.')
                        }
                      }}
                    >
                      📍 Use my current location
                    </button>
                    <div
                      id="vendor-registration-map"
                      style={{ width: '100%', height: '250px', borderRadius: '8px', border: '1px solid #d7dee8' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      <input
                        type="text"
                        value={authForm.coords ? authForm.coords[0].toFixed(6) : ''}
                        placeholder="Latitude"
                        style={{ flex: 1, padding: '8px', border: '1px solid #d7dee8', borderRadius: '6px' }}
                        readOnly
                      />
                      <input
                        type="text"
                        value={authForm.coords ? authForm.coords[1].toFixed(6) : ''}
                        placeholder="Longitude"
                        style={{ flex: 1, padding: '8px', border: '1px solid #d7dee8', borderRadius: '6px' }}
                        readOnly
                      />
                    </div>
                  </div>
                  <button className="btn-primary" onClick={handleRegister}>
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
