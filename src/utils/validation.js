import { validateDRCPhone as drcValidate } from './phoneUtils'

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[0-12]{10,15}$/
  return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

/**
 * DRC-specific phone validation.
 * Delegates to phoneUtils.validateDRCPhone and returns boolean for backward compat.
 * Use validateDRCPhoneDetailed for error messages.
 */
export const validateDRCPhone = (input) => {
  const result = drcValidate(input)
  return result.valid
}

/**
 * DRC-specific phone validation with full error details.
 * @returns {{ valid: boolean, normalized: string|null, error: string|null }}
 */
export const validateDRCPhoneDetailed = (input) => {
  return drcValidate(input)
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
