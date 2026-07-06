import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, Heart, MapPin, Star } from 'lucide-react'
import { favoritesService } from '../services/favoritesService'
import { useTranslation } from '../i18n/I18nProvider'
import { getVendorLocationDisplay } from '../utils/locationUtils'

export default function SearchResultsPanel({
  vendors = [],
  selectedVendor,
  onVendorClick,
  searchQuery,
  onSearchQueryChange,
  currency = '$',
  currentUser = null,
  favorites = {},
  onToggleFavorite = null
}) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const sheetRef = useRef(null)
  const startY = useRef(0)
  const currentY = useRef(0)
  const isDragging = useRef(false)

  const resultCount = vendors.length

  const handleDragStart = (e) => {
    isDragging.current = true
    startY.current = e.touches ? e.touches[0].clientY : e.clientY
  }

  const handleDragMove = (e) => {
    if (!isDragging.current) return
    currentY.current = e.touches ? e.touches[0].clientY : e.clientY
  }

  const handleDragEnd = () => {
    isDragging.current = false
    const diff = startY.current - currentY.current
    if (Math.abs(diff) > 50) {
      setIsOpen(diff < 0 ? false : true)
    }
  }

  function formatPrice(value, currency) {
    if (currency === 'FC') return `${Number(value || 0).toFixed(0)} FC`
    return `$${Number(value || 0).toFixed(2)}`
  }

  function getVendorImage(vendor) {
    const productImage = vendor.products?.find(product => product.image)?.image
    if (vendor.profileImage) return vendor.profileImage
    if (productImage) return productImage
    const title = encodeURIComponent(vendor.name || 'Yengo+243')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="192" viewBox="0 0 320 192"><rect width="320" height="192" fill="#f1f5f9"/><text x="160" y="100" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#64748b">${title}</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }

  return (
    <>
      {/* Trigger bar */}
      <div className="search-results-trigger">
        <motion.div
          className="search-results-trigger-inner"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="search-results-trigger-count">{resultCount}</span>
          <span className="search-results-trigger-label">
            {resultCount === 1 ? t('search.resultFound') : t('search.resultsFound')}
          </span>
          <ChevronUp size={18} className="search-results-trigger-arrow" />
        </motion.div>
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="bottom-sheet-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className={`bottom-sheet ${isOpen ? 'bottom-sheet-desktop' : ''}`}
              ref={sheetRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div className="bottom-sheet-handle" />
              <div className="bottom-sheet-header">
                <h2>{resultCount} {resultCount === 1 ? t('search.resultFound') : t('search.resultsFound')}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    placeholder={t('search.filterResults')}
                    style={{
                      padding: '8px 14px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      background: 'var(--bg)',
                      width: 180
                    }}
                  />
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>
              <div className="bottom-sheet-body">
                {vendors.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    {t('search.noResults')}
                  </div>
                ) : (
                  <div className="vendor-cards-grid">
                    {vendors.slice().sort((a, b) => {
                      const aScore = (a.subscription?.plan === 'pro' ? 2 : 0) + (a.boostPin?.active ? 1 : 0)
                      const bScore = (b.subscription?.plan === 'pro' ? 2 : 0) + (b.boostPin?.active ? 1 : 0)
                      return bScore - aScore
                    }).map((vendor) => (
                      <motion.div
                        key={vendor.id}
                        className="vendor-card"
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => { onVendorClick(vendor.id); setIsOpen(false) }}
                      >
                        <img
                          className="vendor-card-image"
                          src={getVendorImage(vendor)}
                          alt={vendor.name}
                        />
                        <div className="vendor-card-body">
                          <div className="vendor-card-name">
                            {vendor.name}
                            {vendor.subscription?.plan === 'pro' && (
                              <span className="verified-badge">{t('market.pro')}</span>
                            )}
                          </div>
                          <div className="vendor-card-category">
                            {vendor.category}
                          </div>
                          <div className="vendor-card-location">
                            <MapPin size={12} />
                            {getVendorLocationDisplay(vendor)}
                          </div>
                          <div className="vendor-card-rating">
                            <span className="vendor-card-rating-stars">
                              {'★'.repeat(Math.round(vendor.rating || 0))}
                              {'☆'.repeat(5 - Math.round(vendor.rating || 0))}
                            </span>
                            <span>{(vendor.rating || 0).toFixed(1)}</span>
                          </div>
                          <div className="vendor-card-actions">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={(e) => { e.stopPropagation(); onVendorClick(vendor.id); setIsOpen(false) }}
                            >
                              {t('vendor.visitStore')}
                            </button>
                            <button
                              className="btn btn-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (vendor.coords) {
                                  onVendorClick(vendor.id)
                                  setIsOpen(false)
                                }
                              }}
                            >
                              {t('vendor.directions')}
                            </button>
                            {currentUser && currentUser.role !== 'vendor' && onToggleFavorite && (
                              <button
                                className={`btn btn-sm btn-icon ${favorites[vendor.id] ? 'fav-active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onToggleFavorite(vendor.id)
                                }}
                                style={{
                                  flex: '0 0 auto',
                                  padding: '7px 10px',
                                  color: favorites[vendor.id] ? '#ef4444' : undefined,
                                  borderColor: favorites[vendor.id] ? '#fecaca' : undefined
                                }}
                              >
                                <Heart
                                  size={14}
                                  fill={favorites[vendor.id] ? 'currentColor' : 'none'}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
