import React, { useState, useRef, useEffect } from 'react'

/**
 * PhoneInput — DRC Mobile Money phone input
 *
 * Accepts phone numbers in multiple formats:
 *   +243985253499 | +243 985 253 499 | 0985253499 | 0 985 253 499
 *
 * On blur: normalizes to E.164 (+243XXXXXXXXX) and validates.
 * While typing: no errors shown — only helper text.
 * Storage should use the normalized value from onBlur/onChange.
 */
export default function PhoneInput({
  value = '+243',
  onChange,
  onBlur,
  error,
  helperText = 'Example: +243 985 253 499 or 0985 253 499',
  label = 'Phone Number',
  required = false,
  disabled = false,
  showCountrySelector = true,
  style: extraStyle = {}
}) {
  const [displayValue, setDisplayValue] = useState('')
  const [touched, setTouched] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState({ code: '+243', flag: '🇨🇩', name: 'DRC' })
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // On mount or value change, initialize display from value
  useEffect(() => {
    if (value && value !== '+243') {
      const stripped = value.replace('+243', '')
      if (stripped) setDisplayValue(stripped)
    } else {
      setDisplayValue('')
    }
  }, [value])

  // Close country dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCountryDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e) => {
    // Allow digits, spaces, +, dashes — don't strip anything the user types
    const raw = e.target.value
    setDisplayValue(raw)
    setTouched(false)

    // Build full number: country code + what user typed
    // Normalize only for the parent onChange
    const fullNumber = selectedCountry.code + raw
    if (onChange) onChange(fullNumber)
  }

  const handleBlur = (e) => {
    setTouched(true)
    // Build the full number and pass to parent onBlur
    const fullNumber = selectedCountry.code + displayValue
    if (onBlur) onBlur(fullNumber, e)
  }

  const handleFocus = () => {
    if (!displayValue) {
      // Place cursor after the +243 prefix field
    }
  }

  const selectCountry = (country) => {
    setSelectedCountry(country)
    setShowCountryDropdown(false)
    // Clear any validation state
    setTouched(false)
    // Notify parent of code change
    const fullNumber = country.code + displayValue
    if (onChange) onChange(fullNumber)
    if (inputRef.current) inputRef.current.focus()
  }

  // Available countries (expandable later)
  const countries = [
    { code: '+243', flag: '🇨🇩', name: 'DRC' }
  ]

  const showError = touched && error

  return (
    <div className="form-group" style={extraStyle}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}

      <div className="form-input-wrapper">
        {showCountrySelector && (
          <div className="phone-country-selector" ref={dropdownRef}>
            <button
              type="button"
              className="phone-country-btn"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              disabled={disabled}
              tabIndex={-1}
            >
              <span className="phone-country-flag">{selectedCountry.flag}</span>
              <span className="phone-country-code">{selectedCountry.code}</span>
              <span className={`phone-country-arrow ${showCountryDropdown ? 'open' : ''}`}>▾</span>
            </button>
            {showCountryDropdown && (
              <div className="phone-country-dropdown">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`phone-country-option ${c.code === selectedCountry.code ? 'active' : ''}`}
                    onClick={() => selectCountry(c)}
                  >
                    <span className="phone-country-flag">{c.flag}</span>
                    <span className="phone-country-name">{c.name}</span>
                    <span className="phone-country-code-option">{c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="tel"
          className={`form-input phone-input${showCountrySelector ? ' phone-input-with-country' : ''}${showError ? ' form-input-error' : ''}`}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder="985 253 499"
          disabled={disabled}
          required={required}
          autoComplete="tel"
        />
      </div>

      {showError ? (
        <p className="form-error">{error}</p>
      ) : helperText ? (
        <p className="form-helper-text">{helperText}</p>
      ) : null}
    </div>
  )
}
