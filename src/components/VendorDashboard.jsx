import React, { useMemo, useState, useEffect } from 'react'
<<<<<<< HEAD
=======
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, Package, BarChart3, Star, Gem, Bell, Settings,
  CheckCircle, Clock, MessageSquare, Eye, Calendar, TrendingUp,
  Edit3, Trash2, PlusCircle, Download, FileText, Copy,
  Mail, Phone, MessageCircle, Globe, MapPin, ExternalLink,
  ChevronDown, X, ThumbsUp, AlertCircle, Info, ShoppingBag,
  CreditCard, Award, Target, Zap, Users, Activity,
  Search, Filter, MoreHorizontal, Share2, Bookmark, Heart
} from 'lucide-react'
>>>>>>> e66c1ea (Update app)
import ProfileEditModal from './dashboard/ProfileEditModal'
import ProfilePhotoModal from './dashboard/ProfilePhotoModal'
import AddListingWizard from './dashboard/AddListingWizard'
import EditListingModal from './dashboard/EditListingModal'
import DeleteListingModal from './dashboard/DeleteListingModal'
import PromoteListingModal from './dashboard/PromoteListingModal'
import ActivateListingModal from './dashboard/ActivateListingModal'
import ChangePasswordModal from './dashboard/ChangePasswordModal'
import ChangeEmailModal from './dashboard/ChangeEmailModal'
import ChangePhoneModal from './dashboard/ChangePhoneModal'
import BusinessHoursModal from './dashboard/BusinessHoursModal'
import SocialMediaModal from './dashboard/SocialMediaModal'
import PrivacyModal from './dashboard/PrivacyModal'
import ThemeModal from './dashboard/ThemeModal'
import LanguageModal from './dashboard/LanguageModal'
import SubscriptionModal from './dashboard/SubscriptionModal'
<<<<<<< HEAD
import { vendorStorage } from '../utils/storage'

// Initial placeholder data (will be replaced with localStorage data)
const INITIAL_DATA = {
  overview: {
    totalListings: 24,
    activeListings: 18,
    pendingListings: 6,
    totalReviews: 47,
    averageRating: 4.3,
    totalProfileViews: 1250,
    subscriptionStatus: 'Premium',
    membershipExpiry: '2024-12-31'
  },
  profile: {
    profilePicture: null,
    fullName: 'Jean-Pierre Mutombo',
    businessName: 'Tech Solutions Kinshasa',
    category: 'Electronics & Technology',
    email: 'techsolutions@example.com',
    phoneNumber: '+243 81 234 5678',
    whatsappNumber: '+243 81 234 5678',
    province: 'Kinshasa',
    commune: 'Lemba',
    quartier: 'Matete',
    streetAddress: 'Avenue de la Libération, 45',
    businessDescription: 'Leading provider of electronics, computers, and tech accessories in Kinshasa. We offer quality products with excellent customer service.',
    socialMediaLinks: {
      facebook: 'https://facebook.com/techsolutions',
      instagram: 'https://instagram.com/techsolutions',
      twitter: 'https://twitter.com/techsolutions'
    }
  },
  listings: [
    {
      id: 1,
      image: 'https://via.placeholder.com/300x200/1e293b/3b82f6?text=Laptop',
      businessName: 'Tech Solutions Kinshasa',
      category: 'Electronics',
      location: 'Lemba, Kinshasa',
      rating: 4.5,
      status: 'Active',
      viewCount: 342,
      title: 'HP Laptop 15.6" i5'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/300x200/1e293b/10b981?text=Phone',
      businessName: 'Tech Solutions Kinshasa',
      category: 'Electronics',
      location: 'Lemba, Kinshasa',
      rating: 4.2,
      status: 'Active',
      viewCount: 287,
      title: 'Samsung Galaxy A54'
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/300x200/1e293b/f59e0b?text=Headphones',
      businessName: 'Tech Solutions Kinshasa',
      category: 'Accessories',
      location: 'Lemba, Kinshasa',
      rating: 4.8,
      status: 'Inactive',
      viewCount: 156,
      title: 'Sony Wireless Headphones'
    }
  ],
  analytics: {
    profileViews: 1250,
    listingViews: 3420,
    phoneClicks: 89,
    whatsappClicks: 156,
    websiteClicks: 45,
    directionRequests: 67,
    monthlyGrowth: 12.5,
    mostViewedListing: 'HP Laptop 15.6" i5'
  },
  reviews: [
    {
      id: 1,
      customerName: 'Marie Nsamba',
      rating: 5,
      reviewDate: '2024-06-20',
      reviewComment: 'Excellent service! The laptop was exactly as described and delivery was fast.',
      vendorReply: 'Thank you Marie! We appreciate your business.',
      replyDate: '2024-06-21'
    },
    {
      id: 2,
      customerName: 'Pierre Mbemba',
      rating: 4,
      reviewDate: '2024-06-18',
      reviewComment: 'Good quality phone, but delivery took a bit longer than expected.',
      vendorReply: null
    },
    {
      id: 3,
      customerName: 'Anne-Marie Lukusa',
      rating: 5,
      reviewDate: '2024-06-15',
      reviewComment: 'Very professional seller. Will definitely buy again!',
      vendorReply: null
    }
  ],
  subscription: {
    currentPlan: 'Premium',
    startDate: '2024-01-01',
    expiryDate: '2024-12-31',
    remainingDays: 184,
    benefits: ['Unlimited Listings', 'Priority Visibility', 'Advanced Analytics', '24/7 Support', 'Featured Placement', 'No Commission Fees']
  },
  notifications: [
    {
      id: 1,
      type: 'review',
      title: 'New Review',
      message: 'You received a new 5-star review from Marie Nsamba!',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      message: 'A customer sent you an inquiry about HP Laptop.',
      time: '5 hours ago',
      unread: true
    },
    {
      id: 3,
      type: 'approval',
      title: 'Listing Approved',
      message: 'Your listing "Samsung Galaxy A54" has been approved.',
      time: '1 day ago',
      unread: false
    },
    {
      id: 4,
      type: 'subscription',
      title: 'Subscription Reminder',
      message: 'Your Premium subscription expires in 6 months.',
      time: '2 days ago',
      unread: false
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'New features have been added to the vendor dashboard.',
      time: '3 days ago',
      unread: false
    }
  ]
}

export default function VendorDashboard({ currentUser, vendors, setVendors, orders, reviews, cart }) {
=======
import { listingService } from '../services/listingService'
import { notificationService } from '../services/notificationService'
import { reviewService } from '../services/reviewService'
import { shouldTrackAnalytics } from '../utils/analyticsUtils'
import { useTranslation } from '../i18n/I18nProvider'

function isListingActive(listing) {
  const status = listing?.status ?? listing?.active
  if (typeof status === 'boolean') return status
  if (typeof status === 'string') return status.toLowerCase() === 'active'
  return true
}

function productToListing(product, vendor) {
  const images = product.images || (product.image ? [product.image] : [])
  return {
    ...product,
    vendorId: vendor.id,
    businessName: vendor.name,
    province: vendor.province,
    commune: vendor.commune,
    quartier: vendor.quartier,
    address: vendor.rue || vendor.street || '',
    images,
    status: product.status ?? product.active ?? true,
    rating: product.rating ?? vendor.rating ?? 0,
    viewCount: product.viewCount || 0,
    promoted: product.promoted || false
  }
}

function getVendorListings(vendor) {
  return (vendor.products || []).map(product => productToListing(product, vendor))
}

export default function VendorDashboard({ currentUser, vendors, setVendors, orders, reviews, cart, setReviews }) {
  const { t } = useTranslation()
>>>>>>> e66c1ea (Update app)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Modal states
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [showProfilePhoto, setShowProfilePhoto] = useState(false)
  const [showAddListing, setShowAddListing] = useState(false)
  const [showEditListing, setShowEditListing] = useState(false)
  const [showDeleteListing, setShowDeleteListing] = useState(false)
  const [showPromoteListing, setShowPromoteListing] = useState(false)
  const [showActivateListing, setShowActivateListing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showChangeEmail, setShowChangeEmail] = useState(false)
  const [showChangePhone, setShowChangePhone] = useState(false)
  const [showBusinessHours, setShowBusinessHours] = useState(false)
  const [showSocialMedia, setShowSocialMedia] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTheme, setShowTheme] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  
  // Data states
  const [selectedListing, setSelectedListing] = useState(null)
  const [duplicateListing, setDuplicateListing] = useState(null)
  const [vendorListings, setVendorListings] = useState([])
  const [vendorNotifications, setVendorNotifications] = useState([])
  const [vendorProfile, setVendorProfile] = useState(null)
<<<<<<< HEAD
=======
  const [dashboardReviews, setDashboardReviews] = useState(reviews || [])
>>>>>>> e66c1ea (Update app)
  const [replyToReview, setReplyToReview] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [editingReply, setEditingReply] = useState(null)
  const [editReplyText, setEditReplyText] = useState('')
  const [notificationFilter, setNotificationFilter] = useState('all')
  const [analyticsFilter, setAnalyticsFilter] = useState('month')
  
<<<<<<< HEAD
  // Load data from localStorage on mount
=======
  useEffect(() => {
    setDashboardReviews(reviews || [])
  }, [reviews])

>>>>>>> e66c1ea (Update app)
  useEffect(() => {
    if (currentUser && currentUser.role === 'vendor') {
      const vendor = vendors.find(v => v.ownerId === currentUser.id || v.id === currentUser.id)
      if (vendor) {
<<<<<<< HEAD
        // Load listings
        const listings = vendorStorage.getListings(vendor.id)
        setVendorListings(listings.length > 0 ? listings : INITIAL_DATA.listings)
        
        // Load notifications
        const notifications = vendorStorage.getNotifications(vendor.id)
        setVendorNotifications(notifications.length > 0 ? notifications : INITIAL_DATA.notifications)
        
        // Load profile
        const profile = vendorStorage.getProfile(vendor.id)
=======
        const listings = listingService.getListings(vendor.id)
        setVendorListings(listings.length > 0 ? listings : getVendorListings(vendor))
        const notifications = notificationService.getNotifications(vendor.id)
        setVendorNotifications(notifications.length > 0 ? notifications : [])
        const profile = listingService.getVendorProfile(vendor.id) || listingService.getVendor(vendor.id)
>>>>>>> e66c1ea (Update app)
        setVendorProfile(profile)
      }
    }
  }, [currentUser, vendors])

<<<<<<< HEAD
  // Debug logging for authentication
  console.log('[VendorDashboard] Authentication Check:', {
    currentUser: currentUser,
    userRole: currentUser?.role,
    isVendor: currentUser?.role === 'vendor',
    userId: currentUser?.id,
    userLabel: currentUser?.label
  });

  const vendorData = useMemo(() => {
    if (!currentUser || currentUser.role !== 'vendor') {
      console.log('[VendorDashboard] Access denied:', {
        reason: !currentUser ? 'No current user' : `User role is "${currentUser.role}", expected "vendor"`,
        currentUser
      });
      return null;
    }
    
    const vendor = vendors.find(v => v.ownerId === currentUser.id || v.id === currentUser.id)
    if (!vendor) {
      console.log('[VendorDashboard] No vendor found for user:', {
        userId: currentUser.id,
        availableVendors: vendors.map(v => ({ id: v.id, ownerId: v.ownerId, name: v.name }))
      });
      return null;
    }

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const completedOrders = orders.filter(order => 
      order.vendorId === vendor.id && 
      order.status === 'completed'
    )
    
    const mtdRevenue = completedOrders
      .filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
      })
      .reduce((sum, order) => sum + (order.amount * order.qty), 0)

    const activeOrders = Object.values(cart).filter(entry => 
      entry.product.vendorId === vendor.id
    ).length

    const vendorReviews = reviews.filter(review => review.vendorId === vendor.id)
    const averageRating = vendorReviews.length > 0
      ? vendorReviews.reduce((sum, review) => sum + review.rating, 0) / vendorReviews.length
      : 0

    const storeTraffic = vendor.viewCount || 0

    // Calculate profile completion
    const profileFields = [
      vendor.name,
      vendor.category,
      vendor.description,
      vendor.commune,
      vendor.quartier,
      vendor.rue,
      vendor.profileImage
    ]
    const completedFields = profileFields.filter(field => field && field !== '').length
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100)

    return {
      vendor,
      mtdRevenue,
      activeOrders,
      averageRating,
      storeTraffic,
      reviewCount: vendorReviews.length,
      totalListings: vendor.products?.length || 0,
      profileCompletion,
      subscription: vendor.subscription || { plan: 'free', expiresAt: null },
      vendorReviews
    }
  }, [currentUser, vendors, orders, reviews, cart])

  if (!vendorData) {
    return (
      <div className="vendor-dashboard">
        <div className="dashboard-message">
          <h2>Vendor Dashboard</h2>
          <p>This dashboard is only available for vendor accounts.</p>
=======
  const vendorData = useMemo(() => {
    if (!currentUser || currentUser.role !== 'vendor') return null
    const vendor = vendors.find(v => v.ownerId === currentUser.id || v.id === currentUser.id)
    if (!vendor) return null
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const completedOrders = orders.filter(order => order.vendorId === vendor.id && order.status === 'completed')
    const mtdRevenue = completedOrders.filter(order => { const d = new Date(order.createdAt); return d.getMonth() === currentMonth && d.getFullYear() === currentYear }).reduce((sum, order) => sum + (order.amount * order.qty), 0)
    const activeOrders = Object.values(cart).filter(entry => entry.product.vendorId === vendor.id).length
    const vendorReviews = dashboardReviews.filter(review => review.vendorId === vendor.id)
    const averageRating = vendorReviews.length > 0 ? vendorReviews.reduce((sum, review) => sum + review.rating, 0) / vendorReviews.length : 0
    const storeTraffic = vendor.viewCount || 0
    const profileFields = [vendor.name, vendor.category, vendor.description, vendor.commune, vendor.quartier, vendor.rue, vendor.profileImage]
    const completedFields = profileFields.filter(field => field && field !== '').length
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100)
    return { vendor, mtdRevenue, activeOrders, averageRating, storeTraffic, reviewCount: vendorReviews.length, totalListings: vendor.products?.length || 0, profileCompletion, subscription: vendor.subscription || { plan: 'free', expiresAt: null }, vendorReviews }
  }, [currentUser, vendors, orders, dashboardReviews, cart])

  const vendor = vendorData?.vendor
  const storeTraffic = vendorData?.storeTraffic || 0
  const subscription = vendorData?.subscription || { plan: 'free', expiresAt: null }
  const vendorReviews = vendorData?.vendorReviews || []
  
  const dynamicStats = useMemo(() => {
    const activeListings = vendorListings.filter(isListingActive).length
    const pendingListings = vendorListings.filter(listing => !isListingActive(listing)).length
    const totalViews = vendorListings.reduce((sum, l) => sum + (l.viewCount || 0), 0)
    const promotedListings = vendorListings.filter(l => l.promoted === true).length
    return { totalListings: vendorListings.length, activeListings, pendingListings, totalReviews: vendorReviews.length, averageRating: vendorReviews.length > 0 ? vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length : 0, totalProfileViews: storeTraffic, subscriptionStatus: subscription?.plan || 'Free', membershipExpiry: subscription?.expiryDate || null, totalViews, promotedListings }
  }, [vendorListings, vendorReviews, storeTraffic, subscription])

  if (!vendorData) {
    return (
      <div className="dashboard-vendor">
        <div className="dashboard-section-card">
          <h3>{t('dash.vendorDashboard')}</h3>
          <p>{t('dash.onlyVendor')}</p>
>>>>>>> e66c1ea (Update app)
        </div>
      </div>
    )
  }

<<<<<<< HEAD
  const { vendor, mtdRevenue, activeOrders, averageRating, storeTraffic, reviewCount, totalListings, profileCompletion, subscription, vendorReviews } = vendorData
  
  // Calculate dynamic statistics from real data
  const dynamicStats = useMemo(() => {
    const activeListings = vendorListings.filter(l => l.status === true).length
    const pendingListings = vendorListings.filter(l => l.status === false).length
    const totalViews = vendorListings.reduce((sum, l) => sum + (l.viewCount || 0), 0)
    const promotedListings = vendorListings.filter(l => l.promoted === true).length
    
    return {
      totalListings: vendorListings.length,
      activeListings,
      pendingListings,
      totalReviews: vendorReviews.length,
      averageRating: vendorReviews.length > 0 ? vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length : 0,
      totalProfileViews: storeTraffic,
      subscriptionStatus: subscription?.plan || 'Free',
      membershipExpiry: subscription?.expiryDate || null,
      totalViews,
      promotedListings
    }
  }, [vendorListings, vendorReviews, storeTraffic, subscription])

  // Get filtered analytics data based on time period
  const getFilteredAnalytics = () => {
    const analytics = vendorStorage.getAnalytics(vendor.id)
    const multiplier = {
      week: 0.25,
      month: 1,
      year: 12,
      custom: 1
    }[analyticsFilter] || 1
    
=======
  const getFilteredAnalytics = () => {
    const analytics = listingService.getAnalytics(vendor.id)
    const multiplier = { week: 0.25, month: 1, year: 12, custom: 1 }[analyticsFilter] || 1
>>>>>>> e66c1ea (Update app)
    return {
      profileViews: Math.round(analytics.profileViews * multiplier),
      listingViews: Math.round(analytics.listingViews * multiplier),
      phoneClicks: Math.round(analytics.phoneClicks * multiplier),
      whatsappClicks: Math.round(analytics.whatsappClicks * multiplier),
      websiteClicks: Math.round(analytics.websiteClicks * multiplier),
      directionRequests: Math.round(analytics.directionRequests * multiplier),
      monthlyGrowth: analytics.monthlyGrowth,
<<<<<<< HEAD
      mostViewedListing: vendorListings.length > 0 
        ? vendorListings.reduce((max, l) => (l.viewCount || 0) > (max.viewCount || 0) ? l : max, vendorListings[0])?.title 
        : 'N/A'
    }
  }

  // Export analytics as CSV
  const exportAnalyticsCSV = () => {
    const data = getFilteredAnalytics()
    const csvContent = [
      ['Metric', 'Value'],
      ['Profile Views', data.profileViews],
      ['Listing Views', data.listingViews],
      ['Phone Clicks', data.phoneClicks],
      ['WhatsApp Clicks', data.whatsappClicks],
      ['Website Clicks', data.websiteClicks],
      ['Direction Requests', data.directionRequests],
      ['Monthly Growth %', data.monthlyGrowth],
      ['Most Viewed Listing', data.mostViewedListing]
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${vendor.id}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export analytics as PDF (simplified - creates a text file that can be printed)
  const exportAnalyticsPDF = () => {
    const data = getFilteredAnalytics()
    const content = `
YENGO ANALYTICS REPORT
=======================
Vendor: ${vendor.name}
Date: ${new Date().toLocaleDateString()}
Period: ${analyticsFilter.toUpperCase()}

METRICS
-------
Profile Views: ${data.profileViews.toLocaleString()}
Listing Views: ${data.listingViews.toLocaleString()}
Phone Clicks: ${data.phoneClicks}
WhatsApp Clicks: ${data.whatsappClicks}
Website Clicks: ${data.websiteClicks}
Direction Requests: ${data.directionRequests}
Monthly Growth: ${data.monthlyGrowth}%
Most Viewed Listing: ${data.mostViewedListing}

Generated by Yengo Marketplace
    `.trim()
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${vendor.id}-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'listings', label: 'My Listings', icon: '📦' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'subscription', label: 'Subscription', icon: '💎' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="vendor-dashboard">
      <div className="dashboard-header">
        <h2>Vendor Dashboard</h2>
        <p className="vendor-name">{vendor.name || vendor.label}</p>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-section">
            <h3>Overview</h3>
            <div className="overview-metrics">
              <div className="metric-card">
                <div className="metric-icon">📦</div>
                <div className="metric-content">
                  <h4>Total Listings</h4>
                  <p className="metric-value">{dynamicStats.totalListings}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">✅</div>
                <div className="metric-content">
                  <h4>Active Listings</h4>
                  <p className="metric-value">{dynamicStats.activeListings}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⏳</div>
                <div className="metric-content">
                  <h4>Pending Listings</h4>
                  <p className="metric-value">{dynamicStats.pendingListings}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⭐</div>
                <div className="metric-content">
                  <h4>Total Reviews</h4>
                  <p className="metric-value">{dynamicStats.totalReviews}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🌟</div>
                <div className="metric-content">
                  <h4>Average Rating</h4>
                  <p className="metric-value">{dynamicStats.averageRating.toFixed(1)} / 5.0</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">👁️</div>
                <div className="metric-content">
                  <h4>Profile Views</h4>
                  <p className="metric-value">{dynamicStats.totalProfileViews.toLocaleString()}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">💎</div>
                <div className="metric-content">
                  <h4>Subscription</h4>
                  <p className="metric-value">{dynamicStats.subscriptionStatus}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📅</div>
                <div className="metric-content">
                  <h4>Expiry Date</h4>
                  <p className="metric-value">{dynamicStats.membershipExpiry ? new Date(dynamicStats.membershipExpiry).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="dashboard-section">
            <h3>Profile</h3>
            <div className="profile-card">
              <div className="profile-header">
                <div 
                  className="profile-avatar" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowProfilePhoto(true)}
                  title="Click to change photo"
                >
                  {(vendorProfile?.profileImage || vendor?.profileImage || currentUser?.profileImage) ? (
                    <img src={vendorProfile?.profileImage || vendor?.profileImage || currentUser?.profileImage} alt={currentUser?.fullName || vendor?.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {(currentUser?.fullName || vendor?.name || 'VN').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h4>{currentUser?.fullName || vendorProfile?.fullName || INITIAL_DATA.profile.fullName}</h4>
                  <p className="business-name">{vendor?.name || vendorProfile?.businessName || INITIAL_DATA.profile.businessName}</p>
                  <p className="business-category">{vendor?.category || vendorProfile?.category || INITIAL_DATA.profile.category}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-primary" onClick={() => setShowProfileEdit(true)}>
                    Edit Profile
                  </button>
                  <button className="btn-secondary" onClick={() => setShowProfilePhoto(true)}>
                    Change Photo
                  </button>
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{currentUser?.email || vendorProfile?.email || INITIAL_DATA.profile.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone Number:</span>
                  <span className="detail-value">{currentUser?.phone || vendorProfile?.phoneNumber || INITIAL_DATA.profile.phoneNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">WhatsApp Number:</span>
                  <span className="detail-value">{vendor?.whatsappNumber || vendorProfile?.whatsappNumber || INITIAL_DATA.profile.whatsappNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Province:</span>
                  <span className="detail-value">{vendor?.province || vendorProfile?.province || INITIAL_DATA.profile.province}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Commune:</span>
                  <span className="detail-value">{vendor?.commune || vendorProfile?.commune || INITIAL_DATA.profile.commune}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Quartier:</span>
                  <span className="detail-value">{vendor?.quartier || vendorProfile?.quartier || INITIAL_DATA.profile.quartier}</span>
                </div>
                <div className="detail-row full-width">
                  <span className="detail-label">Street Address:</span>
                  <span className="detail-value">{vendor?.rue || vendorProfile?.streetAddress || INITIAL_DATA.profile.streetAddress}</span>
                </div>
                <div className="detail-row full-width">
                  <span className="detail-label">Business Description:</span>
                  <span className="detail-value">{vendor?.description || vendorProfile?.businessDescription || INITIAL_DATA.profile.businessDescription}</span>
                </div>
                <div className="detail-row full-width">
                  <span className="detail-label">Social Media:</span>
                  <span className="detail-value">
                    {(vendor?.socialMediaLinks?.facebook || vendorProfile?.socialMediaLinks?.facebook || INITIAL_DATA.profile.socialMediaLinks.facebook) && (
                      <a href={vendor?.socialMediaLinks?.facebook || vendorProfile?.socialMediaLinks?.facebook || INITIAL_DATA.profile.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', marginRight: '12px'}}>Facebook</a>
                    )}
                    {(vendor?.socialMediaLinks?.instagram || vendorProfile?.socialMediaLinks?.instagram || INITIAL_DATA.profile.socialMediaLinks.instagram) && (
                      <a href={vendor?.socialMediaLinks?.instagram || vendorProfile?.socialMediaLinks?.instagram || INITIAL_DATA.profile.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', marginRight: '12px'}}>Instagram</a>
                    )}
                    {(vendor?.socialMediaLinks?.twitter || vendorProfile?.socialMediaLinks?.twitter || INITIAL_DATA.profile.socialMediaLinks.twitter) && (
                      <a href={vendor?.socialMediaLinks?.twitter || vendorProfile?.socialMediaLinks?.twitter || INITIAL_DATA.profile.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6'}}>Twitter</a>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="dashboard-section">
            <h3>My Listings</h3>
            <button className="btn-primary" onClick={() => setShowAddListing(true)}>
              + Add Listing
            </button>
            <div className="listings-grid">
              {vendorListings.map(listing => (
                <div key={listing.id} className="listing-card">
                  <div className="listing-image">
                    {listing.images && listing.images[0] ? (
                      <img src={listing.images[0]} alt={listing.title} />
                    ) : (
                      <div className="image-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="listing-info">
                    <h4>{listing.title}</h4>
                    <p className="listing-business">{listing.businessName || vendor?.name}</p>
                    <p className="listing-category">{listing.category}</p>
                    <p className="listing-location">📍 {listing.commune}, {listing.province}</p>
                    <p className="listing-rating">⭐ {listing.rating?.toFixed(1) || '0.0'}</p>
                    <p className={`listing-status ${listing.status ? 'active' : 'inactive'}`}>
                    {listing.status ? '✅' : '⏸️'} {listing.status ? 'Active' : 'Inactive'}
                    </p>
                    <p className="listing-views">👁️ {listing.viewCount || 0} views</p>
                    {listing.promoted && (
                      <span style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: '600' }}>⭐ Promoted</span>
                    )}
                  </div>
                  <div className="listing-actions">
                    <button className="btn-small" onClick={() => { setSelectedListing(listing); setShowEditListing(true) }}>Edit</button>
                    <button className="btn-small btn-danger" onClick={() => { setSelectedListing(listing); setShowDeleteListing(true) }}>Delete</button>
                    <button className="btn-small" onClick={() => { setSelectedListing(listing); setShowActivateListing(true) }}>
                      {listing.status ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn-small btn-promote" onClick={() => { setSelectedListing(listing); setShowPromoteListing(true) }}>Promote</button>
                  </div>
                </div>
              ))}
              {vendorListings.length === 0 && (
                <div className="empty-state">
                  <p>No listings yet. Click "Add Listing" to create your first listing.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="dashboard-section">
            <h3>Analytics</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button 
                className={`btn-small ${analyticsFilter === 'week' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setAnalyticsFilter('week')}
              >
                This Week
              </button>
              <button 
                className={`btn-small ${analyticsFilter === 'month' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setAnalyticsFilter('month')}
              >
                This Month
              </button>
              <button 
                className={`btn-small ${analyticsFilter === 'year' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setAnalyticsFilter('year')}
              >
                This Year
              </button>
              <button 
                className={`btn-small ${analyticsFilter === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setAnalyticsFilter('custom')}
              >
                Custom Range
              </button>
              <button 
                className="btn-small btn-secondary"
                onClick={exportAnalyticsCSV}
              >
                Export CSV
              </button>
              <button 
                className="btn-small btn-secondary"
                onClick={exportAnalyticsPDF}
              >
                Export PDF
              </button>
            </div>
            <div className="analytics-metrics">
              <div className="metric-card">
                <div className="metric-icon">👁️</div>
                <div className="metric-content">
                  <h4>Profile Views</h4>
                  <p className="metric-value">{getFilteredAnalytics().profileViews.toLocaleString()}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">👀</div>
                <div className="metric-content">
                  <h4>Listing Views</h4>
                  <p className="metric-value">{getFilteredAnalytics().listingViews.toLocaleString()}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📞</div>
                <div className="metric-content">
                  <h4>Phone Clicks</h4>
                  <p className="metric-value">{getFilteredAnalytics().phoneClicks}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">💬</div>
                <div className="metric-content">
                  <h4>WhatsApp Clicks</h4>
                  <p className="metric-value">{getFilteredAnalytics().whatsappClicks}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🌐</div>
                <div className="metric-content">
                  <h4>Website Clicks</h4>
                  <p className="metric-value">{getFilteredAnalytics().websiteClicks}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🗺️</div>
                <div className="metric-content">
                  <h4>Direction Requests</h4>
                  <p className="metric-value">{getFilteredAnalytics().directionRequests}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📈</div>
                <div className="metric-content">
                  <h4>Monthly Growth</h4>
                  <p className="metric-value">+{getFilteredAnalytics().monthlyGrowth}%</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🏆</div>
                <div className="metric-content">
                  <h4>Most Viewed</h4>
                  <p className="metric-value" style={{fontSize: '0.85rem'}}>{getFilteredAnalytics().mostViewedListing}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="dashboard-section">
            <h3>Reviews</h3>
            <div className="reviews-list">
              {vendorReviews.length > 0 ? vendorReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">{review.author || review.customerName}</span>
                      <span className="review-rating">
                        {'⭐'.repeat(review.rating)}
                      </span>
                    </div>
                    <span className="review-date">{new Date(review.date || review.reviewDate).toLocaleDateString()}</span>
                  </div>
                  <p className="review-text">{review.text || review.reviewComment}</p>
                  {review.reply && (
                    <div className="vendor-reply">
                      <strong>Your Reply:</strong>
                      {editingReply === review.id ? (
                        <div className="edit-reply-form">
                          <textarea
                            value={editReplyText}
                            onChange={(e) => setEditReplyText(e.target.value)}
                            placeholder="Edit your reply..."
                            rows={3}
                          />
                          <div className="reply-actions">
                            <button className="btn-primary" onClick={() => {
                              const updatedReviews = vendorReviews.map(r => 
                                r.id === review.id ? {...r, reply: editReplyText, replyDate: new Date().toISOString()} : r
                              )
                              const allReviews = JSON.parse(localStorage.getItem('yengoReactReviews') || '[]')
                              const reviewIndex = allReviews.findIndex(r => r.id === review.id)
                              if (reviewIndex !== -1) {
                                allReviews[reviewIndex] = {...allReviews[reviewIndex], reply: editReplyText, replyDate: new Date().toISOString()}
                                localStorage.setItem('yengoReactReviews', JSON.stringify(allReviews))
                              }
                              setEditingReply(null)
                              setEditReplyText('')
                            }}>
                              Update Reply
                            </button>
                            <button className="btn-secondary" onClick={() => {
                              setEditingReply(null)
                              setEditReplyText('')
                            }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p>{review.reply}</p>
                          <span className="reply-date">Replied on {new Date(review.replyDate).toLocaleDateString()}</span>
                          <div className="reply-actions" style={{ marginTop: '8px' }}>
                            <button 
                              className="btn-small" 
                              onClick={() => {
                                setEditingReply(review.id)
                                setEditReplyText(review.reply)
                              }}
                            >
                              Edit Reply
                            </button>
                            <button 
                              className="btn-small btn-danger" 
                              onClick={() => {
                                const updatedReviews = vendorReviews.map(r => 
                                  r.id === review.id ? {...r, reply: null, replyDate: null} : r
                                )
                                const allReviews = JSON.parse(localStorage.getItem('yengoReactReviews') || '[]')
                                const reviewIndex = allReviews.findIndex(r => r.id === review.id)
                                if (reviewIndex !== -1) {
                                  allReviews[reviewIndex] = {...allReviews[reviewIndex], reply: null, replyDate: null}
                                  localStorage.setItem('yengoReactReviews', JSON.stringify(allReviews))
                                }
                              }}
                            >
                              Delete Reply
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {!review.reply && (
                    <div className="reply-section">
                      {replyToReview === review.id ? (
                        <div className="reply-form">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            rows={3}
                          />
                          <div className="reply-actions">
                            <button className="btn-primary" onClick={() => {
                              review.reply = replyText
                              review.replyDate = new Date().toISOString()
                              // Update in localStorage
                              const updatedReviews = vendorReviews.map(r => 
                                r.id === review.id ? {...r, reply: replyText, replyDate: new Date().toISOString()} : r
                              )
                              const allReviews = JSON.parse(localStorage.getItem('yengoReactReviews') || '[]')
                              const reviewIndex = allReviews.findIndex(r => r.id === review.id)
                              if (reviewIndex !== -1) {
                                allReviews[reviewIndex] = {...allReviews[reviewIndex], reply: replyText, replyDate: new Date().toISOString()}
                                localStorage.setItem('yengoReactReviews', JSON.stringify(allReviews))
                              }
                              setReplyToReview(null)
                              setReplyText('')
                            }}>
                              Submit Reply
                            </button>
                            <button className="btn-secondary" onClick={() => {
                              setReplyToReview(null)
                              setReplyText('')
                            }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          className="btn-small" 
                          onClick={() => setReplyToReview(review.id)}
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )) : (
                <div className="empty-state">
                  <p>No reviews yet. Customers will be able to review your business here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="dashboard-section">
            <h3>Subscription</h3>
            <div className="subscription-card">
              <div className="subscription-info">
                <h4>Current Plan: {dynamicStats.subscriptionStatus}</h4>
                <p className="subscription-dates">
                  <span>Expiry Date: {dynamicStats.membershipExpiry ? new Date(dynamicStats.membershipExpiry).toLocaleDateString() : 'Never'}</span>
                </p>
                {dynamicStats.membershipExpiry && (
                  <p className="subscription-remaining">
                    Remaining Days: {Math.ceil((new Date(dynamicStats.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24))}
                  </p>
                )}
              </div>
              <div className="subscription-actions">
                <button className="btn-primary" onClick={() => setShowSubscription(true)}>Manage Subscription</button>
              </div>
            </div>
            <div className="plan-features">
              <h4>Plan Benefits</h4>
              <ul>
                {dynamicStats.subscriptionStatus === 'Premium' || dynamicStats.subscriptionStatus === 'Pro' ? (
                  <>
                    <li>✓ Unlimited Listings</li>
                    <li>✓ Priority Visibility</li>
                    <li>✓ Advanced Analytics</li>
                    <li>✓ 24/7 Support</li>
                    <li>✓ Featured Placement</li>
                    <li>✓ No Commission Fees</li>
                  </>
                ) : (
                  <>
                    <li>✓ 10 Listings</li>
                    <li>✓ Standard Visibility</li>
                    <li>✓ Basic Analytics</li>
                    <li>✓ Email Support</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="dashboard-section">
            <h3>Notifications</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button 
                className={`btn-small ${notificationFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setNotificationFilter('all')}
              >
                All
              </button>
              <button 
                className={`btn-small ${notificationFilter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setNotificationFilter('unread')}
              >
                Unread
              </button>
              <button 
                className={`btn-small ${notificationFilter === 'review' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setNotificationFilter('review')}
              >
                Reviews
              </button>
              <button 
                className={`btn-small ${notificationFilter === 'message' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setNotificationFilter('message')}
              >
                Messages
              </button>
              <button 
                className="btn-small btn-danger"
                onClick={() => {
                  vendorStorage.clearAllNotifications(vendor.id)
                  setVendorNotifications([])
                }}
              >
                Delete All
              </button>
            </div>
            <div className="notifications-list">
              {vendorNotifications
                .filter(n => notificationFilter === 'all' || 
                  (notificationFilter === 'unread' && n.unread) ||
                  (notificationFilter === n.type)
                )
                .map(notification => (
                <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                  <div className="notification-icon">
                    {notification.type === 'review' && '⭐'}
                    {notification.type === 'message' && '💬'}
                    {notification.type === 'approval' && '✅'}
                    {notification.type === 'subscription' && '💎'}
                    {notification.type === 'system' && '🔔'}
                  </div>
                  <div className="notification-content">
                    <p className="notification-title">{notification.title}</p>
                    <p className="notification-text">{notification.message}</p>
                    <span className="notification-time">{notification.time || new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {notification.unread && (
                      <button 
                        className="btn-small" 
                        onClick={() => {
                          vendorStorage.markNotificationRead(vendor.id, notification.id)
                          setVendorNotifications(prev => 
                            prev.map(n => n.id === notification.id ? {...n, unread: false} : n)
                          )
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => {
                        vendorStorage.deleteNotification(vendor.id, notification.id)
                        setVendorNotifications(prev => prev.filter(n => n.id !== notification.id))
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {vendorNotifications.filter(n => notificationFilter === 'all' || 
                (notificationFilter === 'unread' && n.unread) ||
                (notificationFilter === n.type)
              ).length === 0 && (
                <div className="empty-state">
                  <p>No notifications found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-section">
            <h3>Settings</h3>
            <div className="settings-grid">
              <div className="setting-group">
                <h4>Account Settings</h4>
                <button className="btn-secondary" onClick={() => setShowChangePassword(true)}>Change Password</button>
                <button className="btn-secondary" onClick={() => setShowChangeEmail(true)}>Change Email</button>
                <button className="btn-secondary" onClick={() => setShowChangePhone(true)}>Change Phone Number</button>
              </div>
              <div className="setting-group">
                <h4>Business Settings</h4>
                <button className="btn-secondary" onClick={() => setShowBusinessHours(true)}>Business Hours</button>
                <button className="btn-secondary" onClick={() => setShowSocialMedia(true)}>Social Media Links</button>
                <button className="btn-secondary" onClick={() => setShowPrivacy(true)}>Privacy Controls</button>
              </div>
              <div className="setting-group">
                <h4>App Settings</h4>
                <button className="btn-secondary" onClick={() => setShowTheme(true)}>Theme</button>
                <button className="btn-secondary" onClick={() => setShowLanguage(true)}>Language</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <ProfileEditModal
        isOpen={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
        vendor={vendor}
        currentUser={currentUser}
        onProfileUpdate={(updatedVendor, updatedUser) => {
          setVendorProfile(updatedVendor)
          // Update vendors list to reflect changes
          setVendors(prev => prev.map(v => v.id === vendor.id ? updatedVendor : v))
        }}
      />
      
      <ProfilePhotoModal
        isOpen={showProfilePhoto}
        onClose={() => setShowProfilePhoto(false)}
        vendor={vendor}
        currentUser={currentUser}
        onPhotoUpdate={(updatedVendor, updatedUser) => {
          setVendorProfile(updatedVendor)
          // Update vendors list to reflect changes
          setVendors(prev => prev.map(v => v.id === vendor.id ? updatedVendor : v))
        }}
      />
      
      <AddListingWizard
        isOpen={showAddListing}
        onClose={() => setShowAddListing(false)}
        vendor={vendor}
        onListingAdded={(newListing) => {
          setVendorListings(prev => [...prev, newListing])
          setShowAddListing(false)
        }}
      />
      
      <EditListingModal
        isOpen={showEditListing}
        onClose={() => setShowEditListing(false)}
        listing={selectedListing}
        vendor={vendor}
        onListingUpdated={(updatedListing) => {
          setVendorListings(prev => 
            prev.map(l => l.id === updatedListing.id ? updatedListing : l)
          )
          setShowEditListing(false)
        }}
      />
      
      <DeleteListingModal
        isOpen={showDeleteListing}
        onClose={() => setShowDeleteListing(false)}
        listing={selectedListing}
        vendor={vendor}
        onListingDeleted={(listingId) => {
          setVendorListings(prev => prev.filter(l => l.id !== listingId))
          setShowDeleteListing(false)
        }}
      />
      
      <PromoteListingModal
        isOpen={showPromoteListing}
        onClose={() => setShowPromoteListing(false)}
        listing={selectedListing}
        vendor={vendor}
        onListingPromoted={(updatedListing) => {
          setVendorListings(prev => 
            prev.map(l => l.id === updatedListing.id ? updatedListing : l)
          )
          setShowPromoteListing(false)
        }}
      />
      
      <ActivateListingModal
        isOpen={showActivateListing}
        onClose={() => setShowActivateListing(false)}
        listing={selectedListing}
        vendor={vendor}
        onListingStatusChanged={(updatedListing) => {
          setVendorListings(prev => 
            prev.map(l => l.id === updatedListing.id ? updatedListing : l)
          )
          setShowActivateListing(false)
        }}
      />

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        currentUser={currentUser}
        onPasswordChanged={(updatedUser) => {
          // User will be updated in localStorage by the modal
        }}
      />

      <ChangeEmailModal
        isOpen={showChangeEmail}
        onClose={() => setShowChangeEmail(false)}
        currentUser={currentUser}
        onEmailChanged={(updatedUser) => {
          // User will be updated in localStorage by the modal
        }}
      />

      <ChangePhoneModal
        isOpen={showChangePhone}
        onClose={() => setShowChangePhone(false)}
        currentUser={currentUser}
        onPhoneChanged={(updatedUser) => {
          // User will be updated in localStorage by the modal
        }}
      />

      <BusinessHoursModal
        isOpen={showBusinessHours}
        onClose={() => setShowBusinessHours(false)}
        vendor={vendor}
        onHoursUpdated={(hours) => {
          // Settings will be updated in localStorage by the modal
        }}
      />

      <SocialMediaModal
        isOpen={showSocialMedia}
        onClose={() => setShowSocialMedia(false)}
        vendor={vendor}
        onSocialMediaUpdated={(socialMedia, updatedVendor) => {
          // Settings will be updated in localStorage by the modal
        }}
      />

      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        vendor={vendor}
        onPrivacyUpdated={(privacy) => {
          // Settings will be updated in localStorage by the modal
        }}
      />

      <ThemeModal
        isOpen={showTheme}
        onClose={() => setShowTheme(false)}
        vendor={vendor}
        onThemeChanged={(theme) => {
          // Theme will be applied and saved by the modal
        }}
      />

      <LanguageModal
        isOpen={showLanguage}
        onClose={() => setShowLanguage(false)}
        vendor={vendor}
        onLanguageChanged={(language) => {
          // Language will be saved by the modal
        }}
      />

      <SubscriptionModal
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        vendor={vendor}
        onSubscriptionUpdated={(subscription) => {
          // Subscription will be updated in localStorage by the modal
        }}
      />
=======
      mostViewedListing: vendorListings.length > 0 ? vendorListings.reduce((max, l) => (l.viewCount || 0) > (max.viewCount || 0) ? l : max, vendorListings[0])?.title : 'N/A'
    }
  }

  const tabs = [
    { id: 'overview', labelKey: 'dashboard.overview', icon: LayoutDashboard },
    { id: 'listings', labelKey: 'dashboard.listings', icon: Package },
    { id: 'analytics', labelKey: 'dashboard.analytics', icon: BarChart3 },
    { id: 'reviews', labelKey: 'dashboard.reviews', icon: Star },
    { id: 'subscription', labelKey: 'dashboard.subscription', icon: Gem },
    { id: 'notifications', labelKey: 'dashboard.notifications', icon: Bell },
    { id: 'settings', labelKey: 'dashboard.settings', icon: Settings }
  ]

  const overviewMetrics = [
    { icon: Package, labelKey: 'metrics.totalListings', value: dynamicStats.totalListings, color: '#2563EB' },
    { icon: CheckCircle, labelKey: 'metrics.activeListings', value: dynamicStats.activeListings, color: '#10b981' },
    { icon: Clock, labelKey: 'metrics.pendingListings', value: dynamicStats.pendingListings, color: '#f59e0b' },
    { icon: Star, labelKey: 'metrics.totalReviews', value: dynamicStats.totalReviews, color: '#8b5cf6' },
    { icon: TrendingUp, labelKey: 'metrics.avgRating', value: `${dynamicStats.averageRating.toFixed(1)} / 5.0`, color: '#f59e0b' },
    { icon: Eye, labelKey: 'metrics.profileViews', value: dynamicStats.totalProfileViews.toLocaleString(), color: '#06b6d4' },
    { icon: Gem, labelKey: 'metrics.subscription', value: dynamicStats.subscriptionStatus, color: '#ec4899' },
    { icon: Calendar, labelKey: 'metrics.expiryDate', value: dynamicStats.membershipExpiry ? new Date(dynamicStats.membershipExpiry).toLocaleDateString() : t('dash.never'), color: '#64748b' }
  ]

  const analyticsMetrics = [
    { icon: Eye, labelKey: 'metrics.profileViews', getValue: () => getFilteredAnalytics().profileViews.toLocaleString() },
    { icon: Eye, labelKey: 'metrics.totalViews', getValue: () => getFilteredAnalytics().listingViews.toLocaleString() },
    { icon: Phone, labelKey: 'dash.phoneNumber', getValue: () => getFilteredAnalytics().phoneClicks },
    { icon: MessageCircle, labelKey: 'dash.whatsapp', getValue: () => getFilteredAnalytics().whatsappClicks },
    { icon: Globe, labelKey: 'dash.website', getValue: () => getFilteredAnalytics().websiteClicks },
    { icon: MapPin, labelKey: 'dash.directionRequests', getValue: () => getFilteredAnalytics().directionRequests },
    { icon: TrendingUp, labelKey: 'dash.monthlyGrowth', getValue: () => `+${getFilteredAnalytics().monthlyGrowth}%` },
    { icon: Target, labelKey: 'dash.mostViewed', getValue: () => getFilteredAnalytics().mostViewedListing }
  ]

  const notificationTypeIcons = { review: Star, message: MessageCircle, approval: ThumbsUp, subscription: Gem, system: Bell }
  const notificationTypeColors = { review: '#8b5cf6', message: '#2563EB', approval: '#10b981', subscription: '#ec4899', system: '#f59e0b' }

  const sectionVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.15, ease: 'easeIn' } }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div key="overview" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <div className="dashboard-section-card">
              <h3>{t('dashboard.overview')}</h3>
              <div className="dashboard-metrics-grid">
                {overviewMetrics.map((metric, i) => (
                  <div key={i} className="dashboard-metric-card">
                    <div className="metric-icon" style={{ color: metric.color }}>
                      <metric.icon size={20} />
                    </div>
                    <div className="metric-content">
                      <h4>{t(metric.labelKey)}</h4>
                      <p className="metric-value">{metric.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'listings':
        return (
          <motion.div key="listings" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <div className="dashboard-section-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>{t('dashboard.listings')}</h3>
                <button className="btn btn-primary" onClick={() => setShowAddListing(true)}>
                  <PlusCircle size={16} /> {t('dash.addListing')}
                </button>
              </div>
              <div className="dashboard-listings-grid">
                {vendorListings.map(listing => (
                  <div key={listing.id} className="dashboard-listing-card">
                    <div className="listing-image">
                      {listing.coverImage || listing.images?.[0] ? (
                        <img src={listing.coverImage || listing.images[0]} alt={listing.title} />
                      ) : (
                        <div className="image-placeholder">{t('dash.noImage')}</div>
                      )}
                    </div>
                    <div className="listing-info">
                      <h4>{listing.title}</h4>
                      <p>{listing.businessName || vendor?.name}</p>
                      <p>{listing.category}</p>
                      <p><MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {listing.commune}, {listing.province}</p>
                      <p><Star size={12} style={{ display: 'inline', verticalAlign: 'middle', color: '#f59e0b' }} /> {listing.rating?.toFixed(1) || '0.0'}</p>
                      <p style={{ color: isListingActive(listing) ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                        {isListingActive(listing) ? t('dash.active') : t('dash.inactive')}
                      </p>
                      <p><Eye size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {listing.viewCount || 0} {t('dash.views')}</p>
                      {listing.promoted && (
                        <span style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Zap size={12} /> {t('dash.promoted')}
                        </span>
                      )}
                    </div>
                    <div className="listing-actions">
                      <button className="btn btn-sm" onClick={() => { setSelectedListing(listing); setShowEditListing(true) }}>
                        <Edit3 size={12} /> {t('listing.edit')}
                      </button>
                      <button className="btn btn-sm" style={{ color: '#ef4444', borderColor: '#fecaca' }} onClick={() => { setSelectedListing(listing); setShowDeleteListing(true) }}>
                        <Trash2 size={12} /> {t('listing.delete')}
                      </button>
                      <button className="btn btn-sm" onClick={() => { setSelectedListing(listing); setShowActivateListing(true) }}>
                        {isListingActive(listing) ? t('listing.deactivate') : t('listing.activate')}
                      </button>
                      <button className="btn btn-sm" style={{ color: '#8b5cf6', borderColor: '#ddd6fe' }} onClick={() => { setSelectedListing(listing); setShowPromoteListing(true) }}>
                        <Zap size={12} /> {t('listing.promote')}
                      </button>
                      <button className="btn btn-sm" style={{ color: '#2563EB', borderColor: '#bfdbfe' }} onClick={() => { setDuplicateListing(listing); setShowAddListing(true) }} title={t('editListing.duplicateTooltip')}>
                        <Copy size={12} /> {t('editListing.duplicate')}
                      </button>
                    </div>
                  </div>
                ))}
                {vendorListings.length === 0 && (
                  <div className="dashboard-empty-state">
                    <Package size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <p>{t('dash.noListings')}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )

      case 'analytics':
        return (
          <motion.div key="analytics" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <div className="dashboard-section-card">
              <h3>{t('dashboard.analytics')}</h3>
              <div className="dashboard-filter-row">
                {['week', 'month', 'year', 'custom'].map(f => (
                  <button key={f} className={`btn btn-sm ${analyticsFilter === f ? 'active' : ''}`} onClick={() => setAnalyticsFilter(f)}>
                    {f === 'week' ? t('dash.thisWeek') : f === 'month' ? t('dash.thisMonth') : f === 'year' ? t('dash.thisYear') : t('dash.customRange')}
                  </button>
                ))}
                <div style={{ flex: 1 }} />
                <button className="btn btn-sm btn-ghost" onClick={() => { /* CSV export */ }}>
                  <Download size={14} /> {t('dash.csv')}
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => { /* Report export */ }}>
                  <FileText size={14} /> {t('dash.report')}
                </button>
              </div>
              <div className="dashboard-analytics-grid">
                {analyticsMetrics.map((metric, i) => (
                  <div key={i} className="dashboard-metric-card">
                    <div className="metric-icon" style={{ color: '#2563EB' }}>
                      <metric.icon size={20} />
                    </div>
                    <div className="metric-content">
                      <h4>{t(metric.labelKey)}</h4>
                      <p className="metric-value">{metric.getValue()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'reviews':
        return (
          <motion.div key="reviews" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <div className="dashboard-section-card">
              <h3>{t('dashboard.reviews')}</h3>
              <div className="dashboard-reviews-list">
                {vendorReviews.length > 0 ? vendorReviews.map(review => (
                  <div key={review.id} className="dashboard-review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <span className="reviewer-name">{review.author || review.customerName}</span>
                        <span className="review-rating">{Array.from({ length: review.rating }, (_, i) => '⭐').join('')}</span>
                      </div>
                      <span className="review-date">{new Date(review.date || review.reviewDate).toLocaleDateString()}</span>
                    </div>
                    <p className="review-text">{review.text || review.reviewComment}</p>
                    {review.reply && (
                      <div className="vendor-reply">
                        <strong>{t('dash.yourReply')}</strong>
                        {editingReply === review.id ? (
                          <div className="edit-reply-form">
                            <textarea value={editReplyText} onChange={(e) => setEditReplyText(e.target.value)} placeholder={t('dash.yourReply')} rows={3} />
                            <div className="reply-actions">
                              <button className="btn btn-sm btn-primary" onClick={() => { const ur = reviewService.updateReview(review.id, { reply: editReplyText, replyDate: new Date().toISOString() }); const nr = dashboardReviews.map(r => r.id === review.id ? { ...r, ...ur } : r); setDashboardReviews(nr); if (setReviews) setReviews(prev => prev.map(r => r.id === review.id ? { ...r, ...ur } : r)); setEditingReply(null); setEditReplyText('') }}>{t('dash.update')}</button>
                              <button className="btn btn-sm btn-ghost" onClick={() => { setEditingReply(null); setEditReplyText('') }}>{t('dash.cancel')}</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p>{review.reply}</p>
                            <span className="reply-date">{t('dash.replyDate')} {new Date(review.replyDate).toLocaleDateString()}</span>
                            <div className="reply-actions">
                              <button className="btn btn-sm" onClick={() => { setEditingReply(review.id); setEditReplyText(review.reply) }}>{t('dash.editReply')}</button>
                              <button className="btn btn-sm" style={{ color: '#ef4444', borderColor: '#fecaca' }} onClick={() => { const ur = reviewService.updateReview(review.id, { reply: null, replyDate: null }); const nr = dashboardReviews.map(r => r.id === review.id ? { ...r, ...ur } : r); setDashboardReviews(nr); if (setReviews) setReviews(prev => prev.map(r => r.id === review.id ? { ...r, ...ur } : r)) }}>{t('dash.deleteReply')}</button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {!review.reply && (
                      <div className="reply-section">
                        {replyToReview === review.id ? (
                          <div className="reply-form">
                            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={t('dash.yourReply')} rows={3} />
                            <div className="reply-actions">
                              <button className="btn btn-sm btn-primary" onClick={() => { const ur = reviewService.updateReview(review.id, { reply: replyText, replyDate: new Date().toISOString() }); const nr = dashboardReviews.map(r => r.id === review.id ? { ...r, ...ur } : r); setDashboardReviews(nr); if (setReviews) setReviews(prev => prev.map(r => r.id === review.id ? { ...r, ...ur } : r)); setReplyToReview(null); setReplyText('') }}>{t('dash.submit')}</button>
                              <button className="btn btn-sm btn-ghost" onClick={() => { setReplyToReview(null); setReplyText('') }}>{t('dash.cancel')}</button>
                            </div>
                          </div>
                        ) : (
                          <button className="btn btn-sm" onClick={() => setReplyToReview(review.id)}>
                            <MessageCircle size={14} /> {t('dash.reply')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="dashboard-empty-state">
                    <Star size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <p>{t('dash.noReviews')}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )

      case 'subscription':
        return (
          <motion.div key="subscription" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <div className="dashboard-section-card">
              <h3>{t('dashboard.subscription')}</h3>
              <div className="dashboard-subscription-card">
                <div className="subscription-info">
                  <h4>{t('dash.currentPlan')} {dynamicStats.subscriptionStatus}</h4>
                  <p><Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {t('dash.expiry')} {dynamicStats.membershipExpiry ? new Date(dynamicStats.membershipExpiry).toLocaleDateString() : t('dash.never')}</p>
                  {dynamicStats.membershipExpiry && (
                    <p><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {t('dash.remaining')} {Math.ceil((new Date(dynamicStats.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24))} {t('dash.days')}</p>
                  )}
                </div>
                <div className="subscription-actions">
                  <button className="btn btn-primary" onClick={() => setShowSubscription(true)}>
                    <Gem size={16} /> {t('dash.manageSubscription')}
                  </button>
                </div>
              </div>
              <div className="dashboard-plan-features">
                <h4>{t('dash.planBenefits')}</h4>
                <ul>
                  {(dynamicStats.subscriptionStatus === 'Premium' || dynamicStats.subscriptionStatus === 'Pro' || dynamicStats.subscriptionStatus === 'premium' || dynamicStats.subscriptionStatus === 'pro') ? (
                    <>
                      <li><CheckCircle size={14} style={{ color: '#10b981', marginRight: 6, verticalAlign: 'middle' }} /> {t('dash.unlimitedListings')}</li>
                      <li><CheckCircle size={14} style={{ color: '#10b981', marginRight: 6, verticalAlign: 'middle' }} /> {t('dash.priorityVisibility')}</li>
                      <li><CheckCircle size={14} style={{ color: '#10b981', marginRight: 6, verticalAlign: 'middle' }} /> {t('dash.advancedAnalytics')}</li>
                      <li><CheckCircle size={14} style={{ color: '#10b981', marginRight: 6, verticalAlign: 'middle' }} /> {t('dash.support247')}</li>
                      <li><CheckCircle size={14} style={{ color: '#10b981', marginRight: 6, verticalAlign: 'middle' }} /> {t('dash.featuredPlacement')}</li>
                      <li><CheckCircle size={14} style={{ color: '#10b981', marginRight: 6, verticalAlign: 'middle' }} /> {t('dash.noCommission')}</li>
                    </>
                  ) : (
                    <>
                      <li><CheckCircle size={14} style={{ color: '#10b981', marginRight: 6, verticalAlign: 'middle' }} /> {t('dash.tenListings')}</li>
                      <li><CheckCircle size={14} style={{ color: '#10b981', marginRight: 6, verticalAlign: 'middle' }} /> {t('dash.standardVisibility')}</li>
                      <li><CheckCircle size={14} style={{ color: '#10b981', marginRight: 6, verticalAlign: 'middle' }} /> {t('dash.basicAnalytics')}</li>
                      <li><CheckCircle size={14} style={{ color: '#10b981', marginRight: 6, verticalAlign: 'middle' }} /> {t('dash.emailSupport')}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )

      case 'notifications':
        return (
          <motion.div key="notifications" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <div className="dashboard-section-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>{t('dashboard.notifications')}</h3>
                <button className="btn btn-sm" style={{ color: '#ef4444', borderColor: '#fecaca' }} onClick={() => { notificationService.clearAllNotifications(vendor.id); setVendorNotifications([]) }}>
                  <Trash2 size={14} /> {t('dash.deleteAll')}
                </button>
              </div>
              <div className="dashboard-filter-row">
                {[{ id: 'all', labelKey: 'dash.all' }, { id: 'unread', labelKey: 'dash.unread' }, { id: 'review', labelKey: 'dash.messages' }, { id: 'message', labelKey: 'dash.messages' }].map(f => (
                  <button key={f.id} className={`btn btn-sm ${notificationFilter === f.id ? 'active' : ''}`} onClick={() => setNotificationFilter(f.id)}>{t(f.labelKey)}</button>
                ))}
              </div>
              <div className="dashboard-notifications-list">
                {vendorNotifications.filter(n => notificationFilter === 'all' || (notificationFilter === 'unread' && n.unread) || (notificationFilter === n.type)).map(notification => {
                  const NotifIcon = notificationTypeIcons[notification.type] || Bell
                  const notifColor = notificationTypeColors[notification.type] || '#64748b'
                  return (
                    <div key={notification.id} className={`dashboard-notification-item ${notification.unread ? 'unread' : ''}`}>
                      <div className="notification-icon" style={{ color: notifColor }}><NotifIcon size={18} /></div>
                      <div className="notification-content">
                        <p className="notification-title">{notification.title}</p>
                        <p className="notification-text">{notification.message}</p>
                        <span className="notification-time">{notification.time || new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        {notification.unread && (
                          <button className="btn btn-sm" onClick={() => { notificationService.markNotificationRead(vendor.id, notification.id); setVendorNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, unread: false } : n)) }}>
                            {t('dash.markRead')}
                          </button>
                        )}
                        <button className="btn btn-sm" style={{ color: '#ef4444', borderColor: '#fecaca' }} onClick={() => { notificationService.deleteNotification(vendor.id, notification.id); setVendorNotifications(prev => prev.filter(n => n.id !== notification.id)) }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  )
                })}
                {vendorNotifications.filter(n => notificationFilter === 'all' || (notificationFilter === 'unread' && n.unread) || (notificationFilter === n.type)).length === 0 && (
                  <div className="dashboard-empty-state">
                    <Bell size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <p>{t('dash.noNotifications')}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )

      case 'settings':
        return (
          <motion.div key="settings" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <div className="dashboard-section-card">
              <h3>{t('dashboard.settings')}</h3>
              <div className="dashboard-settings-grid">
                <div className="dashboard-setting-group">
                  <h4>{t('dash.accountSettings')}</h4>
                  <button onClick={() => setShowChangePassword(true)}><Settings size={14} /> {t('settings.changePassword')}</button>
                  <button onClick={() => setShowChangeEmail(true)}><Mail size={14} /> {t('settings.changeEmail')}</button>
                  <button onClick={() => setShowChangePhone(true)}><Phone size={14} /> {t('settings.changePhone')}</button>
                </div>
                <div className="dashboard-setting-group">
                  <h4>{t('dash.businessSettings')}</h4>
                  <button onClick={() => setShowBusinessHours(true)}><Clock size={14} /> {t('settings.businessHours')}</button>
                  <button onClick={() => setShowSocialMedia(true)}><Share2 size={14} /> {t('settings.socialMedia')}</button>
                  <button onClick={() => setShowPrivacy(true)}><Eye size={14} /> {t('settings.privacy')}</button>
                </div>
                <div className="dashboard-setting-group">
                  <h4>{t('dash.appSettings')}</h4>
                  <button onClick={() => setShowTheme(true)}><Activity size={14} /> {t('settings.theme')}</button>
                  <button onClick={() => setShowLanguage(true)}><Globe size={14} /> {t('settings.language')}</button>
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="dashboard-vendor">
      <h2>{t('dash.vendorDashboard')}</h2>
      <p className="vendor-name">{vendor.name || vendor.label}</p>

      <div className="dashboard-tabs-pill">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} className={`dashboard-tab-pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <Icon size={16} />
              <span>{t(tab.labelKey)}</span>
            </button>
          )
        })}
      </div>

      <div className="dashboard-content">
        <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
      </div>
      
      {/* Modals */}
      <ProfileEditModal isOpen={showProfileEdit} onClose={() => setShowProfileEdit(false)} vendor={vendor} currentUser={currentUser} onProfileUpdate={(updatedVendor, updatedUser) => { setVendorProfile(updatedVendor); setVendors(prev => prev.map(v => v.id === vendor.id ? updatedVendor : v)) }} />
      <ProfilePhotoModal isOpen={showProfilePhoto} onClose={() => setShowProfilePhoto(false)} vendor={vendor} currentUser={currentUser} onPhotoUpdate={(updatedVendor, updatedUser) => { setVendorProfile(updatedVendor); setVendors(prev => prev.map(v => v.id === vendor.id ? updatedVendor : v)) }} />
      <AddListingWizard isOpen={showAddListing} onClose={() => { setShowAddListing(false); setDuplicateListing(null) }} vendor={vendor} duplicateFrom={duplicateListing} onListingAdded={(newListing) => { setVendorListings(prev => [...prev, newListing]); setShowAddListing(false); setDuplicateListing(null) }} />
      <EditListingModal isOpen={showEditListing} onClose={() => setShowEditListing(false)} listing={selectedListing} listingData={null} onUpdated={(updatedListing) => { setVendorListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l)); setShowEditListing(false) }} />
      <DeleteListingModal isOpen={showDeleteListing} onClose={() => setShowDeleteListing(false)} listing={selectedListing} onDeleted={(listingId) => { setVendorListings(prev => prev.filter(l => l.id !== listingId)); setShowDeleteListing(false) }} />
      <PromoteListingModal isOpen={showPromoteListing} onClose={() => setShowPromoteListing(false)} listing={selectedListing} vendor={vendor} onListingPromoted={(updatedListing) => { setVendorListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l)); setShowPromoteListing(false) }} />
      <ActivateListingModal isOpen={showActivateListing} onClose={() => setShowActivateListing(false)} listing={selectedListing} vendor={vendor} onListingStatusChanged={(updatedListing) => { setVendorListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l)); setShowActivateListing(false) }} />
      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} currentUser={currentUser} onPasswordChanged={() => {}} />
      <ChangeEmailModal isOpen={showChangeEmail} onClose={() => setShowChangeEmail(false)} currentUser={currentUser} onEmailChanged={() => {}} />
      <ChangePhoneModal isOpen={showChangePhone} onClose={() => setShowChangePhone(false)} currentUser={currentUser} onPhoneChanged={() => {}} />
      <BusinessHoursModal isOpen={showBusinessHours} onClose={() => setShowBusinessHours(false)} vendor={vendor} onHoursUpdated={() => {}} />
      <SocialMediaModal isOpen={showSocialMedia} onClose={() => setShowSocialMedia(false)} vendor={vendor} onSocialMediaUpdated={() => {}} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} vendor={vendor} onPrivacyUpdated={() => {}} />
      <ThemeModal isOpen={showTheme} onClose={() => setShowTheme(false)} vendor={vendor} onThemeChanged={() => {}} />
      <LanguageModal isOpen={showLanguage} onClose={() => setShowLanguage(false)} vendor={vendor} onLanguageChanged={() => {}} />
      <SubscriptionModal isOpen={showSubscription} onClose={() => setShowSubscription(false)} vendor={vendor} onSubscriptionUpdated={() => {}} />
>>>>>>> e66c1ea (Update app)
    </div>
  )
}
