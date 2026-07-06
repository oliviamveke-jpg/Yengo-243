/**
 * Location Utilities
 * 
 * Builds a flat, normalized location index from the hierarchical Kinshasa location data.
 * Provides functions for populating dropdowns, resolving location IDs, and filtering.
 */

import { kinshasaLocationData } from '../data/locationData'

/**
 * Slugify a name for use in location IDs
 */
function slug(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Build a flat location index from the hierarchical kinshasaLocationData.
 * Returns a Record<locationId, LocationEntry>
 *
 * LocationEntry: { id, province, commune, quartier, street, coords, label }
 */
export function buildLocationIndex() {
  const index = {}
  const data = kinshasaLocationData
  const province = data.province || 'Kinshasa'
  const provinceSlug = slug(province)

  // Province-level entry
  const provinceId = provinceSlug
  index[provinceId] = {
    id: provinceId,
    province,
    commune: null,
    quartier: null,
    street: null,
    coords: data.coords || data.centroid || null,
    label: province
  }

  // Commune-level entries
  if (data.communes) {
    for (const [communeName, communeData] of Object.entries(data.communes)) {
      const communeSlug = slug(communeName)
      const communeId = `${provinceSlug}-${communeSlug}`

      index[communeId] = {
        id: communeId,
        province,
        commune: communeName,
        quartier: null,
        street: null,
        coords: communeData?.coords || communeData?.centroid || null,
        label: communeName
      }

      // Quartier-level entries
      if (communeData?.quartiers) {
        for (const [quartierName, quartierData] of Object.entries(communeData.quartiers)) {
          const quartierSlug = slug(quartierName)
          const quartierId = `${communeId}-${quartierSlug}`

          index[quartierId] = {
            id: quartierId,
            province,
            commune: communeName,
            quartier: quartierName,
            street: null,
            coords: quartierData?.coords || quartierData?.centroid || null,
            label: `${quartierName} (${communeName})`
          }
        }
      }
    }
  }

  return index
}

// Singleton — built once, cached
let _index = null

function getIndex() {
  if (!_index) _index = buildLocationIndex()
  return _index
}

/**
 * Get a location entry by its ID
 */
export function getLocationById(id) {
  if (!id) return null
  return getIndex()[id] || null
}

/**
 * Resolve a vendor's location to a display string.
 * Falls back to vendor's commune/quartier fields if no locationId.
 */
export function getVendorLocationDisplay(vendor) {
  if (vendor.locationId) {
    const entry = getLocationById(vendor.locationId)
    if (entry) {
      const parts = [entry.commune]
      if (entry.quartier) parts.push(entry.quartier)
      if (entry.street) parts.push(entry.street)
      return parts.join(', ')
    }
  }
  // Fallback
  const parts = [vendor.commune]
  if (vendor.quartier) parts.push(vendor.quartier)
  return parts.join(', ')
}

/**
 * Resolve a vendor's location to a full location string including province.
 */
export function getVendorLocationFull(vendor) {
  if (vendor.locationId) {
    const entry = getLocationById(vendor.locationId)
    if (entry) {
      const parts = [entry.province, entry.commune]
      if (entry.quartier) parts.push(entry.quartier)
      if (entry.street) parts.push(entry.street)
      return parts.join(' / ')
    }
  }
  return `${vendor.province || ''} / ${vendor.commune || ''}${vendor.quartier ? ' / ' + vendor.quartier : ''}`
}

/**
 * Get coordinates for a location ID. Falls back to ancestor coords.
 */
export function getLocationCoords(id) {
  if (!id) return null
  const entry = getLocationById(id)
  if (entry?.coords) return entry.coords

  // Try parent (commune level)
  if (id) {
    const parts = id.split('-')
    if (parts.length >= 3) {
      const parentId = parts.slice(0, 2).join('-')
      const parent = getLocationById(parentId)
      if (parent?.coords) return parent.coords
    }
    if (parts.length >= 2) {
      const parentId = parts[0]
      const parent = getLocationById(parentId)
      if (parent?.coords) return parent.coords
    }
  }

  // Ultimate fallback: Kinshasa center
  return kinshasaLocationData.coords || [-4.3219402, 15.3118474]
}

/**
 * Get options for a location dropdown.
 *
 * @param {'province'|'commune'|'quartier'} level - The hierarchy level
 * @param {string|null} parentId - ID of the parent location to scope children
 * @returns {Array<{value: string, label: string}>}
 */
export function getLocationOptions(level, parentId = null) {
  const index = getIndex()
  const entries = Object.values(index)

  switch (level) {
    case 'province':
      // Only the province-level entries
      return entries
        .filter(e => e.commune === null && e.quartier === null && e.street === null)
        .map(e => ({ value: e.id, label: e.label }))
        .sort((a, b) => a.label.localeCompare(b.label))

    case 'commune':
      if (!parentId) return []
      return entries
        .filter(e => e.commune !== null && e.quartier === null && e.street === null)
        .map(e => ({ value: e.id, label: e.label }))
        .sort((a, b) => a.label.localeCompare(b.label))

    case 'quartier':
      if (!parentId) return []
      const parent = getLocationById(parentId)
      if (!parent) return []
      return entries
        .filter(e => e.commune === parent.commune && e.quartier !== null && e.street === null)
        .map(e => ({ value: e.id, label: e.quartier }))
        .sort((a, b) => a.label.localeCompare(b.label))

    default:
      return []
  }
}

/**
 * Given a province name, return commune ids.
 * (Used for backward compat with string-based filter values.)
 */
export function getCommuneIdsForProvince(provinceName) {
  const index = getIndex()
  return Object.values(index)
    .filter(e => e.province === provinceName && e.commune !== null && e.quartier === null && e.street === null)
    .map(e => e.id)
}

/**
 * Given a commune name, return quartier ids.
 */
export function getQuartierIdsForCommune(communeName) {
  const index = getIndex()
  return Object.values(index)
    .filter(e => e.commune === communeName && e.quartier !== null && e.street === null)
    .map(e => e.id)
}

/**
 * Resolve a location ID back to a commune name (for string-matching in filters).
 */
export function getCommuneName(locationId) {
  const entry = getLocationById(locationId)
  return entry?.commune || locationId
}

/**
 * Check if a vendor matches a location filter.
 * Uses locationId if available, falls back to string comparison.
 */
export function vendorMatchesLocation(vendor, filters) {
  const { province, commune, quartier, street } = filters

  // If vendor has locationId, use it for precise matching
  if (vendor.locationId) {
    const loc = getLocationById(vendor.locationId)
    if (!loc) return false

    if (province && loc.province !== province) return false
    if (commune && loc.commune !== commune) return false
    if (quartier && loc.quartier !== quartier) return false
    if (street && loc.street !== street) return false

    return true
  }

  // Fallback: string comparison on vendor fields
  if (province && vendor.province !== province) return false
  if (commune && vendor.commune !== commune) return false
  if (quartier && vendor.quartier !== quartier) return false

  return true
}

/**
 * Given a locationId, extract the commune name from the location DB.
 */
export function getCommuneFromLocationId(locationId) {
  return getLocationById(locationId)?.commune || null
}

/**
 * Given a locationId, extract the quartier name from the location DB.
 */
export function getQuartierFromLocationId(locationId) {
  return getLocationById(locationId)?.quartier || null
}

/**
 * Given a locationId, extract the province name from the location DB.
 */
export function getProvinceFromLocationId(locationId) {
  return getLocationById(locationId)?.province || null
}

/**
 * Auto-assign locationId to a vendor based on its commune/quartier fields.
 * Returns the vendor with locationId added (mutates and returns).
 */
export function assignLocationId(vendor) {
  if (vendor.locationId) return vendor

  const index = getIndex()
  const communeName = vendor.commune
  const quartierName = vendor.quartier

  if (!communeName) return vendor

  // Try exact match (commune + quartier)
  for (const entry of Object.values(index)) {
    if (entry.commune === communeName && entry.quartier === quartierName) {
      vendor.locationId = entry.id
      return vendor
    }
  }

  // Try commune-only match
  for (const entry of Object.values(index)) {
    if (entry.commune === communeName && entry.quartier === null && entry.street === null) {
      vendor.locationId = entry.id
      return vendor
    }
  }

  return vendor
}

/**
 * Migrate all vendors in an array: assign locationId to any that lack it.
 */
export function migrateVendors(vendors) {
  return vendors.map(v => assignLocationId({ ...v }))
}

/**
 * Get province-level options (backward compat: returns string names).
 */
export function getProvinceOptions() {
  return Object.values(getIndex())
    .filter(e => e.commune === null && e.quartier === null && e.street === null)
    .map(e => e.province)
    .sort()
}

/**
 * Get commune names for a province (backward compat).
 */
export function getCommuneOptions(provinceName) {
  if (!provinceName) return []
  return Object.values(getIndex())
    .filter(e => e.province === provinceName && e.commune !== null && e.quartier === null && e.street === null)
    .map(e => e.commune)
    .sort()
}

/**
 * Get quartier names for a commune (backward compat).
 */
export function getQuartierOptions(communeName) {
  if (!communeName) return []
  return Object.values(getIndex())
    .filter(e => e.commune === communeName && e.quartier !== null && e.street === null)
    .map(e => e.quartier)
    .sort()
}
