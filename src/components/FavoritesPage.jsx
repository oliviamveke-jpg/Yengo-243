import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Star, ShoppingBag, Navigation, ArrowLeft } from 'lucide-react'

/**
 * FavoritesPage — Displays all favorited businesses for the authenticated buyer.
 *
 * Features:
 *   - Responsive card grid of favorited businesses
 *   - Remove Favorite, View Business, WhatsApp, Get Directions buttons
 *   - Empty state with CTA to explore businesses
 *   - Optimistic local removal with background sync
 */
export default function FavoritesPage({
  currentUser,
  favorites,
  vendors = [],
  onRemoveFavorite,
  onViewBusiness,
  onBack
}) {
  const favoriteIds = useMemo(() => {
    if (!favorites) return new Set()
    return new Set(Object.keys(favorites))
  }, [favorites])

  const favoriteVendors = useMemo(() => {
    if (!vendors.length || !favoriteIds.size) return []
    return vendors.filter(v => favoriteIds.has(v.id))
      .sort((a, b) => {
        // Sort by savedAt descending
        const aSaved = favorites[a.id]?.savedAt || ''
        const bSaved = favorites[b.id]?.savedAt || ''
        return new Date(bSaved) - new Date(aSaved)
      })
  }, [vendors, favoriteIds, favorites])

  const handleRemove = (e, vendorId) => {
    e.stopPropagation()
    onRemoveFavorite(vendorId)
  }

  const handleView = (vendorId) => {
    onViewBusiness(vendorId)
  }

  const handleWhatsApp = (e, vendor) => {
    e.stopPropagation()
    const phone = vendor.phone || vendor.whatsapp || ''
    const cleaned = phone.replace(/[^0-9]/g, '')
    if (cleaned) {
      window.open(`https://wa.me/${cleaned}`, '_blank')
    }
  }

  const handleDirections = (e, vendor) => {
    e.stopPropagation()
    if (vendor.coords) {
      const [lat, lng] = vendor.coords
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
    }
  }

  const getVendorImage = (vendor) => {
    const productImage = vendor.products?.find(p => p.image)?.image
    if (vendor.profileImage) return vendor.profileImage
    if (productImage) return productImage
    return null
  }

  const getStarRating = (rating) => {
    const stars = Math.round(rating || 0)
    return '★'.repeat(stars) + '☆'.repeat(5 - stars)
  }

  return (
    <div className="standalone-page-wrapper">
      <div className="favorites-page">
        {/* Header */}
        <header className="favorites-page-header">
          <button className="btn btn-sm btn-ghost" onClick={onBack}>
            <ArrowLeft size={18} />
          </button>
          <h1>My Favorites</h1>
          <div />
        </header>

        <div className="favorites-page-content">
          {favoriteVendors.length === 0 ? (
            /* ─── Empty State ─── */
            <motion.div
              className="favorites-empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="favorites-empty-icon">
                <Heart size={48} />
              </div>
              <h2>No favorites yet</h2>
              <p>
                Save businesses you like by tapping the heart icon.
                <br />
                They'll appear here for quick access.
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onViewBusiness(null)}
              >
                Explore Businesses
              </button>
            </motion.div>
          ) : (
            /* ─── Favorites Grid ─── */
            <div className="favorites-grid">
              {favoriteVendors.map((vendor, index) => {
                const image = getVendorImage(vendor)
                return (
                  <motion.div
                    key={vendor.id}
                    className="favorite-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    onClick={() => handleView(vendor.id)}
                  >
                    {/* Card Image */}
                    <div className="favorite-card-image-wrapper">
                      {image ? (
                        <img
                          src={image}
                          alt={vendor.name}
                          className="favorite-card-image"
                        />
                      ) : (
                        <div className="favorite-card-image-placeholder">
                          <ShoppingBag size={32} />
                        </div>
                      )}
                      <button
                        className="favorite-card-heart-btn active"
                        onClick={(e) => handleRemove(e, vendor.id)}
                        title="Remove from favorites"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="favorite-card-body">
                      <h3 className="favorite-card-name">{vendor.name}</h3>

                      <div className="favorite-card-category">
                        {vendor.category}
                      </div>

                      <div className="favorite-card-rating">
                        <span className="favorite-card-stars">
                          {getStarRating(vendor.rating)}
                        </span>
                        <span className="favorite-card-rating-value">
                          {(vendor.rating || 0).toFixed(1)}
                        </span>
                      </div>

                      <div className="favorite-card-location">
                        <MapPin size={14} />
                        <span>
                          {vendor.commune}
                          {vendor.province ? `, ${vendor.province}` : ''}
                        </span>
                      </div>

                      {vendor.description && (
                        <p className="favorite-card-description">
                          {vendor.description.length > 100
                            ? vendor.description.slice(0, 100) + '...'
                            : vendor.description}
                        </p>
                      )}

                      {/* Card Actions */}
                      <div className="favorite-card-actions">
                        <button
                          className="favorite-card-action-btn primary"
                          onClick={() => handleView(vendor.id)}
                        >
                          View Business
                        </button>
                        <button
                          className="favorite-card-action-btn"
                          onClick={(e) => handleWhatsApp(e, vendor)}
                        >
                          Chat on WhatsApp
                        </button>
                        <button
                          className="favorite-card-action-btn"
                          onClick={(e) => handleDirections(e, vendor)}
                        >
                          <Navigation size={14} />
                          Directions
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
