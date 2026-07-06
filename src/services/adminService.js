import { storageAdapter, STORAGE_KEYS } from './storageAdapter'
import { listingService } from './listingService'
import { userService } from './userService'
import { reviewService } from './reviewService'
import { subscriptionService } from './subscriptionService'

export const adminService = {
  // Vendors
  getPendingVendors() {
    const vendors = listingService.getVendors([])
    return vendors.filter(v => v.status === 'pending' || v.approved !== true)
  },

  approveVendor(vendorId) {
    const vendor = listingService.updateVendor(vendorId, { approved: true, status: 'active' })
    return vendor
  },

  suspendVendor(vendorId, reason = 'suspended') {
    const vendor = listingService.updateVendor(vendorId, { suspended: true, suspendedReason: reason, status: 'suspended' })
    return vendor
  },

  featureVendor(vendorId, featured = true) {
    const vendor = listingService.updateVendor(vendorId, { featured })
    return vendor
  },

  // Users
  getUsers() {
    return userService.getUsers([])
  },

  updateUser(userId, updates) {
    return userService.updateUser(userId, updates)
  },

  // Subscriptions & payments
  getSubscriptions() {
    return subscriptionService.getSubscriptions()
  },

  verifyPayment(paymentId) {
    return subscriptionService.verifyPayment(paymentId)
  },

  // Reviews moderation
  getAllReviews() {
    return reviewService.getReviews([])
  },

  removeReview(reviewId) {
    return reviewService.deleteReview(reviewId)
  },

  // Platform analytics (basic)
  getPlatformAnalytics() {
    const vendors = listingService.getVendors([])
    const reviews = reviewService.getReviews([])
    const users = userService.getUsers([])
    const totalVendors = vendors.length
    const totalUsers = users.length
    const totalReviews = reviews.length
    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) : 0
    return { totalVendors, totalUsers, totalReviews, avgRating }
  },

  // Announcements (simple broadcast to notifications for all vendors)
  sendAnnouncement({ title, message }) {
    const vendors = listingService.getVendors([])
    vendors.forEach(v => {
      // create a notification for each vendor
      const note = { type: 'announcement', title, message, time: new Date().toISOString(), unread: true }
      // reuse notificationService via listingService->storage keys
      const bucket = storageAdapter.read(STORAGE_KEYS.vendorNotifications, {}) || {}
      const vendorNotes = Array.isArray(bucket[v.id]) ? bucket[v.id] : []
      vendorNotes.unshift({ id: Date.now() + Math.random(), ...note })
      bucket[v.id] = vendorNotes
      storageAdapter.write(STORAGE_KEYS.vendorNotifications, bucket)
    })
    return true
  }
}

export default adminService
