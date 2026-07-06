import React from 'react'

<<<<<<< HEAD
export default function Input({ label, type = 'text', value, onChange, placeholder, required = false, error, disabled = false, name }) {
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
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#0f172a',
          border: error ? '1px solid #ef4444' : '1px solid #334155',
          borderRadius: '8px',
          color: '#e2e8f0',
          fontSize: '0.95rem',
          transition: 'border-color 0.2s',
          outline: 'none'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : '#334155'
        }}
      />
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', margin: '4px 0 0 0' }}>
          {error}
        </p>
      )}
=======
/**
 * Input — Design system input component
 * Rounded, consistent spacing, same labels, same validation messages
 */
export default function Input({ label, type = 'text', value, onChange, placeholder, required = false, error, disabled = false, name, leftIcon, style: extraStyle = {} }) {
  return (
    <div className="form-group" style={extraStyle}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {leftIcon && <span className="form-input-icon">{leftIcon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`form-input${leftIcon ? ' form-input-with-icon' : ''}${error ? ' form-input-error' : ''}`}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
>>>>>>> e66c1ea (Update app)
    </div>
  )
}
