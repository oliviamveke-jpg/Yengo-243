export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/
  return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

export const validateRequired = (value) => {
  return value && value.trim() !== ''
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateMatch = (value1, value2) => {
  return value1 === value2
}

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  return allowedTypes.includes(file.type) && file.size <= maxSize
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
