import React from 'react'

export default function Toggle({ label, checked, onChange, disabled = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      {label && (
        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#e2e8f0' }}>
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        style={{
          width: '50px',
          height: '26px',
          borderRadius: '13px',
          backgroundColor: checked ? '#3b82f6' : '#334155',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          transition: 'background-color 0.2s',
          padding: 0
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '27px' : '3px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            transition: 'left 0.2s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        />
      </button>
    </div>
  )
}
