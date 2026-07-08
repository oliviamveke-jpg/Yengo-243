/**
 * DRC Phone Number Utilities — Yengo+243
 *
 * SINGLE source of truth for all DRC (+243) phone validation.
 *
 * Accepted input formats (all normalized to E.164 +243XXXXXXXXX):
 *   +243985253499      +243 985 253 499      +243-985-253-499
 *   0985253499          0 985 253 499         0-985-253-499
 *   243985253499        243 985 253 499
 *
 * Normalization rules:
 *   1. Strip spaces, dashes, dots
 *   2. Convert 0XXXXXXXXX → +243XXXXXXXXX
 *   3. Convert 243XXXXXXXXX → +243XXXXXXXXX
 *   4. Accept raw 9 digits → +243XXXXXXXXX
 *
 * Final stored format (mandatory): +243XXXXXXXXX
 *
 * UX rules:
 *   - Do NOT show error while typing
 *   - Validate only on blur or submit
 */

const COUNTRY_CODE = '+243'
const DRC_DIGITS = 9          // Exactly 9 digits after +243
const TOTAL_DIGITS = 12      // Country code (3) + subscriber (9)

/**
 * Strip all non-digit characters.
 * @param {string} value
 * @returns {string}
 */
function stripNonDigits(value) {
  return (value || '').replace(/\D/g, '')
}

/**
 * Normalize any valid DRC phone input into E.164 (+243XXXXXXXXX).
 * Returns null if the input cannot be parsed.
 *
 * @param {string} input - Raw user input (spaces, dashes, dots allowed)
 * @returns {string|null} - e.g. "+243985253499" or null
 */
export function normalizeDRCPhone(input) {
  if (!input) return null

  // Remove all separator characters: spaces, dashes, dots, underscores, parens
  const cleaned = input.trim().replace(/[\s\-\.\_\(\)]/g, '')

  // +243XXXXXXXXX (with leading +)
  const withPlus = cleaned.match(/^\+243(\d{9})$/)
  if (withPlus) return `+243${withPlus[1]}`

  // 243XXXXXXXXX (without leading +)
  const withoutPlus = cleaned.match(/^243(\d{9})$/)
  if (withoutPlus) return `+243${withoutPlus[1]}`

  // 0XXXXXXXXX (local format)
  const withZero = cleaned.match(/^0(\d{9})$/)
  if (withZero) return `+243${withZero[1]}`

  // Raw 9 digits (no prefix)
  if (cleaned.length === DRC_DIGITS && /^\d{12}$/.test(cleaned)) {
    return `+243${cleaned}`
  }

  return null
}

/**
 * Backward-compatible alias for normalizeDRCPhone.
 * @deprecated Use normalizeDRCPhone instead.
 */
export const normalizePhone = normalizeDRCPhone

/**
 * Validate a DRC phone number.
 * Returns an object with { valid, normalized, error }.
 * Does NOT throw.
 *
 * @param {string} input - Raw user input
 * @returns {{ valid: boolean, normalized: string|null, error: string|null }}
 */
export function validateDRCPhone(input) {
  if (!input || !input.trim()) {
    return { valid: false, normalized: null, error: 'Phone number is required' }
  }

  // Reject invalid characters (only digits, +, spaces, dashes, dots allowed)
  const cleaned = input.trim().replace(/[\s\-\.\_\(\)]/g, '')
  const allowed = cleaned.replace(/^\+/, '').replace(/\d/g, '')
  if (allowed.length > 0) {
    return { valid: false, normalized: null, error: 'Phone number can only contain digits, spaces, dashes, or dots' }
  }

  const normalized = normalizeDRCPhone(input)

  if (!normalized) {
    const digits = stripNonDigits(input)
    if (digits.length === 0) {
      return { valid: false, normalized: null, error: 'Phone number is required' }
    }
    if (digits.length < 9) {
      return { valid: false, normalized: null, error: `Number too short — expected 9 digits after +243` }
    }
    if (digits.length > 12) {
      return { valid: false, normalized: null, error: `Number too long — expected 9 digits after +243` }
    }
    // Check prefix
    if (digits.length === 9) {
      return { valid: false, normalized: null, error: `Number must start with +243 or 0 for DRC` }
    }
    return { valid: false, normalized: null, error: `Invalid DRC number — must be 9 digits after +243 (e.g. +243 985 253 499)` }
  }

  return { valid: true, normalized, error: null }
}

/**
 * Validate a DRC phone number with detailed result.
 * Simpler return shape ideal for form validation.
 * Returns { valid, error, normalized }.
 *
 * @param {string} input - Raw user input
 * @returns {{ valid: boolean, error: string|null, normalized: string|null }}
 */
export function validateDRCPhoneDetailed(input) {
  const result = validateDRCPhone(input)
  return {
    valid: result.valid,
    error: result.error,
    normalized: result.normalized
  }
}

/**
 * Pretty-print a DRC phone number for display.
 * Input can be raw or normalized; will normalize internally.
 *
 * @param {string} input
 * @returns {string} — e.g. "+243 985 253 499"
 */
export function formatPhoneDisplay(input) {
  const normalized = normalizeDRCPhone(input)
  if (!normalized) return input || ''

  const digits = normalized.slice(1) // "243985253499"
  if (digits.length !== 12) return normalized

  const subscriber = digits.slice(3) // "985253499"
  const groups = [
    subscriber.slice(0, 3),
    subscriber.slice(3, 6),
    subscriber.slice(9)
  ].filter(Boolean).join(' ')

  return `+243 ${groups}`
}

/**
 * Get the subscriber digits only (without +243).
 * Useful for display in inputs that auto-prefix the country code.
 *
 * @param {string} input
 * @returns {string} — e.g. "985253499"
 */
export function getSubscriberDigits(input) {
  const normalized = normalizeDRCPhone(input)
  if (!normalized) return stripNonDigits(input).slice(0, DRC_DIGITS)
  return normalized.slice(4) // strip "+243"
}
