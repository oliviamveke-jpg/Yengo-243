import React, { useMemo, useState } from 'react'
import { kinshasaLocationData } from '../data/locationData'

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
  const safeTitle = String(title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><rect width="320" height="220" fill="${colors[1]}"/><circle cx="260" cy="36" r="54" fill="${colors[0]}" opacity=".16"/><rect x="28" y="42" width="264" height="136" rx="12" fill="white" opacity=".86"/><text x="160" y="104" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${colors[0]}">${safeTitle}</text><text x="160" y="136" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#334155">Yengo+243</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function formatPrice(value, currency) {
  if (currency === 'FC') return `${Number(value || 0).toFixed(0)} FC`
  return `$${Number(value || 0).toFixed(2)}`
}

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
          </button>
        </div>
      </div>

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
              const aScore = (a.subscription?.plan === 'pro' ? 2 : 0) + (a.boostPin?.active ? 1 : 0)
              const bScore = (b.subscription?.plan === 'pro' ? 2 : 0) + (b.boostPin?.active ? 1 : 0)
              return bScore - aScore
            })
            .map(vendor => (
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
          </div>
        </div>
      )}

      {toast && <div className="toast-banner">{toast}</div>}

      {selectedShopVendor && (
        <div className="modal-overlay" onClick={onCloseVendorShop}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{selectedShopVendor.name}</h3>
                <div className="vendor-meta">{selectedShopVendor.commune} · {selectedShopVendor.category}</div>
              </div>
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {activeProduct && (
        <div className="modal-overlay" onClick={onCloseProduct}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{activeProduct.title}</h3>
                <div className="vendor-meta">{activeProduct.vendorName}</div>
              </div>
              <button type="button" className="btn ghost" onClick={onCloseProduct}>Fermer</button>
            </div>
            <div className="modal-body">
              <div className="product-card detail">
                <img src={activeProduct.image || productImage(activeProduct.title, activeProduct.category)} alt={activeProduct.title} />
                <div>
                  <div className="product-price">{formatPrice(activeProduct.price, currency)}</div>
                  <p>{activeProduct.description}</p>
                  <button type="button" className="btn" onClick={() => { addToCart(activeProduct); showToast('Ajouté au panier') }}>Ajouter au panier</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="checkout-row">
                <strong>Total:</strong>
                <span>{formatPrice(Object.values(cart).reduce((sum, item) => sum + item.product.price * item.qty, 0), currency)}</span>
              </div>
              <button type="button" className="btn" onClick={onCheckout} disabled={cartCount === 0}>Simuler commande</button>
            </div>
          </div>
        </div>
      )}

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
                        </div>
                      )}
                    </div>
                  )}
                  {manageVendor.subscription?.plan === 'pro' && (
                    <div className="limit-label" style={{ color: '#10b981' }}>
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
    </div>
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
    </form>
  )
}
