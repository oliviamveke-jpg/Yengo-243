import React, { useState } from 'react'
import Input from './ui/Input'
import Button from './ui/Button'
import { userService } from '../services/userService'
import { useTranslation } from '../i18n/I18nProvider'

/**
 * AuthModal — Login / Register form component
 *
 * Props:
 *   mode       'login' | 'register'
 *   onClose    () => void
 *   onLogin    (user) => void   — called after successful login
 *   onRegister (user) => void   — called after successful registration
 *   onSwitchMode () => void     — called when user clicks "switch to register/login"
 */
export default function AuthModal({ mode, onClose, onLogin, onRegister, onSwitchMode }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  function validate() {
    if (!form.email.trim()) return t('auth.emailRequired')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return t('auth.emailInvalid')
    if (!form.password) return t('auth.passwordRequired')
    if (form.password.length < 4) return t('auth.passwordTooShort')

    if (!isLogin) {
      if (!form.fullName.trim()) return t('auth.nameRequired')
      if (!form.confirmPassword) return t('auth.confirmRequired')
      if (form.password !== form.confirmPassword) return t('auth.passwordsDontMatch')
    }

    return ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const account = userService.findAccountByEmail(form.email.trim())
        if (!account) {
          setError(t('auth.noAccountFound'))
          setLoading(false)
          return
        }
        if (account.password !== form.password) {
          setError(t('auth.wrongPassword'))
          setLoading(false)
          return
        }
        const { password: _, ...safeUser } = account
        userService.setCurrentUser(safeUser)
        onLogin(safeUser)
      } else {
        const existing = userService.findAccountByEmail(form.email.trim())
        if (existing) {
          setError(t('auth.emailAlreadyUsed'))
          setLoading(false)
          return
        }

        const newUser = {
          id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role: 'buyer',
          fullName: form.fullName.trim(),
          label: form.fullName.trim().split(' ')[0],
          email: form.email.trim(),
          password: form.password,
          createdAt: new Date().toISOString()
        }

        userService.addAccount(newUser)
        const users = userService.getUsers()
        users.push(newUser)
        userService.setUsers(users)

        const { password: _, ...safeUser } = newUser
        userService.setCurrentUser(safeUser)
        onRegister(safeUser)
      }
    } catch (err) {
      setError(t('auth.errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 12,
          color: '#dc2626',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!isLogin && (
        <Input
          label={t('auth.fullName')}
          type="text"
          value={form.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder={t('auth.namePlaceholder')}
          required
        />
      )}

      <Input
        label={t('auth.email')}
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder={t('auth.emailPlaceholder')}
        required
      />

      <Input
        label={t('auth.password')}
        type="password"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        placeholder={t('auth.passwordPlaceholder')}
        required
      />

      {!isLogin && (
        <Input
          label={t('auth.confirmPassword')}
          type="password"
          value={form.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          placeholder={t('auth.passwordPlaceholder')}
          required
        />
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={loading}
        size="lg"
      >
        {loading ? (
          <>
            <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            {isLogin ? t('auth.loadingLogin') : t('auth.loadingRegister')}
          </>
        ) : (
          isLogin ? t('auth.loginButton') : t('auth.registerButton')
        )}
      </Button>

      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        {isLogin ? (
          <>
            {t('auth.noAccount')}{' '}
            <button
              type="button"
              onClick={onSwitchMode}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
            >
              {t('auth.switchToRegister')}
            </button>
          </>
        ) : (
          <>
            {t('auth.hasAccount')}{' '}
            <button
              type="button"
              onClick={onSwitchMode}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
            >
              {t('auth.switchToLogin')}
            </button>
          </>
        )}
      </div>
    </form>
  )
}
