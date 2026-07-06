import { storageAdapter, STORAGE_KEYS } from './storageAdapter'

export const notificationService = {
  getNotifications(vendorId) {
    const bucket = storageAdapter.read(STORAGE_KEYS.vendorNotifications, {}) || {}
    return Array.isArray(bucket[vendorId]) ? bucket[vendorId] : []
  },

  setNotifications(vendorId, notifications) {
    const bucket = storageAdapter.read(STORAGE_KEYS.vendorNotifications, {}) || {}
    bucket[vendorId] = Array.isArray(notifications) ? notifications : []
    storageAdapter.write(STORAGE_KEYS.vendorNotifications, bucket)
    return bucket[vendorId]
  },

  addNotification(vendorId, notification) {
    const notifications = [
      {
        ...notification,
        id: notification.id || Date.now(),
        createdAt: notification.createdAt || new Date().toISOString()
      },
      ...this.getNotifications(vendorId)
    ]
    this.setNotifications(vendorId, notifications)
    return notifications[0]
  },

  markNotificationRead(vendorId, notificationId) {
    const notifications = this.getNotifications(vendorId)
    const index = notifications.findIndex((notification) => notification.id === notificationId)

    if (index === -1) {
      return null
    }

    notifications[index] = {
      ...notifications[index],
      unread: false
    }
    this.setNotifications(vendorId, notifications)
    return notifications[index]
  },

  deleteNotification(vendorId, notificationId) {
    const notifications = this.getNotifications(vendorId).filter((notification) => notification.id !== notificationId)
    this.setNotifications(vendorId, notifications)
    return notifications
  },

  clearAllNotifications(vendorId) {
    this.setNotifications(vendorId, [])
    return []
  }
}
