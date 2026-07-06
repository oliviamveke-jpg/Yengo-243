import React from 'react'

<<<<<<< HEAD
export default function Button({ children, onClick, variant = 'primary', disabled = false, type = 'button', fullWidth = false, size = 'medium' }) {
  const variants = {
    primary: {
      backgroundColor: '#3b82f6',
      color: '#fff',
      border: 'none',
      hover: '#2563eb'
    },
    secondary: {
      backgroundColor: '#334155',
      color: '#e2e8f0',
      border: '1px solid #475569',
      hover: '#475569'
    },
    danger: {
      backgroundColor: '#ef4444',
      color: '#fff',
      border: 'none',
      hover: '#dc2626'
    },
    success: {
      backgroundColor: '#10b981',
      color: '#fff',
      border: 'none',
      hover: '#059669'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#e2e8f0',
      border: '1px solid #334155',
      hover: '#334155'
    }
  }

  const sizes = {
    small: { padding: '8px 16px', fontSize: '0.85rem' },
    medium: { padding: '12px 24px', fontSize: '0.95rem' },
    large: { padding: '16px 32px', fontSize: '1rem' }
  }

  const variantStyle = variants[variant] || variants.primary
  const sizeStyle = sizes[size] || sizes.medium
=======
/**
 * Button — Design system button component
 * Variants: primary (blue/rounded), secondary (white/thin border), danger (red), ghost
 * Sizes: sm, md (default), lg
 */
export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  fullWidth = false,
  size = 'md',
  style: extraStyle = {},
  className = ''
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    fullWidth ? 'btn-full' : '',
    className
  ]
    .filter(Boolean)
    .join(' ')
>>>>>>> e66c1ea (Update app)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
<<<<<<< HEAD
      style={{
        ...sizeStyle,
        width: fullWidth ? '100%' : 'auto',
        backgroundColor: disabled ? '#475569' : variantStyle.backgroundColor,
        color: variantStyle.color,
        border: variantStyle.border,
        borderRadius: '8px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: disabled ? 0.6 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = variantStyle.hover
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = variantStyle.backgroundColor
        }
      }}
=======
      className={classes}
      style={extraStyle}
>>>>>>> e66c1ea (Update app)
    >
      {children}
    </button>
  )
}
