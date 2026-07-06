/**
 * Yengo+243 Centralized Category Configuration
 *
 * Single source of truth for all category icons, colors, and labels.
 * Markers, legend, and business details all read from here.
 *
 * ── Design Philosophy ──
 * Each category has a stable canonical ID used internally.
 * Multiple name aliases (French, English, misspellings) map to
 * the same canonical ID so older database values work without
 * migration.
 *
 * ── Adding a new category ──
 * 1. Add an entry with a unique `id`
 * 2. Provide all known name variants in `names`
 * 3. Choose an emoji `icon` and solid `color`
 * The legend and markers will pick it up automatically.
 */

const CATEGORY_CONFIG = [
  // ═══════════════════════════════════════════════════
  //  Food & Dining
  // ═══════════════════════════════════════════════════
  {
    id: 'restaurant',
    label: 'Restaurants',
    icon: '🍴',
    color: '#EF4444',
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    hoverColor: '#FEE2E2',
    names: [
      'Restaurant', 'Restaurants', 'Alimentation', 'Food',
      'Food & Restaurants', 'Nourriture', 'Restauration',
      'Café', 'Coffee', 'Bar', 'Boissons', 'Drinks',
      'Boulangerie', 'Bakery', 'Épicerie', 'Grocery'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Shopping / Retail
  // ═══════════════════════════════════════════════════
  {
    id: 'shopping',
    label: 'Shopping',
    icon: '🛒',
    color: '#8B5CF6',
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
    hoverColor: '#EDE9FE',
    names: [
      'Shopping', 'Électronique', 'Electronics',
      'Electronics & Technology', 'Electronic', 'Tech',
      'Vêtements', 'Clothing', 'Fashion & Clothing',
      'Fashion', 'Mode', 'Magasins', 'Stores',
      'Supermarché', 'Supermarket', 'Boutique'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Health
  // ═══════════════════════════════════════════════════
  {
    id: 'health',
    label: 'Health',
    icon: '🏥',
    color: '#06B6D4',
    borderColor: '#06B6D4',
    backgroundColor: '#ECFEFF',
    hoverColor: '#CFFAFE',
    names: [
      'Health', 'Santé', 'Health & Beauty',
      'Medical', 'Médical', 'Hospital', 'Hôpital',
      'Clinique', 'Clinic', 'Doctor', 'Médecin'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Pharmacy
  // ═══════════════════════════════════════════════════
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    icon: '💊',
    color: '#EC4899',
    borderColor: '#EC4899',
    backgroundColor: '#FDF2F8',
    hoverColor: '#FCE7F3',
    names: [
      'Pharmacy', 'Pharmacie', 'Drugstore',
      'Médicaments', 'Medicines'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Hotels / Accommodation
  // ═══════════════════════════════════════════════════
  {
    id: 'hotels',
    label: 'Hotels',
    icon: '🏨',
    color: '#F59E0B',
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
    hoverColor: '#FEF3C7',
    names: [
      'Hotel', 'Hotels', 'Hôtel', 'Hôtels',
      'Lodging', 'Hébergement', 'Accommodation',
      'Guest House', 'Auberge'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Education
  // ═══════════════════════════════════════════════════
  {
    id: 'education',
    label: 'Education',
    icon: '🎓',
    color: '#6366F1',
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
    hoverColor: '#E0E7FF',
    names: [
      'Education', 'Éducation', 'School', 'École',
      'University', 'Université', 'College',
      'Formation', 'Training', 'Cours', 'Course'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Automotive
  // ═══════════════════════════════════════════════════
  {
    id: 'automotive',
    label: 'Automotive',
    icon: '🚗',
    color: '#F97316',
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
    hoverColor: '#FFEDD5',
    names: [
      'Automotive', 'Automobile', 'Auto Repair',
      'Garage', 'Mécanicien', 'Mechanic',
      'Car', 'Voiture', 'Pièces auto', 'Auto parts',
      'Véhicules', 'Vehicles'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Banks / Finance
  // ═══════════════════════════════════════════════════
  {
    id: 'banks',
    label: 'Banks',
    icon: '🏦',
    color: '#059669',
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
    hoverColor: '#D1FAE5',
    names: [
      'Bank', 'Banks', 'Banque', 'Banques',
      'Finance', 'Financial', 'Assurance',
      'Insurance', 'Microfinance'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Professional Services
  // ═══════════════════════════════════════════════════
  {
    id: 'professional-services',
    label: 'Professional Services',
    icon: '💼',
    color: '#1D4ED8',
    borderColor: '#1D4ED8',
    backgroundColor: '#EFF6FF',
    hoverColor: '#DBEAFE',
    names: [
      'Professional Services', 'Services Professionnels',
      'Services', 'Service', 'Consulting', 'Consultation',
      'Lawyer', 'Avocat', 'Notary', 'Notaire',
      'Accounting', 'Comptabilité', 'Agency', 'Agence'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Real Estate
  // ═══════════════════════════════════════════════════
  {
    id: 'real-estate',
    label: 'Real Estate',
    icon: '🏠',
    color: '#14B8A6',
    borderColor: '#14B8A6',
    backgroundColor: '#F0FDFA',
    hoverColor: '#CCFBF1',
    names: [
      'Real Estate', 'Immobilier', 'Maison', 'Home',
      'Home & Garden', 'Jardin', 'Propriété', 'Property',
      'Logement', 'Housing', 'Appartement', 'Apartment'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Construction / Handyman
  // ═══════════════════════════════════════════════════
  {
    id: 'construction',
    label: 'Construction',
    icon: '⚒️',
    color: '#78716C',
    borderColor: '#78716C',
    backgroundColor: '#F5F5F4',
    hoverColor: '#E7E5E4',
    names: [
      'Construction', 'Bâtiment', 'Outillage', 'Tools',
      'Handyman', 'Bricolage', 'Contractor',
      'Entrepreneur', 'Rénovation', 'Renovation',
      'Matériaux', 'Materials'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Beauty & Personal Care
  // ═══════════════════════════════════════════════════
  {
    id: 'beauty',
    label: 'Beauty',
    icon: '✂️',
    color: '#E91E63',
    borderColor: '#E91E63',
    backgroundColor: '#FCE4EC',
    hoverColor: '#F8BBD0',
    names: [
      'Beauty', 'Beauté', 'Salon', 'Coiffure',
      'Hair', 'Cheveux', 'Spa', 'Nail', 'Ongles',
      'Cosmétique', 'Cosmetics', 'Maquillage', 'Makeup',
      'Barbier', 'Barber'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Entertainment
  // ═══════════════════════════════════════════════════
  {
    id: 'entertainment',
    label: 'Entertainment',
    icon: '🎭',
    color: '#D946EF',
    borderColor: '#D946EF',
    backgroundColor: '#FDF2F8',
    hoverColor: '#FCE7F3',
    names: [
      'Entertainment', 'Divertissement', 'Cinéma', 'Cinema',
      'Music', 'Musique', 'Concert', 'Théâtre', 'Theatre',
      'Nightlife', 'Vie nocturne'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Sports & Fitness
  // ═══════════════════════════════════════════════════
  {
    id: 'sports',
    label: 'Sports & Fitness',
    icon: '⚽',
    color: '#22C55E',
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
    hoverColor: '#DCFCE7',
    names: [
      'Sports', 'Sport', 'Fitness', 'Gym', 'Salle de sport',
      'Sports & Fitness', 'Football', 'Basketball'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  Travel & Tourism
  // ═══════════════════════════════════════════════════
  {
    id: 'travel',
    label: 'Travel & Tourism',
    icon: '✈️',
    color: '#0EA5E9',
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
    hoverColor: '#E0F2FE',
    names: [
      'Travel', 'Tourism', 'Tourisme', 'Voyage',
      'Travel & Tourism', 'Transport', 'Agency',
      'Agence de voyage', 'Taxi', 'Bus'
    ]
  },

  // ═══════════════════════════════════════════════════
  //  General / Default (fallback)
  // ═══════════════════════════════════════════════════
  {
    id: 'general',
    label: 'General',
    icon: '📍',
    color: '#6B7280',
    borderColor: '#6B7280',
    backgroundColor: '#F9FAFB',
    hoverColor: '#F3F4F6',
    names: [
      'General', 'Général', 'Other', 'Autre',
      'Boutique', 'Shop', 'Store', 'Business',
      'Entreprise', 'Commerce'
    ]
  }
]

/**
 * ---- Build lookup index ----
 * Map every name variant (lowercased) to its config entry.
 * This makes `getCategoryConfig` O(1) after init.
 */
const _nameIndex = {}
const _idIndex = {}

for (const entry of CATEGORY_CONFIG) {
  _idIndex[entry.id] = entry
  for (const name of entry.names) {
    _nameIndex[name.toLowerCase().trim()] = entry
  }
}

/**
 * ---- Normalize a category name for indexing ----
 * Strips accents, trims, lowercases.
 */
function normalize(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * ---- Get the category config for any category name ----
 * Handles case-insensitive, accent-insensitive matching.
 * Returns the config object, or the GENERAL config as fallback.
 *
 * @param {string} name - Any category name (French, English, etc.)
 * @returns {object} category config with { id, label, icon, color, ... }
 */
export function getCategoryConfig(name) {
  if (!name) return _idIndex['general']

  const key = normalize(name)
  return _nameIndex[key] || _idIndex['general']
}

/**
 * ---- Get category config by canonical ID ----
 * Useful when you already know the ID (e.g. from a normalized source).
 */
export function getCategoryConfigById(id) {
  return _idIndex[id] || _idIndex['general']
}

/**
 * ---- Get ALL category configs (for rendering the legend) ----
 * Excludes the 'general' fallback unless `includeGeneral` is true.
 */
export function getAllCategoryConfigs(includeGeneral = false) {
  if (includeGeneral) return CATEGORY_CONFIG
  return CATEGORY_CONFIG.filter(c => c.id !== 'general')
}

/**
 * ---- Get the color for a category ----
 * Shortcut: returns the main marker color.
 */
export function getCategoryColor(name) {
  return getCategoryConfig(name).color
}

/**
 * ---- Get the icon for a category ----
 * Shortcut: returns the emoji icon.
 */
export function getCategoryIcon(name) {
  return getCategoryConfig(name).icon
}

/**
 * ---- Map any business category to a canonical ID ----
 * Useful for grouping / filtering by canonical category.
 */
export function getCategoryId(name) {
  return getCategoryConfig(name).id
}

export default CATEGORY_CONFIG
