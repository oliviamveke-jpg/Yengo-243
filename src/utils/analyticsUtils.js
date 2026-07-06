/**
 * Analytics Utilities
 *
 * Centralised owner-activity detection so the entire platform
 * (web, mobile, API, background jobs) can exclude owners from
 * their own analytics consistently.
 *
 * Usage:
 *   import { shouldTrackAnalytics } from '../utils/analyticsUtils'
 *   if (!shouldTrackAnalytics(currentUser, vendor)) return
 */

/**
 * Returns `true` when the event SHOULD be recorded.
 * Returns `false` when the current user is the business owner —
 * their own activity must never inflate customer engagement metrics.
 */
export function shouldTrackAnalytics(currentUser, vendor) {
  if (!currentUser || !vendor) return true
  if (currentUser.role !== 'vendor') return true
  return !(vendor.ownerId === currentUser.id || vendor.id === currentUser.id)
}

/**
 * Convenience predicate — is the current user viewing their own business?
 */
export function isOwnerViewingBusiness(currentUser, vendor) {
  return !shouldTrackAnalytics(currentUser, vendor)
}
