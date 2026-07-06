// Yengo+243 Subcategory Service
// Manages a shared registry of subcategories with stable IDs, colors, and deduplication.
// All data persists in localStorage.

import { storageAdapter } from './storageAdapter'
import { pickColor } from '../data/subcategoryColors'

const STORAGE_KEY = 'yengoSubcategories'

// Cached in-memory copy — avoids repeated localStorage reads
let cache = null

function normalizeName(name) {
  return String(name || '')
    .trim()
    .replace(/\s+/g, ' ')   // collapse internal whitespace
    .trim()
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase())
}

/** Load all subcategories from localStorage (with cache) */
function load() {
  if (cache) return cache
  const data = storageAdapter.read(STORAGE_KEY, [])
  cache = Array.isArray(data) ? data : []
  return cache
}

/** Persist and refresh cache */
function save(list) {
  cache = list
  storageAdapter.write(STORAGE_KEY, list)
}

/** Generate a new stable ID */
function makeId(category, name) {
  const slug = `${category}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `sub-${slug}`
}

// ─── Public API ───

export const subcategoryService = {
  /** Get all subcategories */
  getAll() {
    return load()
  },

  /** Get subcategories matching a given top-level category */
  getByCategory(category) {
    if (!category) return []
    const cat = category.toLowerCase().trim()
    return load().filter(s => s.category.toLowerCase().trim() === cat)
  },

  /** Get a single subcategory by ID */
  getById(id) {
    return load().find(s => s.id === id) || null
  },

  /**
   * Search subcategories by name (case-insensitive, partial match).
   * Supports debounced autocomplete — caller should debounce calls.
   */
  search(query, category) {
    const q = normalizeName(query || '').toLowerCase()
    if (!q) return []
    let list = load()
    if (category) {
      const cat = category.toLowerCase().trim()
      list = list.filter(s => s.category.toLowerCase().trim() === cat)
    }
    return list.filter(s => s.name.toLowerCase().includes(q))
  },

  /**
   * Find an existing subcategory by normalized name + category.
   * Returns the record or null.
   */
  find(name, category) {
    const normalized = normalizeName(name || '').toLowerCase()
    if (!normalized || !category) return null
    const cat = category.toLowerCase().trim()
    return load().find(s => {
      return s.name.toLowerCase() === normalized && s.category.toLowerCase().trim() === cat
    }) || null
  },

  /**
   * Create a new subcategory.
   * - name is normalized (trimmed, collapsed spaces, title-cased)
   * - duplicate prevention is the caller's responsibility (use findOrCreate)
   */
  create(name, category) {
    const raw = normalizeName(name || '')
    if (!raw || !category) throw new Error('name and category are required')

    const displayName = capitalizeWords(raw)
    const list = load()

    const id = makeId(category, displayName)

    // Collect all currently assigned colors
    const existingColors = list.map(s => s.markerColor).filter(Boolean)
    const markerColor = pickColor(existingColors)

    const entry = {
      id,
      name: displayName,
      category,
      markerColor,
      icon: null,
      createdAt: new Date().toISOString()
    }

    list.push(entry)
    save(list)
    return entry
  },

  /**
   * Find or create a subcategory.
   * Returns { subcategory: entry, created: boolean }
   */
  findOrCreate(name, category) {
    const existing = this.find(name, category)
    if (existing) return { subcategory: existing, created: false }
    const created = this.create(name, category)
    return { subcategory: created, created: true }
  },

  /** Get the marker color for a subcategory by ID */
  getColor(subcategoryId) {
    if (!subcategoryId) return null
    const entry = this.getById(subcategoryId)
    return entry ? entry.markerColor : null
  },

  // ─── Admin operations ───

  /** Rename a subcategory */
  rename(id, newName) {
    const raw = normalizeName(newName || '')
    if (!raw) throw new Error('New name is required')
    const displayName = capitalizeWords(raw)
    const list = load()
    const idx = list.findIndex(s => s.id === id)
    if (idx === -1) throw new Error(`Subcategory ${id} not found`)
    list[idx].name = displayName
    save(list)
    return list[idx]
  },

  /** Merge source into target — reassign all references (caller must update vendor records too) */
  merge(fromId, intoId) {
    if (fromId === intoId) throw new Error('Cannot merge a subcategory into itself')
    const list = load()
    const fromIdx = list.findIndex(s => s.id === fromId)
    const intoIdx = list.findIndex(s => s.id === intoId)
    if (fromIdx === -1) throw new Error(`Source subcategory ${fromId} not found`)
    if (intoIdx === -1) throw new Error(`Target subcategory ${intoId} not found`)
    // Delete the source
    list.splice(fromIdx, 1)
    save(list)
    return { deletedSource: fromId, target: list.find(s => s.id === intoId) }
  },

  /** Delete a subcategory if it's unused (caller must verify zero references first) */
  delete(id) {
    const list = load()
    const idx = list.findIndex(s => s.id === id)
    if (idx === -1) throw new Error(`Subcategory ${id} not found`)
    list.splice(idx, 1)
    save(list)
    return true
  },

  /** Change marker color for a subcategory */
  setColor(id, newColor) {
    const list = load()
    const entry = list.find(s => s.id === id)
    if (!entry) throw new Error(`Subcategory ${id} not found`)
    entry.markerColor = newColor
    save(list)
    return entry
  },

  /**
   * Count how many vendors/products reference each subcategory.
   * Returns a map: { subcategoryId: count }
   */
  usageCounts(vendors) {
    const counts = {}
    for (const vendor of (vendors || [])) {
      for (const product of (vendor.products || [])) {
        const sc = product.subcategoryId || product.subcategory
        if (sc) counts[sc] = (counts[sc] || 0) + 1
      }
    }
    return counts
  },

  // ─── Migration ───

  /**
   * One-time migration: scan all vendors, extract unique (category, subcategory) pairs,
   * ensure each has a subcategory record, and backfill subcategoryId onto products.
   * Returns the number of subcategories created.
   */
  migrateVendors(vendors) {
    let createdCount = 0
    for (const vendor of (vendors || [])) {
      const cat = vendor.category
      if (!cat) continue
      for (const product of (vendor.products || [])) {
        const subName = product.subcategory
        if (!subName) continue
        const result = this.findOrCreate(subName, cat)
        if (result.created) createdCount++
        // Backfill subcategoryId if missing
        if (!product.subcategoryId) {
          product.subcategoryId = result.subcategory.id
        }
      }
    }
    return createdCount
  },

  /**
   * Get all unique (category → subcategories[]) for dropdowns/filters.
   */
  getGrouped() {
    const list = load()
    const grouped = {}
    for (const s of list) {
      if (!grouped[s.category]) grouped[s.category] = []
      grouped[s.category].push(s)
    }
    return grouped
  }
}
