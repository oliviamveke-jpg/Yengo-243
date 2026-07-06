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
  }
}
