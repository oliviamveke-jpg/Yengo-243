import React, { useMemo, useState } from 'react'
import { kinshasaLocationData } from '../data/locationData'
<<<<<<< HEAD
=======
import { getCommuneOptions } from '../utils/locationUtils'
import TopSearchBar from './TopSearchBar'
import FilterRow from './FilterRow'
import ResultsToggle from './ResultsToggle'
>>>>>>> e66c1ea (Update app)

function normalizeText(value) {
  return String(value || '').toLowerCase().trim()
}

function productImage(title, category) {
  const palette = {
    Électronique: ['#fffc46', '#ccfbf1'],
    Maison: ['#773305', '#ede9fe'],
    Vêtements: ['#be123c', '#ffe4e6'],
    Alimentation: ['#15803d', '#dcfce7'],
    Beauté: ['#c026d3', '#fae8ff'],
    Outillage: ['#d31212', '#fef3c7']
  }
  const colors = palette[category] || ['#2563eb', '#dbeafe']
<<<<<<< HEAD
  const safeTitle = String(title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
=======
  const safeTitle = String(title).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"')
>>>>>>> e66c1ea (Update app)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><rect width="320" height="220" fill="${colors[1]}"/><circle cx="260" cy="36" r="54" fill="${colors[0]}" opacity=".16"/><rect x="28" y="42" width="264" height="136" rx="12" fill="white" opacity=".86"/><text x="160" y="104" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${colors[0]}">${safeTitle}</text><text x="160" y="136" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#334155">Yengo+243</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function formatPrice(value, currency) {
  if (currency === 'FC') return `${Number(value || 0).toFixed(0)} FC`
  return `$${Number(value || 0).toFixed(2)}`
}

<<<<<<< HEAD
function vendorMatchesSearch(vendor, query) {
  if (!query) return true
  const haystack = [vendor.name, vendor.category, vendor.province, vendor.commune, vendor.quartier, vendor.rue, vendor.street, vendor.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

function productMatchesSearch(product, query) {
  if (!query) return true
  const haystack = [product.title, product.category, product.subcategory, product.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

=======
>>>>>>> e66c1ea (Update app)
export default function Marketplace({
  vendors = [],
  currentUser,
  filters,
  onFiltersChange,
  searchQuery,
  onSearchQueryChange,
  currency,
  onCurrencyChange,
  filteredVendors,
  filteredProducts,
  selectedVendor,
  cart,
  cartCount,
  addToCart,
  removeFromCart,
  onOpenCart,
  onToggleMarkers,
  markersVisible,
  onVendorClick,
  activeVendorShopId,
  onCloseVendorShop,
  activeProduct,
  onOpenProduct,
  onCloseProduct,
  isCartOpen,
  onCloseCart,
  onCheckout,
  manageVendorId,
  onManageVendor,
  onCloseManage,
  reviews,
  onSaveReview,
  onUpdateVendorProducts
}) {
  const [toast, setToast] = useState(null)
  const [reviewForm, setReviewForm] = useState({ name: '', stars: 5, comment: '' })
<<<<<<< HEAD

  const provinces = useMemo(() => Array.from(new Set(vendors.map(v => v.province).filter(Boolean))).sort(), [vendors])
  const communes = useMemo(() => {
    if (filters.province === 'Kinshasa') {
      return Object.keys(kinshasaLocationData?.communes || {}).sort()
    }
    if (!filters.province) return Array.from(new Set(vendors.map(v => v.commune).filter(Boolean))).sort()
    return Array.from(new Set(vendors.filter(v => v.province === filters.province).map(v => v.commune).filter(Boolean))).sort()
  }, [vendors, filters.province])
  const quartiers = useMemo(() => {
    if (filters.province === 'Kinshasa' && filters.commune && kinshasaLocationData?.communes?.[filters.commune]) {
      return Object.keys(kinshasaLocationData.communes[filters.commune]?.quartiers || {}).sort()
=======
  const [resultsView, setResultsView] = useState('products')

  const provinces = useMemo(() => Array.from(new Set(vendors.map(v => v.province).filter(Boolean))).sort(), [vendors])

  // Commune dropdown populated EXCLUSIVELY from centralized locationData,
  // never from vendor listings or vendor metadata.
  const communes = useMemo(() => {
    if (filters.province) {
      return getCommuneOptions(filters.province)
    }
    // No province selected → show all communes from the location data source
    return Object.keys(kinshasaLocationData?.communes || {}).sort()
  }, [filters.province])

  const quartiers = useMemo(() => {
    if (filters.commune) {
      if (filters.province === 'Kinshasa' && kinshasaLocationData?.communes?.[filters.commune]) {
        return Object.keys(kinshasaLocationData.communes[filters.commune]?.quartiers || {}).sort()
      }
      return Array.from(new Set(vendors
        .filter(v => v.commune === filters.commune && (!filters.province || v.province === filters.province))
        .map(v => v.quartier)
        .filter(Boolean)
      )).sort()
    }
    if (filters.province) {
      return Array.from(new Set(vendors.filter(v => v.province === filters.province).map(v => v.quartier).filter(Boolean))).sort()
>>>>>>> e66c1ea (Update app)
    }
    return Array.from(new Set(vendors.map(v => v.quartier).filter(Boolean))).sort()
  }, [vendors, filters.province, filters.commune])
  const categories = useMemo(() => Array.from(new Set(vendors.map(v => v.category).filter(Boolean))).sort(), [vendors])
  const subcategories = useMemo(() => {
    const products = vendors.flatMap(v => v.products || [])
    const filtered = filters.category ? products.filter(p => p.category === filters.category) : products
    return Array.from(new Set(filtered.map(p => p.subcategory).filter(Boolean))).sort()
  }, [vendors, filters.category])

  const selectedShopVendor = useMemo(() => vendors.find(v => v.id === activeVendorShopId), [vendors, activeVendorShopId])
  const manageVendor = useMemo(() => vendors.find(v => v.id === manageVendorId), [vendors, manageVendorId])

  const vendorReviews = useMemo(() => selectedShopVendor ? reviews.filter(r => r.vendorId === selectedShopVendor.id) : [], [reviews, selectedShopVendor])
  const averageRating = useMemo(() => {
    if (!vendorReviews.length) return selectedShopVendor?.rating || 0
    return Math.round((vendorReviews.reduce((sum, review) => sum + review.stars, 0) / vendorReviews.length) * 10) / 10
  }, [vendorReviews, selectedShopVendor])

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(null), 3000)
  }

  function handleFilterChange(key, value) {
    onFiltersChange({
      ...filters,
      [key]: value,
      ...(key === 'province' ? { commune: '', quartier: '' } : {}),
      ...(key === 'commune' ? { quartier: '' } : {})
    })
  }

  function handleReviewSubmit(event) {
    event.preventDefault()
    if (!selectedShopVendor) return
    const review = {
      id: `rev-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      vendorId: selectedShopVendor.id,
      name: reviewForm.name || currentUser.fullName || 'Client',
      stars: Number(reviewForm.stars),
      comment: reviewForm.comment,
      createdAt: new Date().toISOString()
    }
    onSaveReview(review)
    setReviewForm({ name: '', stars: 5, comment: '' })
    showToast('Merci pour votre avis !')
  }

  const isOwner = selectedShopVendor && currentUser.role === 'vendor' && (selectedShopVendor.ownerId === currentUser.id || selectedShopVendor.id === currentUser.id)

  return (
<<<<<<< HEAD
    <div className="market-card market-full">
      <div className="market-header">
        <div>
          <h2>Marché Kinshasa</h2>
          <p>Filtres, produits et boutiques synchronisés avec la carte.</p>
        </div>
        <div className="market-top-actions">
          <button type="button" className="btn ghost" onClick={onToggleMarkers}>
            {markersVisible ? 'Masquer marqueurs' : 'Afficher marqueurs'}
          </button>
          <button type="button" className="btn" onClick={onOpenCart}>
            Panier <span className="cart-bubble">{cartCount}</span>
=======
    <>
      {/* Search */}
      <TopSearchBar value={searchQuery} onChange={onSearchQueryChange} />

      {/* Filters + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterRow
          filters={filters}
          onFilterChange={handleFilterChange}
          provinces={provinces}
          communes={communes}
          quartiers={quartiers}
          streets={kinshasaLocationData?.streets?.map(street => street.name) || []}
          categories={categories}
          subcategories={subcategories}
        />
      </div>

      {/* Results Toggle + Currency + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ResultsToggle value={resultsView} onChange={setResultsView} />
        <div className="flex flex-wrap items-center gap-2">
          <div className="currency-brutal">
            <label>Monnaie</label>
            <select value={currency} onChange={e => onCurrencyChange(e.target.value)}>
              <option value="$">USD ($)</option>
              <option value="FC">FC</option>
            </select>
          </div>
          <button className="btn-brutal small" onClick={onToggleMarkers}>
            {markersVisible ? 'Masquer' : 'Afficher'} marqueurs
          </button>
          <button className="btn-brutal orange small" onClick={onOpenCart}>
            Panier {cartCount > 0 && <span className="cart-bubble">{cartCount}</span>}
>>>>>>> e66c1ea (Update app)
          </button>
        </div>
      </div>

<<<<<<< HEAD
      <div className="market-toolbar">
        <div className="toolbar-group">
          <label>Monnaie</label>
          <select value={currency} onChange={e => onCurrencyChange(e.target.value)}>
            <option value="$">USD ($)</option>
            <option value="FC">FC</option>
          </select>
        </div>
        <div className="toolbar-group search-row">
          <label>Recherche</label>
          <input value={searchQuery} onChange={e => onSearchQueryChange(e.target.value)} placeholder="Chercher boutique ou produit..." />
        </div>
      </div>

      <div className="market-filters">
        <div className="filter-item">
          <label>Province</label>
          <select value={filters.province} onChange={e => handleFilterChange('province', e.target.value)}>
            <option value="">Toutes</option>
            {provinces.map(province => <option key={province} value={province}>{province}</option>)}
          </select>
        </div>
            <div className="filter-item">
          <label>Commune</label>
          <select value={filters.commune} onChange={e => handleFilterChange('commune', e.target.value)}>
            <option value="">Toutes</option>
            {communes.map(commune => <option key={commune} value={commune}>{commune}</option>)}
          </select>
        </div>
        <div className="filter-item">
          <label>Quartier</label>
          <select value={filters.quartier} onChange={e => handleFilterChange('quartier', e.target.value)}>
            <option value="">Tous</option>
            {quartiers.map(quartier => <option key={quartier} value={quartier}>{quartier}</option>)}
          </select>
        </div>
        <div className="filter-item">
          <label>Rue</label>
          <input list="kinshasaStreets" value={filters.street || ''} onChange={e => handleFilterChange('street', e.target.value)} placeholder="Rue" />
          <datalist id="kinshasaStreets">
            {kinshasaLocationData.streets.map(street => <option key={street.name} value={street.name} />)}
          </datalist>
        </div>
        <div className="filter-item">
          <label>Catégorie</label>
          <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)}>
            <option value="">Toutes</option>
            {categories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <div className="filter-item">
          <label>Sous-catégorie</label>
          <select value={filters.subcategory} onChange={e => handleFilterChange('subcategory', e.target.value)}>
            <option value="">Toutes</option>
            {subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>
      </div>

      <div className="market-body">
        <div className="vendor-list">
          <div className="section-title">Vendeurs</div>
          {filteredVendors.length === 0 && <div className="empty-state">Aucun vendeur trouvé</div>}
          {filteredVendors
            .slice()
            .sort((a, b) => {
              // Pro vendors first, then boosted, then rest
=======
      {/* Vendor / Product List */}
      {resultsView === 'vendors' ? (
        <div className="vendor-list-brutal">
          <div className="vendor-list-title">Vendeurs</div>
          {filteredVendors.length === 0 && <div className="empty-state-brutal">Aucun vendeur trouvé</div>}
          {filteredVendors
            .slice()
            .sort((a, b) => {
>>>>>>> e66c1ea (Update app)
              const aScore = (a.subscription?.plan === 'pro' ? 2 : 0) + (a.boostPin?.active ? 1 : 0)
              const bScore = (b.subscription?.plan === 'pro' ? 2 : 0) + (b.boostPin?.active ? 1 : 0)
              return bScore - aScore
            })
            .map(vendor => (
<<<<<<< HEAD
            <button
              key={vendor.id}
              type="button"
              className={vendor.id === selectedVendor?.id ? 'vendor-card selected' : 'vendor-card'}
              onClick={() => onVendorClick(vendor.id)}
            >
              <div>
                <strong>
                  {vendor.name}
                  {vendor.subscription?.plan === 'pro' && <span className="verified-badge">✓ Vérifié</span>}
                </strong>
                <div className="vendor-meta">
                  {vendor.category} · {vendor.commune}
                  {vendor.boostPin?.active && <span className="boost-indicator">📌 Boost</span>}
                  {vendor.delivery?.enabled && <span className="delivery-indicator">🚚 Livraison</span>}
                </div>
              </div>
              <div className="vendor-count">{vendor.products.length} produits</div>
            </button>
          ))}
        </div>

        <div className="product-panel">
          <div className="section-title">Produits</div>
          {filteredProducts.length === 0 ? (
            <div className="empty-state">Aucun produit ne correspond aux filtres.</div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image || productImage(product.title, product.category)} alt={product.title} />
                  <div>
                    <strong>{product.title}</strong>
                    <div className="vendor-meta">{product.vendorName} · {product.subcategory}</div>
                    <div className="product-price">{formatPrice(product.price, currency)}</div>
                    <p>{product.description}</p>
                    <div className="product-actions">
                      <button type="button" className="btn" onClick={() => addToCart(product)}>Ajouter</button>
                      <button type="button" className="btn ghost" onClick={() => onOpenProduct(product)}>Voir</button>
=======
              <button
                key={vendor.id}
                type="button"
                className={'vendor-card-brutal' + (vendor.id === selectedVendor?.id ? ' selected' : '')}
                onClick={() => onVendorClick(vendor.id)}
              >
                <div>
                  <div className="vendor-name">
                    {vendor.name}
                    {vendor.subscription?.plan === 'pro' && <span className="verified-badge">✓ Vérifié</span>}
                  </div>
                  <div className="vendor-meta">
                    {vendor.category} · {vendor.commune}
                    {vendor.boostPin?.active && <span className="boost-indicator">📌 Boost</span>}
                    {vendor.delivery?.enabled && <span className="delivery-indicator">🚚 Livraison</span>}
                  </div>
                </div>
                <div className="vendor-count">{vendor.products.length} produits</div>
              </button>
            ))}
        </div>
      ) : (
        <div>
          <div className="vendor-list-title">Produits</div>
          {filteredProducts.length === 0 ? (
            <div className="empty-state-brutal">Aucun produit ne correspond aux filtres.</div>
          ) : (
            <div className="product-grid-brutal">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card-brutal">
                  <img src={product.coverImage || product.images?.[0] || product.image || productImage(product.title, product.category)} alt={product.title} />
                  <div className="product-info">
                    <div className="product-title">{product.title}</div>
                    <div className="product-meta">{product.vendorName} · {product.subcategory}</div>
                    <div className="product-price">{formatPrice(product.price, currency)}</div>
                    <div className="product-actions">
                      <button className="btn-brutal small green" onClick={() => addToCart(product)}>Ajouter</button>
                      <button className="btn-brutal small ghost" onClick={() => onOpenProduct(product)}>Voir</button>
>>>>>>> e66c1ea (Update app)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
<<<<<<< HEAD
      </div>

      {selectedVendor && (
        <div className="selected-vendor-card">
          <div className="detail-header">
            <div>
              <h3>{selectedVendor.name}</h3>
              <div className="vendor-meta">{selectedVendor.category} · {selectedVendor.commune}</div>
            </div>
            <div className="vendor-rating">{selectedVendor.rating?.toFixed(1)} ★</div>
          </div>
          <p>{selectedVendor.description}</p>
          <div className="location-line">{selectedVendor.province} / {selectedVendor.commune} / {selectedVendor.quartier}</div>
          <div className="selected-vendor-actions">
            <button type="button" className="btn" onClick={() => onVendorClick(selectedVendor.id)}>Voir boutique</button>
            {isOwner && <button type="button" className="btn ghost" onClick={() => onManageVendor(selectedVendor.id)}>Gérer boutique</button>}
=======
      )}

      {/* Selected Vendor Card */}
      {selectedVendor && (
        <div className="sidebar-vendor-card">
          <h3>{selectedVendor.name}</h3>
          <div className="vendor-meta">{selectedVendor.category} · {selectedVendor.commune}</div>
          <p>{selectedVendor.description}</p>
          <div className="location-line">{selectedVendor.province} / {selectedVendor.commune} / {selectedVendor.quartier}</div>
          <div className="vendor-actions">
            <button className="btn-brutal small" onClick={() => onVendorClick(selectedVendor.id)}>Voir boutique</button>
            {isOwner && <button className="btn-brutal small white" onClick={() => onManageVendor(selectedVendor.id)}>Gérer boutique</button>}
>>>>>>> e66c1ea (Update app)
          </div>
        </div>
      )}

<<<<<<< HEAD
      {toast && <div className="toast-banner">{toast}</div>}

      {selectedShopVendor && (
        <div className="modal-overlay" onClick={onCloseVendorShop}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
=======
      {/* Toast */}
      {toast && <div className="toast-brutal">{toast}</div>}

      {/* Vendor Shop Modal */}
      {selectedShopVendor && (
        <div className="modal-overlay" onClick={onCloseVendorShop}>
          <div className="modal-brutal" onClick={e => e.stopPropagation()}>
            <div className="modal-brutal-header">
>>>>>>> e66c1ea (Update app)
              <div>
                <h3>{selectedShopVendor.name}</h3>
                <div className="vendor-meta">{selectedShopVendor.commune} · {selectedShopVendor.category}</div>
              </div>
<<<<<<< HEAD
              <button type="button" className="btn ghost" onClick={onCloseVendorShop}>Fermer</button>
            </div>
            <div className="modal-body">
              <div className="modal-grid">
                <div>
                  <p>{selectedShopVendor.description}</p>
                  <div className="rating-row">Note moyenne: {averageRating} ★</div>
                  <div className="shop-actions">
                    {isOwner && <button type="button" className="btn" onClick={() => { onManageVendor(selectedShopVendor.id); onCloseVendorShop() }}>Gérer boutique</button>}
                  </div>
                </div>
                <div>
                  <div className="modal-subtitle">Produits</div>
                  <div className="product-grid modal-list">
                    {selectedShopVendor.products.map(product => (
                      <div key={product.id} className="product-card small">
                        <img src={product.image || productImage(product.title, product.category)} alt={product.title} />
                        <div>
                          <strong>{product.title}</strong>
                          <div className="vendor-meta">{product.subcategory}</div>
                          <div className="product-price">{formatPrice(product.price, currency)}</div>
                          <button type="button" className="btn" onClick={() => addToCart({ ...product, vendorId: selectedShopVendor.id, vendorName: selectedShopVendor.name, vendorOwnerId: selectedShopVendor.ownerId })}>Ajouter</button>
=======
              <button className="btn-brutal ghost small" onClick={onCloseVendorShop}>Fermer</button>
            </div>
            <div className="modal-brutal-body">
              <div className="modal-brutal-grid">
                <div>
                  <p>{selectedShopVendor.description}</p>
                  <div style={{ fontWeight: 800, color: '#fff', marginTop: 12 }}>Note moyenne: {averageRating} ★</div>
                  <div style={{ marginTop: 14 }}>
                    {isOwner && <button className="btn-brutal small" onClick={() => { onManageVendor(selectedShopVendor.id); onCloseVendorShop() }}>Gérer boutique</button>}
                  </div>
                </div>
                <div>
                  <div className="vendor-list-title">Produits</div>
                  <div className="product-grid-brutal" style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {selectedShopVendor.products.map(product => (
                      <div key={product.id} className="product-card-brutal">
                        <img src={product.coverImage || product.images?.[0] || product.image || productImage(product.title, product.category)} alt={product.title} />
                        <div className="product-info">
                          <div className="product-title">{product.title}</div>
                          <div className="product-meta">{product.subcategory}</div>
                          <div className="product-price">{formatPrice(product.price, currency)}</div>
                          <button className="btn-brutal small green" onClick={() => addToCart({ ...product, vendorId: selectedShopVendor.id, vendorName: selectedShopVendor.name, vendorOwnerId: selectedShopVendor.ownerId })}>Ajouter</button>
>>>>>>> e66c1ea (Update app)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              <div className="review-section">
                <div className="modal-subtitle">Avis clients</div>
                {vendorReviews.length === 0 ? (
                  <div className="empty-state">Aucun avis pour cette boutique.</div>
                ) : (
                  vendorReviews.map(review => (
                    <div key={review.id} className="review-card">
                      <div className="review-header"><strong>{review.name}</strong><span>{review.stars} ★</span></div>
                      <p>{review.comment}</p>
                      <div className="review-date">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))
                )}
              </div>

              {currentUser.role !== 'vendor' && (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <h4>Ajouter un avis</h4>
                  <label>
                    Nom
                    <input value={reviewForm.name} onChange={e => setReviewForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Votre nom" />
                  </label>
                  <label>
                    Note
                    <select value={reviewForm.stars} onChange={e => setReviewForm(prev => ({ ...prev, stars: e.target.value }))}>
                      {[5, 4, 3, 2, 1].map(score => <option key={score} value={score}>{score} ★</option>)}
                    </select>
                  </label>
                  <label>
                    Commentaire
                    <textarea value={reviewForm.comment} onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))} rows={3} />
                  </label>
                  <button type="submit" className="btn">Soumettre</button>
=======
              {/* Reviews */}
              <div>
                <div className="vendor-list-title">Avis clients</div>
                {vendorReviews.length === 0 ? (
                  <div className="empty-state-brutal">Aucun avis pour cette boutique.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                    {vendorReviews.map(review => (
                      <div key={review.id} style={{ padding: 12, background: 'rgba(255,255,255,0.06)', border: '2px solid #334155', borderRadius: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <strong style={{ color: '#fff' }}>{review.name}</strong>
                          <span style={{ color: '#f59e0b', fontWeight: 700 }}>{review.stars} ★</span>
                        </div>
                        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.85rem' }}>{review.comment}</p>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 8 }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Form */}
              {currentUser.role !== 'vendor' && (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="vendor-list-title">Ajouter un avis</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Nom</label>
                    <input value={reviewForm.name} onChange={e => setReviewForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Votre nom" style={{ padding: '10px 12px', border: '2px solid #000', borderRadius: 8, background: '#fff', color: '#1a1a2e', fontWeight: 600, outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Note</label>
                    <select value={reviewForm.stars} onChange={e => setReviewForm(prev => ({ ...prev, stars: e.target.value }))} style={{ padding: '10px 12px', border: '2px solid #000', borderRadius: 8, background: '#fff', color: '#1a1a2e', fontWeight: 600, outline: 'none' }}>
                      {[5, 4, 3, 2, 1].map(score => <option key={score} value={score}>{score} ★</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Commentaire</label>
                    <textarea value={reviewForm.comment} onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))} rows={3} style={{ padding: '10px 12px', border: '2px solid #000', borderRadius: 8, background: '#fff', color: '#1a1a2e', fontWeight: 600, outline: 'none', resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn-brutal small green">Soumettre</button>
>>>>>>> e66c1ea (Update app)
                </form>
              )}
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {activeProduct && (
        <div className="modal-overlay" onClick={onCloseProduct}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
=======
      {/* Product Detail Modal */}
      {activeProduct && (
        <div className="modal-overlay" onClick={onCloseProduct}>
          <div className="modal-brutal" onClick={e => e.stopPropagation()}>
            <div className="modal-brutal-header">
>>>>>>> e66c1ea (Update app)
              <div>
                <h3>{activeProduct.title}</h3>
                <div className="vendor-meta">{activeProduct.vendorName}</div>
              </div>
<<<<<<< HEAD
              <button type="button" className="btn ghost" onClick={onCloseProduct}>Fermer</button>
            </div>
            <div className="modal-body">
              <div className="product-card detail">
                <img src={activeProduct.image || productImage(activeProduct.title, activeProduct.category)} alt={activeProduct.title} />
                <div>
                  <div className="product-price">{formatPrice(activeProduct.price, currency)}</div>
                  <p>{activeProduct.description}</p>
                  <button type="button" className="btn" onClick={() => { addToCart(activeProduct); showToast('Ajouté au panier') }}>Ajouter au panier</button>
=======
              <button className="btn-brutal ghost small" onClick={onCloseProduct}>Fermer</button>
            </div>
            <div className="modal-brutal-body">
              <div className="product-card-brutal" style={{ flexDirection: 'column' }}>
                <img src={activeProduct.coverImage || activeProduct.images?.[0] || activeProduct.image || productImage(activeProduct.title, activeProduct.category)} alt={activeProduct.title} style={{ width: '100%', height: 200 }} />
                <div className="product-info">
                  <div className="product-price">{formatPrice(activeProduct.price, currency)}</div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '8px 0' }}>{activeProduct.description}</p>
                  <button className="btn-brutal small green" onClick={() => { addToCart(activeProduct); showToast('Ajouté au panier') }}>Ajouter au panier</button>
>>>>>>> e66c1ea (Update app)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {isCartOpen && (
        <div className="modal-overlay" onClick={onCloseCart}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Panier</h3>
              <button type="button" className="btn ghost" onClick={onCloseCart}>Fermer</button>
            </div>
            <div className="modal-body">
              {cartCount === 0 ? (
                <div className="empty-state">Votre panier est vide.</div>
              ) : (
                <div className="cart-list">
                  {Object.values(cart).map(item => (
                    <div key={item.product.id} className="cart-item">
                      <div>
                        <strong>{item.product.title}</strong>
                        <div className="vendor-meta">{item.product.vendorName}</div>
                      </div>
                      <div className="cart-actions">
                        <span>{item.qty} × {formatPrice(item.product.price, currency)}</span>
                        <button type="button" className="btn ghost" onClick={() => removeFromCart(item.product.id)}>Supprimer</button>
=======
      {/* Cart Modal */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={onCloseCart}>
          <div className="modal-brutal" onClick={e => e.stopPropagation()}>
            <div className="modal-brutal-header">
              <h3>Panier</h3>
              <button className="btn-brutal ghost small" onClick={onCloseCart}>Fermer</button>
            </div>
            <div className="modal-brutal-body">
              {cartCount === 0 ? (
                <div className="empty-state-brutal">Votre panier est vide.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.values(cart).map(item => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: 12, background: 'rgba(255,255,255,0.06)', border: '2px solid #334155', borderRadius: 12 }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#fff' }}>{item.product.title}</div>
                        <div className="vendor-meta">{item.product.vendorName}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: '#fff' }}>{item.qty} × {formatPrice(item.product.price, currency)}</span>
                        <button className="btn-brutal small ghost" onClick={() => removeFromCart(item.product.id)}>Supprimer</button>
>>>>>>> e66c1ea (Update app)
                      </div>
                    </div>
                  ))}
                </div>
              )}
<<<<<<< HEAD
              <div className="checkout-row">
                <strong>Total:</strong>
                <span>{formatPrice(Object.values(cart).reduce((sum, item) => sum + item.product.price * item.qty, 0), currency)}</span>
              </div>
              <button type="button" className="btn" onClick={onCheckout} disabled={cartCount === 0}>Simuler commande</button>
=======
              {cartCount > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', fontWeight: 800, color: '#fff', fontSize: '1.1rem', borderTop: '2px solid #334155', marginTop: 8 }}>
                    <span>Total:</span>
                    <span>{formatPrice(Object.values(cart).reduce((sum, item) => sum + item.product.price * item.qty, 0), currency)}</span>
                  </div>
                  <button className="btn-brutal green" onClick={onCheckout}>Simuler commande</button>
                </>
              )}
>>>>>>> e66c1ea (Update app)
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {manageVendor && (
        <div className="modal-overlay" onClick={onCloseManage}>
          <div className="modal-panel large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gérer la boutique – {manageVendor.name}</h3>
              <button type="button" className="btn ghost" onClick={onCloseManage}>Fermer</button>
            </div>
            <div className="modal-body">
              <div className="manage-grid">
                <div className="manage-products">
                  <div className="section-title">Produits existants</div>
                  {manageVendor.products.length === 0 ? (
                    <div className="empty-state">Aucun produit enregistré.</div>
                  ) : (
                    manageVendor.products.map(product => (
                      <div key={product.id} className="manage-product-card">
                        <div>
                          <strong>{product.title}</strong>
                          <div className="vendor-meta">{product.category} / {product.subcategory}</div>
                        </div>
                        <button type="button" className="btn ghost" onClick={() => onUpdateVendorProducts(manageVendor.id, manageVendor.products.filter(p => p.id !== product.id))}>Supprimer</button>
                      </div>
                    ))
                  )}
                </div>
                <div className="manage-form">
                  <div className="section-title">Ajouter un produit</div>
                  {manageVendor.subscription?.plan !== 'pro' && manageVendor.products.length >= 5 && (
                    <div className="limit-warning">
                      ⚠️ Limite gratuite atteinte (5 produits max). Passez à Boutique Pro pour des produits illimités.
                      <div className="limit-bar">
                        <div className="limit-bar-fill warning" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  )}
                  {manageVendor.subscription?.plan !== 'pro' && (
                    <div className="limit-label">
                      Produits: {manageVendor.products.length}/5
                      {manageVendor.products.length > 0 && (
                        <div className="limit-bar">
                          <div className={`limit-bar-fill ${manageVendor.products.length >= 4 ? 'warning' : ''}`} style={{ width: `${(manageVendor.products.length / 5) * 100}%` }}></div>
=======
      {/* Manage Vendor Modal */}
      {manageVendor && (
        <div className="modal-overlay" onClick={onCloseManage}>
          <div className="modal-brutal large" onClick={e => e.stopPropagation()}>
            <div className="modal-brutal-header">
              <h3>Gérer la boutique – {manageVendor.name}</h3>
              <button className="btn-brutal ghost small" onClick={onCloseManage}>Fermer</button>
            </div>
            <div className="modal-brutal-body">
              <div className="modal-brutal-grid">
                <div>
                  <div className="vendor-list-title">Produits existants</div>
                  {manageVendor.products.length === 0 ? (
                    <div className="empty-state-brutal">Aucun produit enregistré.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                      {manageVendor.products.map(product => (
                        <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: 10, background: 'rgba(255,255,255,0.06)', border: '2px solid #334155', borderRadius: 10 }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{product.title}</div>
                            <div className="vendor-meta">{product.category} / {product.subcategory}</div>
                          </div>
                          <button className="btn-brutal small ghost" onClick={() => onUpdateVendorProducts(manageVendor.id, manageVendor.products.filter(p => p.id !== product.id))}>Supprimer</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <div className="vendor-list-title">Ajouter un produit</div>
                  {manageVendor.subscription?.plan !== 'pro' && manageVendor.products.length >= 5 && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 8, padding: '10px 14px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: 10 }}>
                      ⚠️ Limite gratuite atteinte (5 produits max). Passez à Boutique Pro pour des produits illimités.
                    </div>
                  )}
                  {manageVendor.subscription?.plan !== 'pro' && (
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 10 }}>
                      Produits: {manageVendor.products.length}/5
                      {manageVendor.products.length > 0 && (
                        <div style={{ height: 4, borderRadius: 4, background: '#334155', overflow: 'hidden', marginTop: 6 }}>
                          <div style={{ height: '100%', borderRadius: 4, background: manageVendor.products.length >= 4 ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#2563eb,#8b5cf6)', width: `${(manageVendor.products.length / 5) * 100}%` }} />
>>>>>>> e66c1ea (Update app)
                        </div>
                      )}
                    </div>
                  )}
                  {manageVendor.subscription?.plan === 'pro' && (
<<<<<<< HEAD
                    <div className="limit-label" style={{ color: '#10b981' }}>
=======
                    <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, marginBottom: 10 }}>
>>>>>>> e66c1ea (Update app)
                      ✅ Produits illimités (Boutique Pro)
                    </div>
                  )}
                  <VendorProductForm
                    vendor={manageVendor}
                    onSave={product => { 
                      if (manageVendor.subscription?.plan !== 'pro' && manageVendor.products.length >= 5) {
                        showToast('⚠️ Limite atteinte! Passez à Boutique Pro pour ajouter plus de produits.');
                        return 
                      }
                      onUpdateVendorProducts(manageVendor.id, [...manageVendor.products, product]); 
                      showToast('Produit ajouté'); 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
<<<<<<< HEAD
    </div>
=======
    </>
>>>>>>> e66c1ea (Update app)
  )
}

function VendorProductForm({ vendor, onSave }) {
  const [form, setForm] = useState({ title: '', price: '', category: vendor?.category || '', subcategory: '', description: '', image: null })
  const [fileLabel, setFileLabel] = useState('Choisir une image')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title) return
    const product = {
      id: `${vendor.id}-${Date.now()}`,
      title: form.title,
      category: form.category || vendor.category,
      subcategory: form.subcategory || 'Autres',
      price: Number(form.price) || 0,
      currency: 'USD',
      description: form.description,
      image: form.image
    }
    onSave(product)
    setForm({ title: '', price: '', category: vendor?.category || '', subcategory: '', description: '', image: null })
    setFileLabel('Choisir une image')
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm(prev => ({ ...prev, image: reader.result }))
      setFileLabel(file.name)
    }
    reader.readAsDataURL(file)
  }

  return (
<<<<<<< HEAD
    <form className="vendor-form" onSubmit={handleSubmit}>
      <label>
        Titre
        <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} required />
      </label>
      <label>
        Prix
        <input type="number" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} required />
      </label>
      <label>
        Catégorie
        <input value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} />
      </label>
      <label>
        Sous-catégorie
        <input value={form.subcategory} onChange={e => setForm(prev => ({ ...prev, subcategory: e.target.value }))} />
      </label>
      <label>
        Description
        <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} />
      </label>
      <label className="file-label">
        {fileLabel}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      <button type="submit" className="btn">Ajouter</button>
=======
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Titre</label>
        <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} required style={{ padding: '10px 12px', border: '2px solid #000', borderRadius: 8, background: '#fff', color: '#1a1a2e', fontWeight: 600, outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Prix</label>
        <input type="number" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} required style={{ padding: '10px 12px', border: '2px solid #000', borderRadius: 8, background: '#fff', color: '#1a1a2e', fontWeight: 600, outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Catégorie</label>
        <input value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} style={{ padding: '10px 12px', border: '2px solid #000', borderRadius: 8, background: '#fff', color: '#1a1a2e', fontWeight: 600, outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Sous-catégorie</label>
        <input value={form.subcategory} onChange={e => setForm(prev => ({ ...prev, subcategory: e.target.value }))} style={{ padding: '10px 12px', border: '2px solid #000', borderRadius: 8, background: '#fff', color: '#1a1a2e', fontWeight: 600, outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Description</label>
        <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} style={{ padding: '10px 12px', border: '2px solid #000', borderRadius: 8, background: '#fff', color: '#1a1a2e', fontWeight: 600, outline: 'none', resize: 'vertical' }} />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '2px solid #000', borderRadius: 8, background: '#fff', color: '#1a1a2e', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
        {fileLabel}
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      </label>
      <button type="submit" className="btn-brutal small green">Ajouter</button>
>>>>>>> e66c1ea (Update app)
    </form>
  )
}
