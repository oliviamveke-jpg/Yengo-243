/**
 * LocationSection — Province → Commune → Quartier cascading selects + embedded mini-map
 *
 * Lazy-loads the Leaflet map only when the section becomes visible (IntersectionObserver).
 * Auto-centers the map on the best available centroid as the user drills down.
 *
 * Props:
 *   provinceId      string   — Controlled province ID
 *   communeId       string   — Controlled commune ID
 *   quartierId      string   — Controlled quartier ID
 *   rueName         string   — Street name text
 *   latitude        number   — Current latitude
 *   longitude       number   — Current longitude
 *   locationSource  string   — 'gps' | 'manual' | 'quartier_center'
 *   errors          object   — Validation errors
 *   onChange        (field, value) => void
 *   onCoordsChange  (lat, lng, source) => void
 *   showMap         boolean  — Show map section (default true)
 *   readOnly        boolean  — Map read-only mode (for display)
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react'
import { MapPin, Navigation, Loader } from 'lucide-react'
import { useTranslation } from '../../i18n/I18nProvider'
import {
  getProvinces,
  getCommunes,
  getQuartiers,
  addQuartier,
  getProvinceById,
  getCommuneById,
  getQuartierById,
  getBestCentroid,
  getCommonProvinceId,
  getCommuneCentroid
} from '../../services/locationService'
import Input from '../ui/Input'
import Select from '../ui/Select'

// Lazy load the map component — it depends on Leaflet (large bundle)
const LocationPickerMap = lazy(() => import('./LocationPickerMap'))

// Loading placeholder for the map
function MapLoader() {
  return (
    <div className="loc-picker-loading">
      <Loader size={24} className="loc-picker-spinner" />
      <span>Loading map...</span>
    </div>
  )
}

export default function LocationSection({
  provinceId = '',
  communeId = '',
  quartierId = '',
  rueName = '',
  latitude = 0,
  longitude = 0,
  locationSource = 'manual',
  errors = {},
  onChange = () => {},
  onCoordsChange = () => {},
  showMap = true,
  readOnly = false
}) {
  const { t } = useTranslation()

  // ─── Intersection Observer for lazy map loading ───
  const sectionRef = useRef(null)
  const [mapVisible, setMapVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // ─── Cascading options ───
  const provinces = useMemo(
    () => getProvinces().map(p => ({ value: p.id, label: p.name })),
    []
  )
  const communes = useMemo(
    () => (provinceId ? getCommunes(provinceId).map(c => ({ value: c.id, label: c.name })) : []),
    [provinceId]
  )
  const quartiers = useMemo(
    () => (communeId ? getQuartiers(communeId).map(q => ({ value: q.id, label: q.name })) : []),
    [communeId]
  )

  // ─── Loading spinners for cascading selects ───
  const [loadingCommunes, setLoadingCommunes] = useState(false)
  const [loadingQuartiers, setLoadingQuartiers] = useState(false)

  useEffect(() => {
    if (provinceId) {
      setLoadingCommunes(true)
      const timer = setTimeout(() => setLoadingCommunes(false), 150)
      return () => clearTimeout(timer)
    }
  }, [provinceId])

  useEffect(() => {
    if (communeId) {
      setLoadingQuartiers(true)
      const timer = setTimeout(() => setLoadingQuartiers(false), 150)
      return () => clearTimeout(timer)
    }
  }, [communeId])

  // ─── Map center: best centroid from selected location ───
  const mapCenter = useMemo(() => {
    if (quartierId || communeId || provinceId) {
      const coords = getBestCentroid(quartierId, communeId, provinceId)
      if (coords) return { lat: coords[0], lng: coords[1] }
    }
    return null
  }, [quartierId, communeId, provinceId])

  // ─── Handle cascading changes ───
  const handleProvinceChange = useCallback(
    (e) => {
      onChange('provinceId', e.target.value)
      if (e.target.value !== provinceId) {
        onChange('communeId', '')
        onChange('quartierId', '')
      }
    },
    [onChange, provinceId]
  )

  const handleCommuneChange = useCallback(
    (e) => {
      onChange('communeId', e.target.value)
      if (e.target.value !== communeId) {
        onChange('quartierId', '')
      }
    },
    [onChange, communeId]
  )

  const handleQuartierChange = useCallback(
    (e) => {
      onChange('quartierId', e.target.value)
    },
    [onChange]
  )

  // ─── Add quartier inline ───
  const [showAddQuartier, setShowAddQuartier] = useState(false)
  const [newQuartierName, setNewQuartierName] = useState('')
  const [addQuartierLoading, setAddQuartierLoading] = useState(false)

  const handleAddQuartier = useCallback(() => {
    if (!newQuartierName.trim()) return
    setAddQuartierLoading(true)
    try {
      const result = addQuartier(communeId, newQuartierName.trim())
      onChange('quartierId', result.id)
      setShowAddQuartier(false)
      setNewQuartierName('')
    } catch (err) {
      console.error('Failed to add quartier:', err)
    } finally {
      setAddQuartierLoading(false)
    }
  }, [newQuartierName, communeId, onChange])

  // ─── Validation message ───
  const hasCoords = latitude && longitude && latitude !== 0 && longitude !== 0

  return (
    <div ref={sectionRef} className="location-section">
      <h4 className="location-section-title">
        <MapPin size={18} />
        {t('auth.businessLocation', 'Business Location')}
      </h4>
      <p className="location-section-desc">
        {t('auth.locationDesc', 'Select your province, commune and quartier, then pinpoint your exact location on the map.')}
      </p>

      {/* ─── Province ─── */}
      <Select
        label={t('auth.province', 'Province')}
        value={provinceId}
        onChange={handleProvinceChange}
        options={provinces}
        error={errors.provinceId}
        required
      />

      {/* ─── Commune (cascading) ─── */}
      {provinceId && (
        <div style={{ position: 'relative' }}>
          <Select
            label={t('auth.commune', 'Commune')}
            value={communeId}
            onChange={handleCommuneChange}
            options={communes}
            error={errors.communeId}
            required
          />
          {loadingCommunes && (
            <div className="cascade-spinner" />
          )}
        </div>
      )}

      {/* ─── Quartier (cascading) ─── */}
      {communeId && (
        <div style={{ position: 'relative' }}>
          <Select
            label={t('auth.quartier', 'Quartier')}
            value={quartierId}
            onChange={handleQuartierChange}
            options={quartiers}
            error={errors.quartierId}
            required
          />
          {loadingQuartiers && (
            <div className="cascade-spinner" />
          )}

          {/* Add quartier button */}
          {!showAddQuartier && (
            <button
              type="button"
              className="location-add-btn"
              onClick={() => setShowAddQuartier(true)}
            >
              + {t('auth.addQuartierLabel', 'Add Quartier')}
            </button>
          )}

          {/* Add quartier form */}
          {showAddQuartier && (
            <div className="location-add-form">
              <label className="location-add-label">
                {t('auth.newQuartierLabel', 'New Quartier Name')}
              </label>
              <div className="location-add-row">
                <input
                  type="text"
                  value={newQuartierName}
                  onChange={(e) => setNewQuartierName(e.target.value)}
                  placeholder={t('auth.quartierPlaceholder', 'Quartier name')}
                  className="location-add-input"
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={handleAddQuartier}
                  disabled={addQuartierLoading || !newQuartierName.trim()}
                >
                  {addQuartierLoading ? '...' : t('general.submit', 'Add')}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => { setShowAddQuartier(false); setNewQuartierName('') }}
                >
                  {t('general.cancel', 'Cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Rue (street name — optional but recommended) ─── */}
      {quartierId && (
        <Input
          label={t('auth.rue', 'Street (Rue)')}
          name="rueName"
          value={rueName}
          onChange={(e) => onChange('rueName', e.target.value)}
          placeholder={t('auth.ruePlaceholder', 'Rue name (optional)')}
        />
      )}

      {/* ─── Mini Interactive Map ─── */}
      {showMap && quartierId && (
        <div className="location-map-wrapper">
          <label className="location-map-label">
            <MapPin size={14} />
            {t('auth.exactLocation', 'Select your exact location on the map')}
            <span className="location-required">*</span>
          </label>

          {mapVisible ? (
            <Suspense fallback={<MapLoader />}>
              <LocationPickerMap
                latitude={latitude}
                longitude={longitude}
                centerLat={mapCenter?.lat ?? null}
                centerLng={mapCenter?.lng ?? null}
                onCoordsChange={onCoordsChange}
                readOnly={readOnly}
                height="300px"
              />
            </Suspense>
          ) : (
            <MapLoader />
          )}

          {/* Validation error */}
          {errors.coords && (
            <p className="form-error">{errors.coords}</p>
          )}

          {/* Success indicator */}
          {hasCoords && !errors.coords && (
            <p className="location-success">
              <MapPin size={14} />
              {t('auth.locationSet', 'Location saved')} ({Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)})
            </p>
          )}
        </div>
      )}

      {/* ─── GPS "Locate Me" button (shown before quartier is selected) ─── */}
      {!readOnly && communeId && !quartierId && (
        <button
          type="button"
          className="location-gps-btn"
          onClick={() => {
            // Scroll the user down to the map
            if (sectionRef.current) {
              sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          }}
        >
          <Navigation size={16} />
          {t('auth.selectQuartierFirst', 'Select a quartier to enable the map')}
        </button>
      )}
    </div>
  )
}
