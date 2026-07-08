/**
 * LocationEditor — Edit-mode version of LocationSection
 *
 * Pre-loads existing vendor location data into the cascading selects and map.
 * Same core as LocationSection but takes initial vendor values and populates state.
 *
 * Props:
 *   vendor          object   — The vendor object with { provinceId, communeId, quartierId, rue, latitude, longitude }
 *   onSave          (vendor) => void  — Called with updated vendor data
 *   onCancel        () => void
 *   errors          object
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { MapPin, Save, X } from 'lucide-react'
import { useTranslation } from '../../i18n/I18nProvider'
import LocationSection from './LocationSection'
import Button from '../ui/Button'

export default function LocationEditor({
  vendor = {},
  onSave = () => {},
  onCancel = () => {},
  errors = {}
}) {
  const { t } = useTranslation()

  // Resolve existing vendor IDs
  const initialProvinceId = vendor.provinceId || ''
  const initialCommuneId = vendor.communeId || ''
  const initialQuartierId = vendor.quartierId || ''

  const [provinceId, setProvinceId] = useState(initialProvinceId)
  const [communeId, setCommuneId] = useState(initialCommuneId)
  const [quartierId, setQuartierId] = useState(initialQuartierId)
  const [rueName, setRueName] = useState(vendor.rue || vendor.street || '')
  const [latitude, setLatitude] = useState(vendor.latitude || (vendor.coords ? vendor.coords[0] : 0))
  const [longitude, setLongitude] = useState(vendor.longitude || (vendor.coords ? vendor.coords[1] : 0))
  const [locationSource, setLocationSource] = useState(vendor.locationSource || 'manual')
  const [localErrors, setLocalErrors] = useState({})

  // Merge external errors
  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      setLocalErrors(errors)
    }
  }, [errors])

  // Handle cascading select changes
  const handleChange = useCallback((field, value) => {
    switch (field) {
      case 'provinceId':
        setProvinceId(value)
        if (value !== provinceId) {
          setCommuneId('')
          setQuartierId('')
        }
        break
      case 'communeId':
        setCommuneId(value)
        if (value !== communeId) {
          setQuartierId('')
        }
        break
      case 'quartierId':
        setQuartierId(value)
        break
      case 'rueName':
        setRueName(value)
        break
      default:
        break
    }
    // Clear error for this field
    if (localErrors[field]) {
      setLocalErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [provinceId, communeId, quartierId, localErrors])

  // Handle map coordinate changes
  const handleCoordsChange = useCallback((lat, lng, source) => {
    setLatitude(lat)
    setLongitude(lng)
    setLocationSource(source)
    if (localErrors.coords) {
      setLocalErrors(prev => ({ ...prev, coords: '' }))
    }
  }, [localErrors])

  // Validate before saving
  const validate = useCallback(() => {
    const errs = {}
    if (!communeId) errs.communeId = t('profileModal.communeRequired', 'Commune is required')
    if (!quartierId) errs.quartierId = t('profileModal.quartierRequired', 'Quartier is required')
    if (!latitude || !longitude || latitude === 0 || longitude === 0) {
      errs.coords = t('auth.selectLocation', 'Please select your exact business location on the map.')
    }
    setLocalErrors(errs)
    return Object.keys(errs).length === 0
  }, [communeId, quartierId, latitude, longitude, t])

  // Save handler
  const handleSave = useCallback(() => {
    if (!validate()) return

    const updatedVendor = {
      ...vendor,
      provinceId,
      communeId,
      quartierId,
      rue: rueName,
      street: rueName,
      latitude,
      longitude,
      coords: [latitude, longitude],
      locationSource
    }

    onSave(updatedVendor)
  }, [vendor, provinceId, communeId, quartierId, rueName, latitude, longitude, locationSource, validate, onSave])

  return (
    <div className="location-editor">
      <div className="location-editor-header">
        <h3>
          <MapPin size={18} />
          {t('profileModal.editLocation', 'Edit Business Location')}
        </h3>
      </div>

      <LocationSection
        provinceId={provinceId}
        communeId={communeId}
        quartierId={quartierId}
        rueName={rueName}
        latitude={latitude}
        longitude={longitude}
        locationSource={locationSource}
        errors={localErrors}
        onChange={handleChange}
        onCoordsChange={handleCoordsChange}
        showMap={true}
        readOnly={false}
      />

      <div className="location-editor-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          <X size={14} />
          {t('general.cancel', 'Cancel')}
        </Button>
        <Button type="button" variant="primary" onClick={handleSave}>
          <Save size={14} />
          {t('general.save', 'Save Location')}
        </Button>
      </div>
    </div>
  )
}
