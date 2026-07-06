import React from 'react'

<<<<<<< HEAD
export default function Select({ label, value, onChange, options, required = false, error, disabled = false, name }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label 
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#e2e8f0'
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
=======
/**
 * Select — Design system select component
 * Matches Input styling for consistency
 */
export default function Select({ label, value, onChange, options, required = false, error, disabled = false, name, style: extraStyle = {} }) {
  return (
    <div className="form-group" style={extraStyle}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
>>>>>>> e66c1ea (Update app)
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
<<<<<<< HEAD
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#0f172a',
          border: error ? '1px solid #ef4444' : '1px solid #334155',
          borderRadius: '8px',
          color: '#e2e8f0',
          fontSize: '0.95rem',
          transition: 'border-color 0.2s',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        onFocus={(e) => {
          if (!disabled) e.target.style.borderColor = '#3b82f6'
        }}
        onBlur={(e) => {
          if (!disabled) e.target.style.borderColor = error ? '#ef4444' : '#334155'
        }}
=======
        className={`form-select${error ? ' form-input-error' : ''}`}
>>>>>>> e66c1ea (Update app)
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
<<<<<<< HEAD
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', margin: '4px 0 0 0' }}>
          {error}
        </p>
      )}
=======
      {error && <p className="form-error">{error}</p>}
>>>>>>> e66c1ea (Update app)
    </div>
  )
}
