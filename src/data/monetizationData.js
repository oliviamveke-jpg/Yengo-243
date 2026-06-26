// Yengo+243 Monetization Data
// Revenue model, pricing, and cost configuration

export const MONETIZATION = {
  // A. Abonnement Boutique Pro
  proSubscription: {
    free: {
      label: 'Gratuit',
      maxProducts: 5,
      pinPosition: 'normal',
      badge: null,
      priceFC: 0
    },
    pro: {
      label: 'Pro',
      monthlyFC: 5000,
      monthlyUSD: 1.75,
      maxProducts: Infinity,
      pinPosition: 'top',
      badge: 'Vérifié',
      features: [
        'Produits illimités',
        'Pin en haut de la carte',
        'Badge "Vérifié"',
        'Statistiques avancées',
        'Support prioritaire'
      ]
    }
  },

  // B. Commission sur vente
  commission: {
    rate: 0.03, // 3% par défaut
    minRate: 0.02,
    maxRate: 0.05,
    perTransaction: true
  },

  // C. Boost Pin / Pub
  boostPin: {
    dailyFC: 1000,
    dailyUSD: 0.35,
    durationHours: 24,
    maxBoostersPerCommune: 3
  },

  // D. Yengo Livraison
  delivery: {
    commissionRate: 0.10, // 10% sur les frais
    baseFeeFC: 3000,
    baseFeeUSD: 1.05
  },

  // Revenue Projections (Phase 1 – avec trafic)
  projections: {
    proSubscriptions: {
      vendorsCount: 1000,
      monthlyPerVendorFC: 5000,
      monthlyFC: 5_000_000,
      monthlyUSD: 1750
    },
    salesCommission: {
      dailySales: 100,
      avgOrderFC: 10000,
      commissionRate: 0.03,
      dailyFC: 30000,
      monthlyFC: 900_000,
      monthlyUSD: 315
    },
    boostPin: {
      dailyBoosters: 50,
      dailyPerBoosterFC: 1000,
      dailyFC: 50000,
      monthlyFC: 1_500_000,
      monthlyUSD: 525
    },
    delivery: {
      monthlyDeliveries: 200,
      avgDeliveryFeeFC: 3000,
      commissionRate: 0.10,
      monthlyFC: 60000,
      monthlyUSD: 21
    }
  },

  // Coûts mensuels estimés Phase 1
  costs: {
    supabasePro: 25,
    mapbox: { freeUntil: 50000, after: 5 },
    hosting: { min: 0, max: 20 },
    smsApi: { perMessage: 0.02 }
  },

  // Taux de conversion
  exchangeRate: 2850 // 1 USD = 2850 FC (approximatif)
}

// Helper functions
export function fcToUsd(fcAmount) {
  return fcAmount / MONETIZATION.exchangeRate
}

export function usdToFc(usdAmount) {
  return usdAmount * MONETIZATION.exchangeRate
}

export function formatFC(amount) {
  return `${Number(amount || 0).toLocaleString('fr-CD')} FC`
}

export function formatUSD(amount) {
  return `$${Number(amount || 0).toFixed(2)}`
}

export function formatAmount(amount, currency) {
  if (currency === 'FC') return formatFC(amount)
  return formatUSD(amount)
}

export function getProjectedRevenue() {
  const p = MONETIZATION.projections
  const totalFC = p.proSubscriptions.monthlyFC 
    + p.salesCommission.monthlyFC 
    + p.boostPin.monthlyFC 
    + p.delivery.monthlyFC
  const totalUSD = fcToUsd(totalFC)
  return {
    breakdown: {
      subscriptions: { fc: p.proSubscriptions.monthlyFC, usd: p.proSubscriptions.monthlyUSD },
      commissions: { fc: p.salesCommission.monthlyFC, usd: p.salesCommission.monthlyUSD },
      boostPin: { fc: p.boostPin.monthlyFC, usd: p.boostPin.monthlyUSD },
      delivery: { fc: p.delivery.monthlyFC, usd: p.delivery.monthlyUSD }
    },
    totalMonthlyFC: totalFC,
    totalMonthlyUSD: totalUSD
  }
}

export function getEstimatedMonthlyCosts() {
  const c = MONETIZATION.costs
  return {
    supabasePro: c.supabasePro,
    mapbox: c.mapbox,
    hosting: c.hosting,
    smsApi: c.smsApi,
    totalMin: c.supabasePro + c.mapbox.freeUntil + c.hosting.min,
    totalMax: c.supabasePro + c.mapbox.after + c.hosting.max
  }
}

// Default subscription expiration (30 days from now)
export function getDefaultSubscriptionExpiry() {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date.toISOString()
}
