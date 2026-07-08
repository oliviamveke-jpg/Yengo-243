import { storageAdapter, STORAGE_KEYS } from './storageAdapter'

export const reviewService = {
  getReviews(defaultReviews = []) {
    const reviews = storageAdapter.read(STORAGE_KEYS.reviews, defaultReviews)
    return Array.isArray(reviews) ? reviews : defaultReviews
  },

  setReviews(reviews) {
    return storageAdapter.write(STORAGE_KEYS.reviews, Array.isArray(reviews) ? reviews : [])
  },

  addReview(review) {
    const normalizedReview = {
      ...review,
      id: review.id || Date.now(),
      createdAt: review.createdAt || new Date().toISOString()
    }

    const reviews = [...this.getReviews(), normalizedReview]
    this.setReviews(reviews)
    return normalizedReview
  },

  updateReview(reviewId, updates) {
    const reviews = this.getReviews()
    const index = reviews.findIndex((review) => review.id === reviewId)

    if (index === -1) {
      return null
    }

    const updatedReview = {
      ...reviews[index],
      ...updates
    }
    reviews[index] = updatedReview
    this.setReviews(reviews)
    return updatedReview
  },

  deleteReview(reviewId) {
    const reviews = this.getReviews().filter(r => r.id !== reviewId)
    this.setReviews(reviews)
    return true
  },

  getReviewsForVendor(vendorId) {
    return this.getReviews().filter((review) => review.vendorId === vendorId)
  },

  /**
   * Delete all reviews for a specific vendor. Used during account deletion.
   */
  deleteReviewsForVendor(vendorId) {
    if (!vendorId) return false
    const reviews = this.getReviews().filter(r => r.vendorId !== vendorId)
    this.setReviews(reviews)
    return true
  },

  /**
   * Delete all reviews authored by a specific user (by name or userId).
   * Used during account deletion.
   */
  deleteReviewsByUser(userId) {
    if (!userId) return false
    // Reviews don't have a userId field directly, but we can remove reviews
    // that reference this user by checking the review's customerId or userId
    const reviews = this.getReviews().filter(r => r.userId !== userId && r.customerId !== userId)
    this.setReviews(reviews)
    return true
  }
}
