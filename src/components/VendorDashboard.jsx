import React, { useMemo, useState } from 'react'

export default function VendorDashboard({ currentUser, vendors, orders, reviews, cart }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingListing, setEditingListing] = useState(null)
  const [showAddListing, setShowAddListing] = useState(false)
  const [replyToReview, setReplyToReview] = useState(null)

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
        </div>
      </div>
    )
  }

  const { vendor, mtdRevenue, activeOrders, averageRating, storeTraffic, reviewCount, totalListings, profileCompletion, subscription, vendorReviews } = vendorData

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
                  <p className="metric-value">{totalListings}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⭐</div>
                <div className="metric-content">
                  <h4>Total Reviews</h4>
                  <p className="metric-value">{reviewCount}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🌟</div>
                <div className="metric-content">
                  <h4>Average Rating</h4>
                  <p className="metric-value">{averageRating.toFixed(1)} / 5.0</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">💎</div>
                <div className="metric-content">
                  <h4>Subscription</h4>
                  <p className="metric-value">{subscription.plan?.toUpperCase() || 'FREE'}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📊</div>
                <div className="metric-content">
                  <h4>Profile Completion</h4>
                  <p className="metric-value">{profileCompletion}%</p>
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
                <div className="profile-avatar">
                  {vendor.profileImage ? (
                    <img src={vendor.profileImage} alt={vendor.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {vendor.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'VN'}
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h4>{currentUser?.fullName || 'Vendor Name'}</h4>
                  <p className="business-name">{vendor.name || 'Business Name'}</p>
                  <p className="business-category">{vendor.category || 'Category'}</p>
                </div>
                <button className="btn-primary" onClick={() => setEditingProfile(!editingProfile)}>
                  {editingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{currentUser?.email || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{currentUser?.phone || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Province:</span>
                  <span className="detail-value">{vendor.province || 'Kinshasa'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Commune:</span>
                  <span className="detail-value">{vendor.commune || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{vendor.rue || 'N/A'}</span>
                </div>
                <div className="detail-row full-width">
                  <span className="detail-label">Business Description:</span>
                  <span className="detail-value">{vendor.description || 'No description provided'}</span>
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
              {vendor.products?.map(product => (
                <div key={product.id} className="listing-card">
                  <div className="listing-image">
                    {product.image ? (
                      <img src={product.image} alt={product.title} />
                    ) : (
                      <div className="image-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="listing-info">
                    <h4>{product.title}</h4>
                    <p className="listing-price">{product.price} FC</p>
                    <p className="listing-category">{product.category}</p>
                  </div>
                  <div className="listing-actions">
                    <button className="btn-small" onClick={() => setEditingListing(product)}>Edit</button>
                    <button className="btn-small btn-danger">Delete</button>
                    <button className="btn-small">
                      {product.active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn-small">Upload Photos</button>
                  </div>
                </div>
              ))}
              {(!vendor.products || vendor.products.length === 0) && (
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
            <div className="analytics-metrics">
              <div className="metric-card">
                <div className="metric-icon">👁️</div>
                <div className="metric-content">
                  <h4>Profile Views</h4>
                  <p className="metric-value">{storeTraffic.toLocaleString()}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">👀</div>
                <div className="metric-content">
                  <h4>Listing Views</h4>
                  <p className="metric-value">{(storeTraffic * totalListings || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">👆</div>
                <div className="metric-content">
                  <h4>Total Clicks</h4>
                  <p className="metric-value">{activeOrders * 10 || 0}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📞</div>
                <div className="metric-content">
                  <h4>Phone Clicks</h4>
                  <p className="metric-value">{Math.floor(activeOrders * 3) || 0}</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">💬</div>
                <div className="metric-content">
                  <h4>WhatsApp Clicks</h4>
                  <p className="metric-value">{Math.floor(activeOrders * 5) || 0}</p>
                </div>
              </div>
            </div>
            <div className="monthly-statistics">
              <h4>Monthly Statistics</h4>
              <div className="stat-row">
                <span className="stat-label">Revenue This Month:</span>
                <span className="stat-value">{mtdRevenue.toLocaleString()} FC</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Orders This Month:</span>
                <span className="stat-value">{activeOrders}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">New Reviews This Month:</span>
                <span className="stat-value">{Math.floor(reviewCount / 2) || 0}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="dashboard-section">
            <h3>Reviews</h3>
            <div className="reviews-list">
              {vendorReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">{review.author}</span>
                      <span className="review-rating">
                        {'⭐'.repeat(review.rating)}
                      </span>
                    </div>
                    <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                  {review.reply && (
                    <div className="vendor-reply">
                      <strong>Your Reply:</strong>
                      <p>{review.reply}</p>
                    </div>
                  )}
                  {!review.reply && (
                    <button 
                      className="btn-small" 
                      onClick={() => setReplyToReview(review.id)}
                    >
                      Reply
                    </button>
                  )}
                </div>
              ))}
              {vendorReviews.length === 0 && (
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
                <h4>Current Plan: {subscription.plan?.toUpperCase() || 'FREE'}</h4>
                <p className="subscription-expiry">
                  Expiry Date: {subscription.expiresAt 
                    ? new Date(subscription.expiresAt).toLocaleDateString() 
                    : 'Never'}
                </p>
              </div>
              <div className="subscription-actions">
                <button className="btn-primary">Upgrade Plan</button>
                <button className="btn-secondary">Renew Subscription</button>
              </div>
            </div>
            <div className="plan-features">
              <h4>Plan Features</h4>
              <ul>
                <li>✓ {subscription.plan === 'pro' ? 'Unlimited' : '10'} Listings</li>
                <li>✓ {subscription.plan === 'pro' ? 'Priority' : 'Standard'} Visibility</li>
                <li>✓ {subscription.plan === 'pro' ? 'Advanced' : 'Basic'} Analytics</li>
                <li>✓ {subscription.plan === 'pro' ? '24/7' : 'Email'} Support</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="dashboard-section">
            <h3>Notifications</h3>
            <div className="notifications-list">
              <div className="notification-item unread">
                <div className="notification-icon">⭐</div>
                <div className="notification-content">
                  <p className="notification-title">New Review</p>
                  <p className="notification-text">You received a new 5-star review!</p>
                  <span className="notification-time">2 hours ago</span>
                </div>
              </div>
              <div className="notification-item unread">
                <div className="notification-icon">💬</div>
                <div className="notification-content">
                  <p className="notification-title">New Message</p>
                  <p className="notification-text">A customer sent you an inquiry about your products.</p>
                  <span className="notification-time">5 hours ago</span>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-icon">💎</div>
                <div className="notification-content">
                  <p className="notification-title">Subscription Alert</p>
                  <p className="notification-text">Your subscription expires in 30 days.</p>
                  <span className="notification-time">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-section">
            <h3>Settings</h3>
            <div className="settings-grid">
              <div className="setting-group">
                <h4>Account Settings</h4>
                <button className="btn-secondary">Change Password</button>
                <button className="btn-secondary">Change Email</button>
              </div>
              <div className="setting-group">
                <h4>Preferences</h4>
                <button className="btn-secondary">Language Preference</button>
                <button className="btn-secondary">Dark/Light Mode</button>
              </div>
              <div className="setting-group">
                <h4>Privacy</h4>
                <button className="btn-secondary">Privacy Controls</button>
              </div>
              <div className="setting-group">
                <h4>Business</h4>
                <button className="btn-secondary">Business Hours</button>
                <button className="btn-secondary">Social Media Links</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
