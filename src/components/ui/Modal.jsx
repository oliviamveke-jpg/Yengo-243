import React, { useEffect } from 'react'

<<<<<<< HEAD
=======
/**
 * Modal — Design system modal component
 * Uses CSS classes from styles.css for consistent styling
 */
>>>>>>> e66c1ea (Update app)
export default function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

<<<<<<< HEAD
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    xlarge: 'max-w-6xl'
  }

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div 
        className={`modal-content ${sizeClasses[size]}`}
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {title && (
          <div 
            className="modal-header"
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#e2e8f0'
              }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#334155'
                e.target.style.color = '#e2e8f0'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#94a3b8'
              }}
            >
              ×
            </button>
          </div>
        )}
        <div className="modal-body" style={{ padding: '24px' }}>
=======
  const sizeClass = size === 'large' ? ' modal-lg' : size === 'xlarge' ? ' modal-lg' : ''

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal${sizeClass}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="btn btn-sm btn-ghost" onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        <div className="modal-body">
>>>>>>> e66c1ea (Update app)
          {children}
        </div>
      </div>
    </div>
  )
}
