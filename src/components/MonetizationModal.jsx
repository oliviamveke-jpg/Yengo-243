import React, { useState, useMemo } from 'react'
import { MONETIZATION, formatFC, formatUSD, fcToUsd, getProjectedRevenue, getEstimatedMonthlyCosts } from '../data/monetizationData'

export default function MonetizationModal({ vendors, orders, onClose, onSubscribe, onBoost, onSetDelivery, onUpdateVendor }) {
  const [activeTab, setActiveTab] = useState('subscription')

  const projectedRevenue = useMemo(() => getProjectedRevenue(), [])
  const monthlyCosts = useMemo(() => getEstimatedMonthlyCosts(), [])

  const proVendors = useMemo(() => vendors.filter(v => v.subscription?.plan === 'pro'), [vendors])
  const boostedVendors = useMemo(() => vendors.filter(v => v.boostPin?.active), [vendors])

  // Calculate actual commissions earned
  const commissionData = useMemo(() => {
    let totalCommissionUSD = 0
    let totalOrders = 0
    const byVendor = {}
    
    orders.forEach(order => {
      const vendor = vendors.find(v => v.id === order.vendorId)
      if (!vendor) return
      const commission = order.amount * order.qty * MONETIZATION.commission.rate
      totalCommissionUSD += commission
      totalOrders++
      if (!byVendor[vendor.id]) {
        byVendor[vendor.id] = { name: vendor.name, commissions: 0, orders: 0 }
      }
      byVendor[vendor.id].commissions += commission
      byVendor[vendor.id].orders += order.qty
    })

    return { totalCommissionUSD, totalOrders, byVendor }
  }, [orders, vendors])

  const tabs = [
    { id: 'subscription', label: 'Boutique Pro', icon: '👑' },
    { id: 'commission', label: 'Commission', icon: '💰' },
    { id: 'boost', label: 'Boost Pin', icon: '📌' },
    { id: 'delivery', label: 'Livraison', icon: '🚚' },
    { id: 'costs', label: 'Coûts & Revenue', icon: '📊' }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel monetization-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>💎 Yengo+243 — Monétisation</h3>
          <button type="button" className="btn ghost" onClick={onClose}>Fermer</button>
        </div>

        <div className="monetization-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`monetization-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="monetization-body">
          {/* TAB A: Abonnement Boutique Pro */}
          {activeTab === 'subscription' && (
            <SubscriptionTab
              vendors={vendors}
              proVendors={proVendors}
              onSubscribe={onSubscribe}
              onUpdateVendor={onUpdateVendor}
            />
          )}

          {/* TAB B: Commission sur vente */}
          {activeTab === 'commission' && (
            <CommissionTab commissionData={commissionData} />
          )}

          {/* TAB C: Boost Pin / Pub */}
          {activeTab === 'boost' && (
            <BoostPinTab
              vendors={vendors}
              boostedVendors={boostedVendors}
              onBoost={onBoost}
              onUpdateVendor={onUpdateVendor}
            />
          )}

          {/* TAB D: Yengo Livraison */}
          {activeTab === 'delivery' && (
            <DeliveryTab
              vendors={vendors}
              onSetDelivery={onSetDelivery}
              onUpdateVendor={onUpdateVendor}
              orders={orders}
            />
          )}

          {/* TAB E: Coûts & Revenue */}
          {activeTab === 'costs' && (
            <CostsTab projectedRevenue={projectedRevenue} monthlyCosts={monthlyCosts} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────── A. Abonnement Boutique Pro ─────────────── */
function SubscriptionTab({ vendors, proVendors, onSubscribe, onUpdateVendor }) {
  const [selectedVendorId, setSelectedVendorId] = useState('')

  const handleSubscribe = () => {
    if (!selectedVendorId) return
    onSubscribe(selectedVendorId)
    setSelectedVendorId('')
  }

  const handleCancel = (vendorId) => {
    onUpdateVendor(vendorId, { subscription: { plan: 'free', expiresAt: null, subscribedAt: null } })
  }

  return (
    <div className="monetization-tab-content">
      <div className="plan-comparison">
        <div className="plan-card free">
          <div className="plan-name">Gratuit</div>
          <div className="plan-price">{formatFC(0)}<span>/mois</span></div>
          <ul className="plan-features">
            <li>5 produits max</li>
            <li>Pin normal sur la carte</li>
            <li>Pas de badge</li>
          </ul>
        </div>
        <div className="plan-card pro featured">
          <div className="plan-popular">POPULAIRE</div>
          <div className="plan-name">Boutique Pro</div>
          <div className="plan-price">{formatFC(5000)}<span>/mois</span></div>
          <ul className="plan-features">
            <li>✓ Produits illimités</li>
            <li>✓ Pin en haut de la carte</li>
            <li>✓ Badge "Vérifié"</li>
            <li>✓ Statistiques avancées</li>
            <li>✓ Support prioritaire</li>
          </ul>
          <div className="plan-conversion">≈ {formatUSD(1.75)}/mois</div>
        </div>
      </div>

      <div className="subsection">
        <h4>Activer Pro pour une boutique</h4>
        <div className="inline-form">
          <select value={selectedVendorId} onChange={e => setSelectedVendorId(e.target.value)}>
            <option value="">Sélectionner une boutique…</option>
            {vendors.filter(v => v.subscription?.plan !== 'pro').map(v => (
              <option key={v.id} value={v.id}>{v.name} — {v.commune}</option>
            ))}
          </select>
          <button className="btn" onClick={handleSubscribe} disabled={!selectedVendorId}>
            Activer Pro (5000 FC)
          </button>
        </div>
      </div>

      {proVendors.length > 0 && (
        <div className="subsection">
          <h4>Boutiques Pro ({proVendors.length})</h4>
          <div className="pro-vendor-list">
            {proVendors.map(v => (
              <div key={v.id} className="pro-vendor-row">
                <div className="pro-vendor-info">
                  <span className="verified-badge-sm">✓ Vérifié</span>
                  <strong>{v.name}</strong>
                  <span className="vendor-loc">{v.commune}</span>
                </div>
                <button className="btn ghost small" onClick={() => handleCancel(v.id)}>
                  Résilier
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="projection-box">
        <div className="projection-label">Projection mensuelle (1 000 vendeurs Pro)</div>
        <div className="projection-value">{formatFC(5_000_000)} <span className="projection-usd">≈ {formatUSD(1750)}</span></div>
      </div>
    </div>
  )
}

/* ─────────────── B. Commission sur vente ─────────────── */
function CommissionTab({ commissionData }) {
  return (
    <div className="monetization-tab-content">
      <div className="info-card">
        <div className="info-card-header">Configuration de la commission</div>
        <div className="info-card-body">
          <div className="info-row">
            <span>Taux actuel</span>
            <span className="highlight">{MONETIZATION.commission.rate * 100}%</span>
          </div>
          <div className="info-row">
            <span>Plage</span>
            <span>{MONETIZATION.commission.minRate * 100}% – {MONETIZATION.commission.maxRate * 100}%</span>
          </div>
          <div className="info-row">
            <span>Appliqué sur</span>
            <span>Chaque transaction</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{formatUSD(commissionData.totalCommissionUSD)}</div>
          <div className="stat-label">Commissions totales perçues</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{commissionData.totalOrders}</div>
          <div className="stat-label">Transactions commissionnées</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatUSD(commissionData.totalCommissionUSD / (commissionData.totalOrders || 1))}</div>
          <div className="stat-label">Commission moyenne / transaction</div>
        </div>
      </div>

      {Object.keys(commissionData.byVendor).length > 0 && (
        <div className="subsection">
          <h4>Par boutique</h4>
          <div className="commission-list">
            {Object.values(commissionData.byVendor).map(v => (
              <div key={v.name} className="commission-row">
                <span>{v.name}</span>
                <span>{v.orders} commandes</span>
                <span className="highlight">{formatUSD(v.commissions)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="projection-box">
        <div className="projection-label">Projection mensuelle (100 ventes/jour × 10 000 FC × 3%)</div>
        <div className="projection-value">{formatFC(900_000)} <span className="projection-usd">≈ {formatUSD(315)}</span></div>
      </div>
    </div>
  )
}

/* ─────────────── C. Boost Pin / Pub ─────────────── */
function BoostPinTab({ vendors, boostedVendors, onBoost, onUpdateVendor }) {
  const [boostVendorId, setBoostVendorId] = useState('')
  const [boostDuration, setBoostDuration] = useState(1)

  const handleBoost = () => {
    if (!boostVendorId) return
    onBoost(boostVendorId, boostDuration)
    setBoostVendorId('')
  }

  const handleRemoveBoost = (vendorId) => {
    onUpdateVendor(vendorId, { boostPin: { active: false, expiresAt: null, boostedAt: null, days: 0 } })
  }

  const costPerDay = MONETIZATION.boostPin.dailyFC

  return (
    <div className="monetization-tab-content">
      <div className="info-card">
        <div className="info-card-header">Boost Pin — Comment ça marche</div>
        <div className="info-card-body">
          <p>Le vendeur paye <strong>{formatFC(MONETIZATION.boostPin.dailyFC)}</strong> ({formatUSD(MONETIZATION.boostPin.dailyUSD)}) par jour pour être affiché en premier sur la carte dans sa commune.</p>
          <ul className="feature-list">
            <li>Pin mis en évidence avec effet "Boost"</li>
            <li>Prioritaire dans les résultats de filtre</li>
            <li>Max {MONETIZATION.boostPin.maxBoostersPerCommune} boosters par commune</li>
            <li>Durée minimum : 1 jour</li>
          </ul>
        </div>
      </div>

      <div className="subsection">
        <h4>Booster une boutique</h4>
        <div className="inline-form">
          <select value={boostVendorId} onChange={e => setBoostVendorId(e.target.value)}>
            <option value="">Sélectionner une boutique…</option>
            {vendors.filter(v => !v.boostPin?.active).map(v => (
              <option key={v.id} value={v.id}>{v.name} — {v.commune}</option>
            ))}
          </select>
          <select value={boostDuration} onChange={e => setBoostDuration(Number(e.target.value))}>
            {[1, 2, 3, 5, 7, 14, 30].map(d => (
              <option key={d} value={d}>{d} jour{d > 1 ? 's' : ''} — {formatFC(costPerDay * d)}</option>
            ))}
          </select>
          <button className="btn" onClick={handleBoost} disabled={!boostVendorId}>
            Booster ({formatFC(costPerDay * boostDuration)})
          </button>
        </div>
      </div>

      {boostedVendors.length > 0 && (
        <div className="subsection">
          <h4>Boosts actifs ({boostedVendors.length})</h4>
          <div className="pro-vendor-list">
            {boostedVendors.map(v => (
              <div key={v.id} className="pro-vendor-row">
                <div className="pro-vendor-info">
                  <span className="boost-badge">📌 Boost</span>
                  <strong>{v.name}</strong>
                  <span className="vendor-loc">{v.commune}</span>
                </div>
                <button className="btn ghost small" onClick={() => handleRemoveBoost(v.id)}>
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="projection-box">
        <div className="projection-label">Projection mensuelle (50 boosters/jour × 1 000 FC)</div>
        <div className="projection-value">{formatFC(1_500_000)} <span className="projection-usd">≈ {formatUSD(525)}</span></div>
      </div>
    </div>
  )
}

/* ─────────────── D. Yengo Livraison ─────────────── */
function DeliveryTab({ vendors, onSetDelivery, onUpdateVendor, orders }) {
  const [deliveryVendorId, setDeliveryVendorId] = useState('')

  const handleEnableDelivery = () => {
    if (!deliveryVendorId) return
    onSetDelivery(deliveryVendorId)
    setDeliveryVendorId('')
  }

  const handleDisableDelivery = (vendorId) => {
    onUpdateVendor(vendorId, { delivery: { enabled: false, feeFC: 0, commissionRate: MONETIZATION.delivery.commissionRate } })
  }

  const deliveryVendors = useMemo(() => vendors.filter(v => v.delivery?.enabled), [vendors])

  // Calculate delivery commission earned
  const deliveryStats = useMemo(() => {
    let totalDeliveries = 0
    let totalCommissionUSD = 0
    let totalFeeFC = 0
    
    orders.forEach(order => {
      const vendor = vendors.find(v => v.id === order.vendorId)
      if (!vendor || !vendor.delivery?.enabled) return
      const fee = vendor.delivery.feeFC || MONETIZATION.delivery.baseFeeFC
      const commission = fee * MONETIZATION.delivery.commissionRate
      totalFeeFC += fee
      totalCommissionUSD += fcToUsd(commission)
      totalDeliveries += order.qty
    })

    return { totalDeliveries, totalCommissionUSD, totalFeeFC }
  }, [orders, vendors])

  return (
    <div className="monetization-tab-content">
      <div className="info-card">
        <div className="info-card-header">Yengo Livraison</div>
        <div className="info-card-body">
          <p>Yengo prend <strong>{MONETIZATION.delivery.commissionRate * 100}%</strong> sur les frais de livraison.</p>
          <ul className="feature-list">
            <li>Frais de livraison de base : {formatFC(MONETIZATION.delivery.baseFeeFC)} ({formatUSD(MONETIZATION.delivery.baseFeeUSD)})</li>
            <li>Commission Yengo : {MONETIZATION.delivery.commissionRate * 10}%</li>
            <li>Le vendeur définit ses propres frais de livraison</li>
          </ul>
        </div>
      </div>

      <div className="subsection">
        <h4>Activer la livraison pour une boutique</h4>
        <div className="inline-form">
          <select value={deliveryVendorId} onChange={e => setDeliveryVendorId(e.target.value)}>
            <option value="">Sélectionner une boutique…</option>
            {vendors.filter(v => !v.delivery?.enabled).map(v => (
              <option key={v.id} value={v.id}>{v.name} — {v.commune}</option>
            ))}
          </select>
          <button className="btn" onClick={handleEnableDelivery} disabled={!deliveryVendorId}>
            Activer Livraison
          </button>
        </div>
      </div>

      {deliveryVendors.length > 0 && (
        <div className="subsection">
          <h4>Boutiques avec livraison ({deliveryVendors.length})</h4>
          <div className="pro-vendor-list">
            {deliveryVendors.map(v => (
              <div key={v.id} className="pro-vendor-row">
                <div className="pro-vendor-info">
                  <span className="delivery-badge">🚚 Livraison</span>
                  <strong>{v.name}</strong>
                  <span className="vendor-loc">{formatFC(v.delivery.feeFC || MONETIZATION.delivery.baseFeeFC)} frais</span>
                </div>
                <button className="btn ghost small" onClick={() => handleDisableDelivery(v.id)}>
                  Désactiver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{deliveryStats.totalDeliveries}</div>
          <div className="stat-label">Livraisons effectuées</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatUSD(deliveryStats.totalCommissionUSD)}</div>
          <div className="stat-label">Commissions livraison perçues</div>
        </div>
      </div>

      <div className="projection-box">
        <div className="projection-label">Projection mensuelle (200 livraisons × 3 000 FC × 10%)</div>
        <div className="projection-value">{formatFC(60_000)} <span className="projection-usd">≈ {formatUSD(21)}</span></div>
      </div>
    </div>
  )
}

/* ─────────────── E. Coûts & Revenue ─────────────── */
function CostsTab({ projectedRevenue, monthlyCosts }) {
  return (
    <div className="monetization-tab-content">
      <h4 className="section-title-revenue">📈 Revenue Projection — Phase 1 (avec trafic)</h4>

      <div className="revenue-breakdown">
        <div className="revenue-row">
          <div className="revenue-source">
            <span className="revenue-icon">👑</span>
            <span>Abonnement Boutique Pro</span>
          </div>
          <div className="revenue-amounts">
            <span className="amount-fc">{formatFC(projectedRevenue.breakdown.subscriptions.fc)}</span>
            <span className="amount-usd">{formatUSD(projectedRevenue.breakdown.subscriptions.usd)}</span>
          </div>
        </div>
        <div className="revenue-row">
          <div className="revenue-source">
            <span className="revenue-icon">💰</span>
            <span>Commission sur ventes</span>
          </div>
          <div className="revenue-amounts">
            <span className="amount-fc">{formatFC(projectedRevenue.breakdown.commissions.fc)}</span>
            <span className="amount-usd">{formatUSD(projectedRevenue.breakdown.commissions.usd)}</span>
          </div>
        </div>
        <div className="revenue-row">
          <div className="revenue-source">
            <span className="revenue-icon">📌</span>
            <span>Boost Pin / Pub</span>
          </div>
          <div className="revenue-amounts">
            <span className="amount-fc">{formatFC(projectedRevenue.breakdown.boostPin.fc)}</span>
            <span className="amount-usd">{formatUSD(projectedRevenue.breakdown.boostPin.usd)}</span>
          </div>
        </div>
        <div className="revenue-row">
          <div className="revenue-source">
            <span className="revenue-icon">🚚</span>
            <span>Yengo Livraison</span>
          </div>
          <div className="revenue-amounts">
            <span className="amount-fc">{formatFC(projectedRevenue.breakdown.delivery.fc)}</span>
            <span className="amount-usd">{formatUSD(projectedRevenue.breakdown.delivery.usd)}</span>
          </div>
        </div>
        <div className="revenue-row total">
          <div className="revenue-source">
            <strong>Total mensuel</strong>
          </div>
          <div className="revenue-amounts">
            <span className="amount-fc total-fc">{formatFC(projectedRevenue.totalMonthlyFC)}</span>
            <span className="amount-usd total-usd">{formatUSD(projectedRevenue.totalMonthlyUSD)}</span>
          </div>
        </div>
      </div>

      <h4 className="section-title-revenue">💸 Coûts mensuels estimés — Phase 1</h4>

      <div className="costs-breakdown">
        <div className="cost-row">
          <span>Supabase Pro</span>
          <span className="cost-value">{formatUSD(monthlyCosts.supabasePro)}</span>
        </div>
        <div className="cost-row">
          <span>Mapbox (jusqu'à 50 000 vues carte/mois)</span>
          <span className="cost-value">Gratuit → {formatUSD(monthlyCosts.mapbox.after)}</span>
        </div>
        <div className="cost-row">
          <span>Hébergement Vercel/Netlify</span>
          <span className="cost-value">{formatUSD(monthlyCosts.hosting.min)} – {formatUSD(monthlyCosts.hosting.max)}</span>
        </div>
        <div className="cost-row">
          <span>SMS/WhatsApp API</span>
          <span className="cost-value">{formatUSD(monthlyCosts.smsApi.perMessage)} / message</span>
        </div>
        <div className="cost-row total">
          <span>Total coûts (estimation basse – haute)</span>
          <span className="cost-value">{formatUSD(monthlyCosts.totalMin)} – {formatUSD(monthlyCosts.totalMax)}</span>
        </div>
      </div>

      <div className="profit-summary">
        <div className="profit-row">
          <span>Revenue mensuel projeté</span>
          <span className="profit-positive">{formatUSD(projectedRevenue.totalMonthlyUSD)}</span>
        </div>
        <div className="profit-row">
          <span>Coûts mensuels (est. haute)</span>
          <span className="profit-negative">{formatUSD(monthlyCosts.totalMax)}</span>
        </div>
        <div className="profit-row total">
          <span>Profit net projeté</span>
          <span className="profit-positive">{formatUSD(projectedRevenue.totalMonthlyUSD - monthlyCosts.totalMax)}</span>
        </div>
      </div>
    </div>
  )
}
