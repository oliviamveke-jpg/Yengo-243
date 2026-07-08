/**
 * Location Service — Multi-province geographic database for DRC
 *
 * Provides cascading dropdown data: Province → Commune → Quartier → Rue
 * Supports adding new quartiers and rues at runtime (persisted via storageAdapter).
 * All data is normalized: trimmed, case-insensitive dedup, capitalized.
 */

import { storageAdapter, STORAGE_KEYS } from './storageAdapter'
import { kinshasaLocationData } from '../data/locationData'

// ─── Internal slug helper ───
function slug(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── Normalize a location name: capitalize first letter of each word, trim ───
function normalizeName(name) {
  if (!name) return ''
  return String(name)
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/\bNd\b/gi, 'N\'d')
}

// ─── DRC Provinces (all 26) ───
const PROVINCES = [
  'Bas-Uélé',
  'Équateur',
  'Haut-Katanga',
  'Haut-Lomami',
  'Haut-Uélé',
  'Ituri',
  'Kasaï',
  'Kasaï-Central',
  'Kasaï-Oriental',
  'Kinshasa',
  'Kongo Central',
  'Kwango',
  'Kwilu',
  'Lomami',
  'Lualaba',
  'Mai-Ndombe',
  'Maniema',
  'Mongala',
  'Nord-Kivu',
  'Nord-Ubangi',
  'Sankuru',
  'Sud-Kivu',
  'Sud-Ubangi',
  'Tanganyika',
  'Tshopo',
  'Tshuapa'
]

// ─── Static commune/quartier database (extends Kinshasa from locationData.js) ───
// We keep the existing Kinshasa data (which has coordinates) and add other provinces
// with basic name data (coordinates can be added later via geocoding).
let _staticDB = null

function buildStaticDB() {
  if (_staticDB) return _staticDB

  const db = {
    provinces: {},
    communes: {},
    quartiers: {}
  }

  // Register provinces
  PROVINCES.forEach(p => {
    const id = slug(p)
    db.provinces[id] = { id, name: p }
  })

  // Import Kinshasa data from existing locationData.js
  const k = kinshasaLocationData
  const kinshasaId = 'kinshasa'
  db.provinces[kinshasaId] = { id: kinshasaId, name: 'Kinshasa' }

  if (k.communes) {
    for (const [communeName, communeData] of Object.entries(k.communes)) {
      const communeId = `kinshasa-${slug(communeName)}`
      db.communes[communeId] = {
        id: communeId,
        provinceId: kinshasaId,
        name: communeName,
        coords: communeData?.coords || communeData?.centroid || null
      }

      if (communeData?.quartiers) {
        for (const [quartierName] of Object.entries(communeData.quartiers)) {
          const quartierId = `${communeId}-${slug(quartierName)}`
          db.quartiers[quartierId] = {
            id: quartierId,
            communeId,
            name: quartierName
          }
        }
      }
    }
  }

  // Add some known communes for other major provinces
  // Kongo Central
  const kongoCentralCommunes = [
    'Matadi', 'Boma', 'Moanda', 'Lukula', 'Tshela', 'Mbanza-Ngungu', 'Kimpese', 'Kasangulu', 'Madimba', 'Kimvula', 'Songololo', 'Seke-Banza', 'Nzeto', 'Tomboco'
  ]
  kongoCentralCommunes.forEach(c => {
    const communeId = `kongo-central-${slug(c)}`
    db.communes[communeId] = { id: communeId, provinceId: 'kongo-central', name: c, coords: null }
    // Each commune gets a default "Centre" quartier
    const quartierId = `${communeId}-centre`
    db.quartiers[quartierId] = { id: quartierId, communeId, name: 'Centre' }
  })

  // Haut-Katanga
  const hautKatangaCommunes = [
    'Lubumbashi', 'Likasi', 'Kolwezi', 'Kipushi', 'Kasumbalesa', 'Kambove', 'Pweto', 'Mitwaba', 'Kakanda', 'Mutshatsha'
  ]
  hautKatangaCommunes.forEach(c => {
    const communeId = `haut-katanga-${slug(c)}`
    db.communes[communeId] = { id: communeId, provinceId: 'haut-katanga', name: c, coords: null }
    const quartierId = `${communeId}-centre`
    db.quartiers[quartierId] = { id: quartierId, communeId, name: 'Centre' }
  })

  // Nord-Kivu
  const nordKivuCommunes = [
    'Goma', 'Butembo', 'Beni', 'Kanyabayonga', 'Mabanga', 'Musienene', 'Kaina'
  ]
  nordKivuCommunes.forEach(c => {
    const communeId = `nord-kivu-${slug(c)}`
    db.communes[communeId] = { id: communeId, provinceId: 'nord-kivu', name: c, coords: null }
    const quartierId = `${communeId}-centre`
    db.quartiers[quartierId] = { id: quartierId, communeId, name: 'Centre' }
  })

  // Sud-Kivu
  const sudKivuCommunes = [
    'Bukavu', 'Uvira', 'Baraka', 'Shabunda', 'Walungu', 'Mwenga', 'Kalehe'
  ]
  sudKivuCommunes.forEach(c => {
    const communeId = `sud-kivu-${slug(c)}`
    db.communes[communeId] = { id: communeId, provinceId: 'sud-kivu', name: c, coords: null }
    const quartierId = `${communeId}-centre`
    db.quartiers[quartierId] = { id: quartierId, communeId, name: 'Centre' }
  })

  // Kasaï-Oriental
  const kasaiCommunes = [
    'Mbuji-Mayi', 'Mwene-Ditu', 'Kabinda', 'Gandajika', 'Mwena', 'Tshilenge'
  ]
  kasaiCommunes.forEach(c => {
    const communeId = `kasai-oriental-${slug(c)}`
    db.communes[communeId] = { id: communeId, provinceId: 'kasai-oriental', name: c, coords: null }
    const quartierId = `${communeId}-centre`
    db.quartiers[quartierId] = { id: quartierId, communeId, name: 'Centre' }
  })

  _staticDB = db
  return db
}

// ─── Persisted user-added quartiers & rues ───
function getUserQuartiers() {
  return storageAdapter.read('yengoUserQuartiers', [])
}

function setUserQuartiers(qs) {
  return storageAdapter.write('yengoUserQuartiers', qs)
}

function getUserRues() {
  return storageAdapter.read('yengoUserRues', [])
}

function setUserRues(rs) {
  return storageAdapter.write('yengoUserRues', rs)
}

// ─── Public API ───

/**
 * Get all provinces as { id, name }[]
 */
export function getProvinces() {
  const db = buildStaticDB()
  return Object.values(db.provinces).sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get communes for a province as { id, name }[]
 */
export function getCommunes(provinceId) {
  if (!provinceId) return []
  const db = buildStaticDB()
  return Object.values(db.communes)
    .filter(c => c.provinceId === provinceId)
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get quartiers for a commune as { id, name }[]
 * Includes both static and user-added quartiers.
 */
export function getQuartiers(communeId) {
  if (!communeId) return []
  const db = buildStaticDB()
  const staticQuartiers = Object.values(db.quartiers)
    .filter(q => q.communeId === communeId)
    .map(q => ({ id: q.id, name: q.name }))

  const userQuartiers = getUserQuartiers()
    .filter(q => q.communeId === communeId)
    .map(q => ({ id: q.id, name: q.name }))

  // Merge, deduplicate by name
  const seen = new Set()
  const merged = []
  for (const q of [...staticQuartiers, ...userQuartiers]) {
    const key = q.name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      merged.push(q)
    }
  }
  return merged.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get rues for a quartier as { id, name }[]
 */
export function getRues(quartierId) {
  if (!quartierId) return []
  return getUserRues()
    .filter(r => r.quartierId === quartierId)
    .map(r => ({ id: r.id, name: r.name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Find a quartier by ID (static or user-added).
 */
export function getQuartierById(quartierId) {
  if (!quartierId) return null
  const db = buildStaticDB()
  if (db.quartiers[quartierId]) return { id: quartierId, name: db.quartiers[quartierId].name }
  const userQ = getUserQuartiers().find(q => q.id === quartierId)
  if (userQ) return { id: userQ.id, name: userQ.name }
  return null
}

/**
 * Find a commune by ID.
 */
export function getCommuneById(communeId) {
  if (!communeId) return null
  const db = buildStaticDB()
  const c = db.communes[communeId]
  return c ? { id: c.id, name: c.name, provinceId: c.provinceId } : null
}

/**
 * Find a province by ID.
 */
export function getProvinceById(provinceId) {
  if (!provinceId) return null
  const db = buildStaticDB()
  const p = db.provinces[provinceId]
  return p ? { id: p.id, name: p.name } : null
}

/**
 * Add a new quartier to a commune.
 * - Normalizes capitalization
 * - Prevents duplicates (case-insensitive)
 * - Returns { id, name }
 */
export function addQuartier(communeId, name) {
  const normalized = normalizeName(name)
  if (!normalized) throw new Error('Quartier name is required')

  // Check duplicates in existing data
  const existing = getQuartiers(communeId)
  const dup = existing.find(q => q.name.toLowerCase() === normalized.toLowerCase())
  if (dup) return dup // Return existing instead of creating duplicate

  const id = `${communeId}-user-${slug(normalized)}-${Date.now()}`
  const newQuartier = { id, communeId, name: normalized }

  const quartiers = getUserQuartiers()
  quartiers.push(newQuartier)
  setUserQuartiers(quartiers)

  return { id, name: normalized }
}

/**
 * Find or create a rue within a quartier.
 * - Normalizes capitalization
 * - Prevents duplicates within same quartier (case-insensitive)
 * - Returns { id, name }
 */
export function findOrCreateRue(quartierId, name) {
  const normalized = normalizeName(name)
  if (!normalized) throw new Error('Rue name is required')

  const existing = getUserRues().filter(r => r.quartierId === quartierId)
  const dup = existing.find(r => r.name.toLowerCase() === normalized.toLowerCase())
  if (dup) return { id: dup.id, name: dup.name }

  const id = `rue-${slug(normalized)}-${Date.now()}`
  const newRue = { id, quartierId, name: normalized }

  const rues = getUserRues()
  rues.push(newRue)
  setUserRues(rues)

  return { id, name: normalized }
}

/**
 * Validate and normalize a Congolese phone number.
 * Accepted: +243XXXXXXXXX, 243XXXXXXXXX, +243 XXX XXX XXX
 * Returns normalized +243XXXXXXXXX or null.
 */
export function normalizeWhatsAppNumber(number) {
  if (!number) return null
  const cleaned = String(number).replace(/[\s\-\+\_\(\)]/g, '')
  // Match 243 followed by 9 digits
  const match = cleaned.match(/^243(\d{9})$/)
  if (match) return `+243${match[1]}`
  return null
}

export function validateWhatsAppNumber(number) {
  return normalizeWhatsAppNumber(number) !== null
}

// ─── Coordinate resolution helpers ───

/**
 * Get the centroid/coords for a quartier by ID.
 * Checks: quartier-level data → commune coords → Kinshasa center.
 */
export function getQuartierCentroid(quartierId) {
  if (!quartierId) return null
  const db = buildStaticDB()
  // Check static quartiers for coords (some have them in locationData)
  const q = db.quartiers[quartierId]
  if (q && q.coords) return q.coords

  // Try user-added quartiers (no coords stored)
  // Fall back to parent commune coords
  const communeId = q ? q.communeId : null
  if (communeId) {
    const c = db.communes[communeId]
    if (c && c.coords) return c.coords
  }
  return null
}

/**
 * Get the centroid/coords for a commune by ID.
 * Checks: commune data → province coords → Kinshasa center.
 */
export function getCommuneCentroid(communeId) {
  if (!communeId) return null
  const db = buildStaticDB()
  const c = db.communes[communeId]
  if (c && c.coords) return c.coords

  // Fall back to province coords
  if (c && c.provinceId) {
    const p = db.provinces[c.provinceId]
    if (p && p.coords) return p.coords
  }
  return null
}

/**
 * Get the best available centroid for a location hierarchy.
 * Priority: quartier centroid → commune centroid → province centroid → Kinshasa center.
 *
 * @param {string} quartierId
 * @param {string} communeId
 * @param {string} provinceId
 * @returns {[number, number] | null}
 */
export function getBestCentroid(quartierId, communeId, provinceId) {
  // 1. Try quartier
  if (quartierId) {
    const coords = getQuartierCentroid(quartierId)
    if (coords) return coords
  }

  // 2. Try commune
  if (communeId) {
    const coords = getCommuneCentroid(communeId)
    if (coords) return coords
  }

  // 3. Try province
  if (provinceId) {
    const db = buildStaticDB()
    const p = db.provinces[provinceId]
    if (p && p.coords) return p.coords
  }

  // 4. Ultimate fallback: Kinshasa center
  return kinshasaLocationData.coords || [-4.3219402, 15.3118474]
}

/**
 * Get the commune's province ID from a quartier ID.
 */
export function getCommonProvinceId(communeId) {
  if (!communeId) return null
  const db = buildStaticDB()
  const c = db.communes[communeId]
  return c ? c.provinceId : null
}

/**
 * Get province centroid.
 */
export function getProvinceCentroid(provinceId) {
  if (!provinceId) return null
  const db = buildStaticDB()
  const p = db.provinces[provinceId]
  if (p && p.coords) return p.coords
  return null
}

// ─── Backward-compatible helpers ───

/**
 * Get province-level options as string[] (for backward compat with existing filters).
 */
export function getProvinceOptions() {
  return getProvinces().map(p => p.name)
}

/**
 * Get commune names for a province name (backward compat).
 */
export function getCommuneOptions(provinceName) {
  if (!provinceName) return []
  const db = buildStaticDB()
  const province = Object.values(db.provinces).find(p => p.name === provinceName)
  if (!province) return []
  return getCommunes(province.id).map(c => c.name)
}

/**
 * Get quartier names for a commune name (backward compat).
 */
export function getQuartierOptions(communeName) {
  if (!communeName) return []
  const db = buildStaticDB()
  const commune = Object.values(db.communes).find(c => c.name === communeName)
  if (!commune) return []
  return getQuartiers(commune.id).map(q => q.name)
}
