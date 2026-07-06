import React, { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Heart, Share2, Navigation, ShoppingCart, Store, Edit3, BarChart3, Package, Star, Eye, PlusCircle, MessageCircle } from 'lucide-react'
import { shouldTrackAnalytics } from '../utils/analyticsUtils'
import { useTranslation } from '../i18n/I18nProvider'
import { getVendorLocationDisplay, getVendorLocationFull, getLocationById } from '../utils/locationUtils'
import { subcategoryService } from '../services/subcategoryService'
import { getCategoryConfig, getCategoryColor } from '../data/categoryConfig'

function formatPrice(value, currency) {
  if (currency === 'FC') return `${Number(value || 0).toFixed(0)} FC`
  return `$${Number(value || 0).toFixed(2)}`
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
}

function getVendorImage(vendor) {
  const productImage = vendor.products?.find(p => p.image)?.image
  if (vendor.profileImage) return vendor.profileImage
  if (productImage) return productImage
  const title = esc(vendor.name || 'Yengo+243')
  const category = esc(vendor.category || 'Boutique')
  const color = getCategoryColor(vendor.category)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="240" viewBox="0 0 420 240">
      <rect width="420" height="240" fill="#eef6ff"/>
      <rect x="50" y="66" width="320" height="130" rx="14" fill="#ffffff"/>
      <rect x="74" y="94" width="272" height="74" rx="8" fill="${color}" opacity=".14"/>
      <path d="M94 80h232l20 36H74z" fill="${color}"/>
      <text x="210" y="52" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#0f172a">${title}</text>
      <text x="210" y="222" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#334155">${category}</text>
    </svg>
  `
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function StarRating({ rating }) {
  const stars = Math.round(rating || 0)
  return <span className="business-drawer-stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
}

export default function BusinessDetailsDrawer({
  vendor = null,
  reviews = [],
  isOpen = false,
  onClose = () => {},
  addToCart = () => {},
  currency = '$',
  currentUser = null,
  favorites = {},
  onToggleFavorite = null,
  // ─── Seller-only callbacks ───
  onManageStore = null,
  onEditBusiness = null,
  onAddProduct = null,
  onViewDashboard = null,
  orders = []
}) {
  const { t } = useTranslation()

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const directionsUrl = useMemo(() => {
    if (!vendor?.coords) return null
    const [lat, lng] = vendor.coords
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  }, [vendor])

  // Determine if the current user is the owner of this vendor
  const isOwner = useMemo(() => {
    if (!currentUser || !vendor) return false
    if (currentUser.role !== 'vendor') return false
    return vendor.ownerId === currentUser.id || vendor.id === currentUser.id
  }, [currentUser, vendor])

  // Seller analytics (computed only when isOwner)
  const sellerAnalytics = useMemo(() => {
    if (!vendor) return null
    const vendorOrders = orders.filter(o => o.vendorId === vendor.id)
    const completedOrders = vendorOrders.filter(o => o.status === 'completed')
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.amount || 0) * (o.qty || 0), 0)
    return {
      totalProducts: vendor.products?.length || 0,
      totalOrders: vendorOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue,
      totalViews: vendor.viewCount || 0,
      totalReviews: reviews.filter(r => r.vendorId === vendor.id).length
    }
  }, [vendor, orders, reviews])

  if (!vendor) return null

  const products = vendor.products || []
  const vendorReviews = reviews.filter(r => r.vendorId === vendor.id)

  // ─── WhatsApp helpers (moved after early return — no hooks below this point) ───
  const whatsappNumber = vendor.whatsappNumber || vendor.phoneNumber || null
  const hasWhatsapp = !!whatsappNumber

  const whatsappUrl = !hasWhatsapp
    ? null
    : (() => {
        const cleanNum = String(whatsappNumber).replace(/[^0-9]/g, '')
        const defaultMsg = `Hello ${vendor.name}!%0A%0AI found your business on Yengo%2B243 and I'm interested in your products/services.%0A%0ACould you please provide more information?%0A%0AThank you.`
        return `https://wa.me/${cleanNum}?text=${defaultMsg}`
      })()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="business-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer Panel — keyed on vendor.id so switching vendors triggers a fresh animation */}
          <motion.div
            key={vendor.id}
            className="business-drawer"
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -36 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="business-drawer-inner">

              {/* ───── HEADER ───── */}
              <div className="business-drawer-header">
                <div className="business-drawer-header-info">
                  <h2 className="business-drawer-name">{vendor.name}</h2>
                  <div className="business-drawer-meta">
                    <span
                      className="business-drawer-category-pill"
                      style={{ background: getCategoryColor(vendor.category), color: '#fff' }}
                    >
                      {vendor.category}
                    </span>
                    <span className="business-drawer-rating">
                      <StarRating rating={vendor.rating} />
                      <span className="business-drawer-rating-value">
                        {(vendor.rating || 0).toFixed(1)}
                      </span>
                    </span>
                  </div>
                  {/* Subcategory pill (if vendor has one) */}
                  {(() => {
                    const firstProduct = vendor.products?.[0]
                    const sc = firstProduct?.subcategoryId
                      ? subcategoryService.getById(firstProduct.subcategoryId)
                      : null
                    if (!sc) return null
                    return (
                      <div style={{ marginTop: 6 }}>
                        <span
                          className="business-drawer-category-pill"
                          style={{
                            background: sc.markerColor || '#6b7280',
                            color: '#fff',
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: 6
                          }}
                        >
                          {sc.name}
                        </span>
                      </div>
                    )
                  })()}
                </div>
                <button className="business-drawer-close-btn" onClick={onClose} aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              {/* ───── WHATSAPP BUTTON ───── */}
              <div className="business-drawer-whatsapp">
                {hasWhatsapp ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="business-drawer-whatsapp-btn"
                  >
                    <MessageCircle size={20} />
                    <span>{t('business.chatOnWhatsapp', 'Chat on WhatsApp')}</span>
                  </a>
                ) : (
                  <button
                    className="business-drawer-whatsapp-btn business-drawer-whatsapp-disabled"
                    disabled
                    title={t('business.whatsappNotAvailable', 'WhatsApp not available.')}
                  >
                    <MessageCircle size={20} />
                    <span>{t('business.whatsappNotAvailable', 'WhatsApp not available.')}</span>
                  </button>
                )}
              </div>

              {/* ───── HERO IMAGE ───── */}
              <div className="business-drawer-hero">
                <img src={getVendorImage(vendor)} alt={vendor.name} />
              </div>

              {/* ───── DESCRIPTION + LOCATION ───── */}
              <div className="business-drawer-section">
                <p className="business-drawer-description">{vendor.description}</p>
                <div className="business-drawer-location">
                  <MapPin size={16} className="business-drawer-location-icon" />
                  <span>
                    {getVendorLocationDisplay(vendor)} · {getLocationById(vendor.locationId)?.province || vendor.province}
                  </span>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════
                  SELLER-ONLY SECTION — analytics + actions
                  shown only when the current user owns this vendor
                  ═══════════════════════════════════════════════ */}
              {isOwner && sellerAnalytics && (
                <div className="business-drawer-section">
                  <h3 className="business-drawer-section-title">
                    <Store size={16} />
                    <span>{t('drawer.sellerPanel', 'Seller Panel')}</span>
                  </h3>

                  {/* Mini stats */}
                  <div className="drawer-seller-stats">
                    <div className="drawer-seller-stat">
                      <Package size={14} />
                      <div className="drawer-seller-stat-body">
                        <span className="drawer-seller-stat-value">{sellerAnalytics.totalProducts}</span>
                        <span className="drawer-seller-stat-label">{t('drawer.products', 'Products')}</span>
                      </div>
                    </div>
                    <div className="drawer-seller-stat">
                      <Eye size={14} />
                      <div className="drawer-seller-stat-body">
                        <span className="drawer-seller-stat-value">{sellerAnalytics.totalViews}</span>
                        <span className="drawer-seller-stat-label">{t('drawer.views', 'Views')}</span>
                      </div>
                    </div>
                    <div className="drawer-seller-stat">
                      <ShoppingCart size={14} />
                      <div className="drawer-seller-stat-body">
                        <span className="drawer-seller-stat-value">{sellerAnalytics.totalOrders}</span>
                        <span className="drawer-seller-stat-label">{t('drawer.orders', 'Orders')}</span>
                      </div>
                    </div>
                    <div className="drawer-seller-stat">
                      <Star size={14} />
                      <div className="drawer-seller-stat-body">
                        <span className="drawer-seller-stat-value">{sellerAnalytics.totalReviews}</span>
                        <span className="drawer-seller-stat-label">{t('drawer.reviews', 'Reviews')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seller action buttons */}
                  <div className="drawer-seller-actions">
                    {onViewDashboard && (
                      <button
                        className="btn btn-sm btn-primary drawer-seller-action"
                        onClick={() => { onViewDashboard(); onClose() }}
                      >
                        <BarChart3 size={14} />
                        <span>{t('drawer.dashboard', 'Dashboard')}</span>
                      </button>
                    )}
                    {onManageStore && (
                      <button
                        className="btn btn-sm drawer-seller-action"
                        onClick={() => { onManageStore(vendor.id); onClose() }}
                      >
                        <Store size={14} />
                        <span>{t('drawer.manageStore', 'Manage Store')}</span>
                      </button>
                    )}
                    {onEditBusiness && (
                      <button
                        className="btn btn-sm drawer-seller-action"
                        onClick={() => { onEditBusiness(vendor.id); onClose() }}
                      >
                        <Edit3 size={14} />
                        <span>{t('drawer.editBusiness', 'Edit Business')}</span>
                      </button>
                    )}
                    {onAddProduct && (
                      <button
                        className="btn btn-sm drawer-seller-action"
                        onClick={() => { onAddProduct(vendor.id); onClose() }}
                      >
                        <PlusCircle size={14} />
                        <span>{t('drawer.addProduct', 'Add Product')}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ───── PRODUCTS (max 6) ───── */}
              <div className="business-drawer-section">
                <h3 className="business-drawer-section-title">
                  {t('modal.products', 'Products')}
                </h3>
                {products.length === 0 ? (
                  <p className="business-drawer-empty">
                    {t('business.noProducts', 'No products available yet.')}
                  </p>
                ) : (
                  <div className="business-drawer-products">
                    {products.slice(0, 6).map(product => (
                      <div key={product.id} className="business-drawer-product">
                        <img
                          src={product.image || ''}
                          alt={product.title}
                          className="business-drawer-product-img"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                        <div className="business-drawer-product-body">
                          <div className="business-drawer-product-title">{product.title}</div>
                          <div className="business-drawer-product-price">
                            {formatPrice(product.price, currency)}
                          </div>
                        </div>
                        <button
                          className="business-drawer-product-add"
                          onClick={() =>
                            addToCart({
                              ...product,
                              vendorId: vendor.id,
                              vendorName: vendor.name
                            })
                          }
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    ))}
                    {products.length > 6 && (
                      <p className="business-drawer-more">
                        +{products.length - 6} more products
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* ───── REVIEWS (max 5) ───── */}
              <div className="business-drawer-section">
                <h3 className="business-drawer-section-title">
                  {t('modal.reviews', 'Reviews')}
                </h3>
                {vendorReviews.length === 0 ? (
                  <p className="business-drawer-empty">
                    {t('business.noReviews', 'No reviews yet.')}
                  </p>
                ) : (
                  <div className="business-drawer-reviews">
                    {vendorReviews.slice(0, 5).map(review => (
                      <div key={review.id} className="business-drawer-review">
                        <div className="business-drawer-review-hd">
                          <span className="business-drawer-review-name">{review.name}</span>
                          <span className="business-drawer-review-stars">
                            {'★'.repeat(review.stars)}
                          </span>
                        </div>
                        <p className="business-drawer-review-comment">{review.comment}</p>
                        <span className="business-drawer-review-date">
                          {new Date(review.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ───── CONTACT ACTIONS ───── */}
              <div className="business-drawer-actions">
                {directionsUrl && (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="business-drawer-action-btn"
                  >
                    <Navigation size={18} />
                    <span>{t('vendor.directions', 'Directions')}</span>
                  </a>
                )}
                {currentUser && currentUser.role !== 'vendor' && onToggleFavorite && (
                  <button
                    className={`business-drawer-action-btn ${favorites[vendor.id] ? 'fav-active' : ''}`}
                    onClick={() => onToggleFavorite(vendor.id)}
                    style={{
                      color: favorites[vendor.id] ? '#ef4444' : undefined,
                      borderColor: favorites[vendor.id] ? '#fecaca' : undefined
                    }}
                  >
                    <Heart
                      size={18}
                      fill={favorites[vendor.id] ? 'currentColor' : 'none'}
                    />
                    <span>
                      {favorites[vendor.id] ? 'Saved' : 'Save'}
                    </span>
                  </button>
                )}
                <button className="business-drawer-action-btn">
                  <Share2 size={18} />
                  <span>{t('business.share', 'Share')}</span>
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
