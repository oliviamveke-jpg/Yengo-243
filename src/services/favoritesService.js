/**
 * Favorites Service — manages favorites per user account.
 *
 * Database structure (localStorage mirroring Firestore):
 *   favoritesIndex: {
 *     [userId]: {
 *       [businessId]: { businessId, savedAt }
 *     }
 *   }
 *
 * Local cache (for offline/performance):
 *   localStorage.getItem('yengoFavoritesCache_{userId}')
 *
 * The service always writes to the index first, then updates cache.
 * On load, it reads from cache for speed, then syncs from index.
 */

import { storageAdapter, STORAGE_KEYS } from './storageAdapter'

const FAVORITES_INDEX_KEY = 'yengoFavoritesIndex'

function getCacheKey(userId) {
  return `yengoFavoritesCache_${userId}`
}

function getAllFavoritesIndex() {
  return storageAdapter.read(FAVORITES_INDEX_KEY, {}) || {}
}

function saveAllFavoritesIndex(index) {
  storageAdapter.write(FAVORITES_INDEX_KEY, index)
}

function getUserFavorites(userId) {
  if (!userId) return {}
  const index = getAllFavoritesIndex()
  return index[userId] || {}
}

function saveUserFavorites(userId, favorites) {
  if (!userId) return
  const index = getAllFavoritesIndex()
  index[userId] = favorites
  saveAllFavoritesIndex(index)
  // Update local cache
  storageAdapter.write(getCacheKey(userId), favorites)
}

export const favoritesService = {
  /**
   * Load favorites for a user.
   * First tries local cache (fast), then falls back to index.
   */
  loadFavorites(userId) {
    if (!userId) return {}

    // Try cache first
    const cache = storageAdapter.read(getCacheKey(userId), null)
    if (cache) return cache

    // Fall back to index
    return getUserFavorites(userId)
  },

  /**
   * Check if a business is favorited by a user.
   */
  isFavorite(userId, businessId) {
    if (!userId || !businessId) return false
    const favorites = getUserFavorites(userId)
    return !!favorites[businessId]
  },

  /**
   * Add a business to favorites. Returns the updated favorites map.
   */
  addFavorite(userId, businessId) {
    if (!userId || !businessId) return null

    const favorites = getUserFavorites(userId)

    // Prevent duplicates
    if (favorites[businessId]) {
      return favorites
    }

    const entry = {
      businessId,
      savedAt: new Date().toISOString()
    }

    const updated = {
      ...favorites,
      [businessId]: entry
    }

    saveUserFavorites(userId, updated)
    return updated
  },

  /**
   * Remove a business from favorites. Returns the updated favorites map.
   */
  removeFavorite(userId, businessId) {
    if (!userId || !businessId) return null

    const favorites = getUserFavorites(userId)

    if (!favorites[businessId]) {
      return favorites
    }

    const updated = { ...favorites }
    delete updated[businessId]

    saveUserFavorites(userId, updated)
    return updated
  },

  /**
   * Toggle favorite status. Returns { isFavorited, favorites }.
   */
  toggleFavorite(userId, businessId) {
    if (!userId || !businessId) return { isFavorited: false, favorites: null }

    const isCurrentlyFav = this.isFavorite(userId, businessId)

    if (isCurrentlyFav) {
      const favorites = this.removeFavorite(userId, businessId)
      return { isFavorited: false, favorites }
    } else {
      const favorites = this.addFavorite(userId, businessId)
      return { isFavorited: true, favorites }
    }
  },

  /**
   * Get all favorited business IDs for a user.
   */
  getFavoriteIds(userId) {
    if (!userId) return []
    const favorites = getUserFavorites(userId)
    return Object.keys(favorites)
  },

  /**
   * Get all favorite entries (with savedAt) for a user.
   */
  getFavoriteEntries(userId) {
    if (!userId) return []
    const favorites = getUserFavorites(userId)
    return Object.values(favorites).sort((a, b) =>
      new Date(b.savedAt) - new Date(a.savedAt)
    )
  },

  /**
   * Clear all favorites for a user (e.g., on account deletion).
   */
  clearUserFavorites(userId) {
    if (!userId) return
    const index = getAllFavoritesIndex()
    delete index[userId]
    saveAllFavoritesIndex(index)
    storageAdapter.remove(getCacheKey(userId))
  },

  /**
   * Sync local cache with the index (for cross-device sync simulation).
   * Returns the authoritative favorites.
   */
  syncFavorites(userId) {
    if (!userId) return {}
    const favorites = getUserFavorites(userId)
    storageAdapter.write(getCacheKey(userId), favorites)
    return favorites
  }
}
