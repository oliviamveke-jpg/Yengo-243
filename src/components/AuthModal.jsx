import React, { useState, useEffect } from 'react'
import Input from './ui/Input'
import Select from './ui/Select'
import Button from './ui/Button'
import { userService } from '../services/userService'
import { listingService } from '../services/listingService'
import { useTranslation } from '../i18n/I18nProvider'
import {
  getProvinces,
  getCommunes,
  getQuartiers,
  addQuartier,
  findOrCreateRue,
  getProvinceById,
  getCommuneById,
  getQuartierById
} from '../services/locationService'
import { normalizePhone, validateDRCPhoneDetailed } from '../utils/phoneUtils'
import { geocodingService } from '../services/geocodingService'
import { getAllCategoryConfigs } from '../data/categoryConfig'
import LocationSection from './location/LocationSection'

/**
 * AuthModal — Login / Register form component with Multi-Role support
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
  const [accountType, setAccountType] = useState('buyer') // 'buyer' | 'vendeur'

  // ─── Form state ───
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Vendeur-only fields
    businessName: '',
    provinceId: '',
    communeId: '',
    quartierId: '',
    rueName: '',
    whatsappNumber: '',
    businessCategory: '',
    latitude: '',
    longitude: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // ─── GPS Location state ───
  const [locating, setLocating] = useState(false)

  // ─── Location cascade ───
  const provinces = getProvinces().map(p => ({ value: p.id, label: p.name }))
  const communes = form.provinceId ? getCommunes(form.provinceId).map(c => ({ value: c.id, label: c.name })) : []
  const quartiers = form.communeId ? getQuartiers(form.communeId).map(q => ({ value: q.id, label: q.name })) : []

  // ─── Categories ───
  const categories = getAllCategoryConfigs(true).map(c => ({ value: c.label, label: c.label }))

  // ─── Add Quartier state ───
  const [showAddQuartier, setShowAddQuartier] = useState(false)
  const [newQuartierName, setNewQuartierName] = useState('')
  const [addQuartierLoading, setAddQuartierLoading] = useState(false)

  // ─── Loading states for cascading selects ───
  const [loadingCommunes, setLoadingCommunes] = useState(false)
  const [loadingQuartiers, setLoadingQuartiers] = useState(false)

  const isLogin = mode === 'login'
  const isVendeur = accountType === 'vendeur'

  // ─── Reset cascading fields when parent changes ───
  useEffect(() => {
    if (form.provinceId) {
      setLoadingCommunes(true)
      // Simulate brief loading for UX
      const timer = setTimeout(() => setLoadingCommunes(false), 150)
      return () => clearTimeout(timer)
    }
  }, [form.provinceId])

  useEffect(() => {
    if (form.communeId) {
      setLoadingQuartiers(true)
      const timer = setTimeout(() => setLoadingQuartiers(false), 150)
      return () => clearTimeout(timer)
    }
  }, [form.communeId])

  function handleChange(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // Reset downstream location fields
      if (field === 'provinceId') { next.communeId = ''; next.quartierId = '' }
      if (field === 'communeId') { next.quartierId = '' }
      return next
    })
    if (error) setError('')
    if (success) setSuccess('')
  }

  function validate() {
    // Common validation
    if (!form.email.trim()) return t('auth.emailRequired')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return t('auth.emailInvalid')
    if (!form.password) return t('auth.passwordRequired')
    if (form.password.length < 4) return t('auth.passwordTooShort')

    if (!isLogin) {
      if (!form.fullName.trim()) return t('auth.nameRequired')
      if (!form.confirmPassword) return t('auth.confirmRequired')
      if (form.password !== form.confirmPassword) return t('auth.passwordsDontMatch')

      if (isVendeur) {
        if (!form.businessName.trim()) return t('auth.businessNameRequired')
        if (!form.provinceId) return t('auth.provinceRequired')
        if (!form.communeId) return t('auth.communeRequired')
        if (!form.quartierId && !newQuartierName.trim()) return t('auth.quartierRequired')
        if (!form.whatsappNumber || !validateDRCPhoneDetailed(form.whatsappNumber).valid) return t('auth.whatsappInvalid')
        if (!form.latitude || !form.longitude || parseFloat(form.latitude) === 0 || parseFloat(form.longitude) === 0) {
          return t('auth.selectLocation', 'Please select your exact business location on the map.')
        }
      }
    }

    return ''
  }

  function handleAddQuartier() {
    if (!newQuartierName.trim()) return
    setAddQuartierLoading(true)
    try {
      const result = addQuartier(form.communeId, newQuartierName.trim())
      // Select the newly added quartier
      setForm(prev => ({ ...prev, quartierId: result.id }))
      setShowAddQuartier(false)
      setNewQuartierName('')
      setSuccess(t('auth.quartierAdded', { name: result.name }))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setAddQuartierLoading(false)
    }
  }

  async function handleLocateMe() {
    if (!navigator.geolocation) {
      setError(t('auth.locationDenied'))
      return
    }

    setLocating(true)
    setError('')
    setSuccess('')

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        })
      })

      const lat = position.coords.latitude
      const lng = position.coords.longitude

      // Store coordinates
      setForm(prev => ({
        ...prev,
        latitude: String(lat),
        longitude: String(lng)
      }))

      // Reverse geocode
      const result = await geocodingService.reverseGeocode(lat, lng)

      if (!result || !result.address) {
        setError(t('auth.locationNotFound'))
        return
      }

      const addr = result.address

      // Determine province name from address
      let provinceName = addr.state || addr.state_district || ''
      // For Kinshasa, Nominatim returns province = "Kinshasa" as state
      // Sometimes the commune is in suburb/city/town

      // Try to find province match
      const provinces = getProvinces()
      let matchedProvinceId = ''
      for (const p of provinces) {
        if (p.name.toLowerCase() === provinceName.toLowerCase()) {
          matchedProvinceId = p.id
          break
        }
      }
      // If no match, try matching Kinshasa (the province)
      if (!matchedProvinceId) {
        const kinshasa = provinces.find(p => p.name.toLowerCase() === 'kinshasa')
        if (kinshasa) matchedProvinceId = kinshasa.id
      }

      if (!matchedProvinceId) {
        setError(t('auth.locationNotFound'))
        return
      }

      // Determine commune name
      let communeName = ''

      // For Kinshasa, commune is in suburb or city
      if (addr.suburb && matchedProvinceId === 'kinshasa') {
        communeName = addr.suburb
      } else if (addr.city) {
        communeName = addr.city
      } else if (addr.town) {
        communeName = addr.town
      } else if (addr.village) {
        communeName = addr.village
      } else if (addr.county) {
        communeName = addr.county
      }

      // Try to match commune in the selected province
      if (communeName) {
        const communes = getCommunes(matchedProvinceId)
        const matchedCommune = communes.find(c =>
          c.name.toLowerCase() === communeName.toLowerCase()
        )

        if (matchedCommune) {
          setForm(prev => ({
            ...prev,
            provinceId: matchedProvinceId,
            communeId: matchedCommune.id,
            latitude: String(lat),
            longitude: String(lng)
          }))
          setSuccess(t('auth.locationSuccess'))
          setTimeout(() => setSuccess(''), 4000)
        } else {
          // Province matched but commune not found
          setForm(prev => ({
            ...prev,
            provinceId: matchedProvinceId,
            latitude: String(lat),
            longitude: String(lng)
          }))
          setError(t('auth.locationNotFound'))
        }
      } else {
        setError(t('auth.locationNotFound'))
      }
    } catch (err) {
      if (err.code === 1) {
        // PERMISSION_DENIED
        setError(t('auth.locationDenied'))
      } else {
        setError(t('auth.locationError'))
      }
    } finally {
      setLocating(false)
    }
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
        // ─── LOGIN ───
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
        // ─── REGISTER ───
        const existing = userService.findAccountByEmail(form.email.trim())
        if (existing) {
          setError(t('auth.emailAlreadyUsed'))
          setLoading(false)
          return
        }

        // Normalize WhatsApp — always store in E.164 format (+243XXXXXXXXX)
        let normalizedWhatsApp = ''
        if (isVendeur && form.whatsappNumber) {
          normalizedWhatsApp = normalizePhone(form.whatsappNumber) || ''
        }

        // Handle Rue: check if exists, create if not
        let rueId = ''
        if (isVendeur && form.quartierId && form.rueName.trim()) {
          const rueResult = findOrCreateRue(form.quartierId, form.rueName.trim())
          rueId = rueResult.id
        }

        const userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

        // Create user account
        const newUser = {
          id: userId,
          role: isVendeur ? 'vendor' : 'buyer',
          fullName: form.fullName.trim(),
          label: form.fullName.trim().split(' ')[0],
          email: form.email.trim(),
          password: form.password,
          createdAt: new Date().toISOString()
        }

        userService.addAccount(newUser)

        // If Vendeur, create vendor record
        if (isVendeur) {
          const provinceName = getProvinceById(form.provinceId)?.name || ''
          const communeName = getCommuneById(form.communeId)?.name || ''
          const quartierName = form.quartierId ? (getQuartierById(form.quartierId)?.name || '') : ''

          const newVendor = {
            id: `v-vendor-${userId}`,
            ownerId: userId,
            name: form.businessName.trim(),
            category: form.businessCategory || '',
            province: provinceName,
            commune: communeName,
            quartier: quartierName,
            rue: form.rueName.trim(),
            provinceId: form.provinceId,
            communeId: form.communeId,
            quartierId: form.quartierId,
            rueId: rueId,
            coords: form.latitude && form.longitude
              ? [parseFloat(form.latitude), parseFloat(form.longitude)]
              : null,
            rating: 0,
            description: '',
            profileImage: null,
            phoneNumber: normalizedWhatsApp,
            whatsappNumber: normalizedWhatsApp,
            subscription: { plan: 'free', expiresAt: null, subscribedAt: null },
            boostPin: { active: false, expiresAt: null, boostedAt: null, days: 0 },
            delivery: { enabled: false, feeFC: 0, commissionRate: 0.10 },
            socialMediaLinks: {},
            products: []
          }

          // Add vendor to system (immutable: spread to new array)
          const currentVendors = listingService.getVendors()
          listingService.setVendors([...currentVendors, newVendor])
        }

        // Set current user
        const { password: _, ...safeUser } = newUser
        userService.setCurrentUser(safeUser)
        onRegister(safeUser)
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(t('auth.errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* ─── Error / Success Messages ─── */}
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

      {success && (
        <div style={{
          padding: '12px 16px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 12,
          color: '#16a34a',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      {/* ─── Account Type Selection (Register only) ─── */}
      {!isLogin && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {t('auth.accountType')}
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => { setAccountType('buyer'); setError(''); setSuccess('') }}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: `2px solid ${accountType === 'buyer' ? 'var(--primary, #2563eb)' : 'var(--border, #e2e8f0)'}`,
                borderRadius: 10,
                background: accountType === 'buyer' ? 'var(--primary-light, #eff6ff)' : 'var(--surface, #fff)',
                color: accountType === 'buyer' ? 'var(--primary, #2563eb)' : 'var(--text-muted, #94a3b8)',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.15s ease'
              }}
            >
              {t('auth.buyerLabel')}
            </button>
            <button
              type="button"
              onClick={() => { setAccountType('vendeur'); setError(''); setSuccess('') }}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: `2px solid ${accountType === 'vendeur' ? 'var(--primary, #2563eb)' : 'var(--border, #e2e8f0)'}`,
                borderRadius: 10,
                background: accountType === 'vendeur' ? 'var(--primary-light, #eff6ff)' : 'var(--surface, #fff)',
                color: accountType === 'vendeur' ? 'var(--primary, #2563eb)' : 'var(--text-muted, #94a3b8)',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.15s ease'
              }}
            >
              {t('auth.vendeurLabel')}
            </button>
          </div>
        </div>
      )}

      {/* ─── Name ─── */}
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

      {/* ─── Email ─── */}
      <Input
        label={t('auth.email')}
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder={t('auth.emailPlaceholder')}
        required
      />

      {/* ─── Password ─── */}
      <Input
        label={t('auth.password')}
        type="password"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        placeholder={t('auth.passwordPlaceholder')}
        required
      />

      {/* ─── Confirm Password ─── */}
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

      {/* ═══════════════════════════════════════════════
          SELLER-ONLY FIELDS
          ═══════════════════════════════════════════════ */}
      {!isLogin && isVendeur && (
        <div style={{
          borderTop: '1px solid var(--border, #e2e8f0)',
          paddingTop: 16,
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text, #0f172a)' }}>
            {t('auth.businessInfoTitle')}
          </label>

          {/* Business Name */}
          <Input
            label={t('auth.businessName')}
            type="text"
            value={form.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            placeholder={t('auth.businessNamePlaceholder')}
            required
          />

          {/* Business Category */}
          <Select
            label={t('auth.businessCategory')}
            value={form.businessCategory}
            onChange={(e) => handleChange('businessCategory', e.target.value)}
            options={categories}
          />

          {/* ═══ Location Cascading Selects + Mini Map ═══ */}
          <LocationSection
            provinceId={form.provinceId}
            communeId={form.communeId}
            quartierId={form.quartierId}
            rueName={form.rueName}
            latitude={parseFloat(form.latitude) || 0}
            longitude={parseFloat(form.longitude) || 0}
            errors={{}}
            onChange={(field, value) => handleChange(field, value)}
            onCoordsChange={(lat, lng, source) => {
              setForm(prev => ({
                ...prev,
                latitude: String(lat),
                longitude: String(lng)
              }))
            }}
            showMap={true}
            readOnly={false}
          />

          {/* WhatsApp Number */}
          <Input
            label={t('auth.whatsapp')}
            type="tel"
            value={form.whatsappNumber}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[\s\-]/g, '')
              handleChange('whatsappNumber', cleaned)
            }}
            placeholder="+243 81 234 5678"
            required
          />
        </div>
      )}

      {/* ─── Submit Button ─── */}
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

      {/* ─── Switch Mode ─── */}
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
