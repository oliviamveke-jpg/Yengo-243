import { storageAdapter, STORAGE_KEYS } from './storageAdapter'

const LEGACY_CURRENT_USER_KEY = 'currentUser'
const LEGACY_ACCOUNTS_KEY = 'yengoAccounts'

const migrateUser = (user) => {
  if (!user) return null
  if (user.type && !user.role) {
    return {
      ...user,
      role: user.type === 'vendor' ? 'vendor' : 'buyer',
      type: undefined
    }
  }
  return user
}

export const userService = {
  getUsers(defaultUsers = []) {
    const savedUsers = storageAdapter.read(STORAGE_KEYS.users, defaultUsers)
    return Array.isArray(savedUsers) ? savedUsers.map(migrateUser) : defaultUsers.map(migrateUser)
  },

  setUsers(users) {
    return storageAdapter.write(STORAGE_KEYS.users, Array.isArray(users) ? users : [])
  },

  getCurrentUser() {
    const savedUser = storageAdapter.read(STORAGE_KEYS.currentUser, null)
    return savedUser ? migrateUser(savedUser) : null
  },

  setCurrentUser(user) {
    const normalizedUser = user ? migrateUser(user) : null
    const saved = storageAdapter.write(STORAGE_KEYS.currentUser, normalizedUser)
    if (normalizedUser) {
      storageAdapter.write(LEGACY_CURRENT_USER_KEY, normalizedUser)
    } else {
      storageAdapter.remove(LEGACY_CURRENT_USER_KEY)
    }
    return saved
  },

  clearCurrentUser() {
    storageAdapter.remove(STORAGE_KEYS.currentUser)
    storageAdapter.remove(LEGACY_CURRENT_USER_KEY)
  },

  getAccounts() {
    const storedAccounts = storageAdapter.read(LEGACY_ACCOUNTS_KEY, [])
    return Array.isArray(storedAccounts) ? storedAccounts.map(migrateUser) : []
  },

  setAccounts(accounts) {
    return storageAdapter.write(LEGACY_ACCOUNTS_KEY, Array.isArray(accounts) ? accounts : [])
  },

  addAccount(account) {
    const accounts = this.getAccounts()
    accounts.push(migrateUser(account))
    this.setAccounts(accounts)
    return migrateUser(account)
  },

  findAccountByEmail(email) {
    const accounts = this.getAccounts()
    return accounts.find((account) => account.email && account.email.toLowerCase() === String(email).toLowerCase()) || null
  },

  updateUser(userId, updates) {
    const users = this.getUsers()
    const index = users.findIndex((user) => user.id === userId)

    if (index === -1) {
      return null
    }

    const updatedUser = {
      ...users[index],
      ...updates
    }
    users[index] = updatedUser
    this.setUsers(users)

    const currentUser = this.getCurrentUser()
    if (currentUser?.id === userId) {
      this.setCurrentUser(updatedUser)
    }

    return updatedUser
  }
}
