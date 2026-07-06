import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
<<<<<<< HEAD
import Input from '../ui/Input'
import Button from '../ui/Button'
import Toggle from '../ui/Toggle'
import { vendorStorage } from '../../utils/storage'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
}

export default function BusinessHoursModal({ isOpen, onClose, vendor, onHoursUpdated }) {
=======
import Button from '../ui/Button'
import Toggle from '../ui/Toggle'
import { listingService } from '../../services/listingService'
import { useTranslation } from '../../i18n/I18nProvider'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_KEYS = {
  monday: 'businessHours.monday',
  tuesday: 'businessHours.tuesday',
  wednesday: 'businessHours.wednesday',
  thursday: 'businessHours.thursday',
  friday: 'businessHours.friday',
  saturday: 'businessHours.saturday',
  sunday: 'businessHours.sunday'
}
const DEFAULT_HOURS = { monday: { open: '09:00', close: '18:00', closed: false }, tuesday: { open: '09:00', close: '18:00', closed: false }, wednesday: { open: '09:00', close: '18:00', closed: false }, thursday: { open: '09:00', close: '18:00', closed: false }, friday: { open: '09:00', close: '18:00', closed: false }, saturday: { open: '09:00', close: '14:00', closed: false }, sunday: { open: null, close: null, closed: true } }

export default function BusinessHoursModal({ isOpen, onClose, vendor, onHoursUpdated }) {
  const { t } = useTranslation()
>>>>>>> e66c1ea (Update app)
  const [businessHours, setBusinessHours] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (vendor && isOpen) {
<<<<<<< HEAD
      const settings = vendorStorage.getSettings(vendor.id)
      setBusinessHours(settings.businessHours || {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '14:00', closed: false },
        sunday: { open: null, close: null, closed: true }
      })
=======
      const settings = listingService.getSettings(vendor.id)
      setBusinessHours(settings.businessHours || DEFAULT_HOURS)
>>>>>>> e66c1ea (Update app)
    }
  }, [vendor, isOpen])

  const handleDayChange = (day, field, value) => {
<<<<<<< HEAD
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
=======
    setBusinessHours(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
>>>>>>> e66c1ea (Update app)
  }

  const handleApplyToAll = () => {
    const mondayHours = businessHours.monday
    const newHours = {}
<<<<<<< HEAD
    DAYS.forEach(day => {
      newHours[day] = {
        open: mondayHours.open,
        close: mondayHours.close,
        closed: mondayHours.closed
      }
    })
=======
    DAYS.forEach(day => { newHours[day] = { open: mondayHours.open, close: mondayHours.close, closed: mondayHours.closed } })
>>>>>>> e66c1ea (Update app)
    setBusinessHours(newHours)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
<<<<<<< HEAD

    try {
      const settings = vendorStorage.getSettings(vendor.id)
      settings.businessHours = businessHours
      vendorStorage.setSettings(vendor.id, settings)

      onHoursUpdated(businessHours)
      handleClose()
      alert('Business hours updated successfully!')
    } catch (error) {
      console.error('Error updating business hours:', error)
      alert('Failed to update business hours. Please try again.')
=======
    try {
      const settings = listingService.getSettings(vendor.id)
      settings.businessHours = businessHours
      listingService.setSettings(vendor.id, settings)
      onHoursUpdated(businessHours)
      onClose()
    } catch (error) {
      // Error is shown inline in the UI, no alert needed
>>>>>>> e66c1ea (Update app)
    } finally {
      setIsSubmitting(false)
    }
  }

<<<<<<< HEAD
  const handleClose = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Business Hours" size="large">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <Button type="button" variant="secondary" onClick={handleApplyToAll}>
            Apply Monday Hours to All Days
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {DAYS.map(day => (
            <div
              key={day}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 1fr 100px',
                gap: '12px',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#0f172a',
                borderRadius: '8px'
              }}
            >
              <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{DAY_LABELS[day]}</span>
              
              <Input
                label="Open"
                name={`${day}-open`}
                type="time"
                value={businessHours[day]?.open || ''}
                onChange={(e) => handleDayChange(day, 'open', e.target.value)}
                disabled={businessHours[day]?.closed}
                style={{ marginBottom: 0 }}
              />
              
              <Input
                label="Close"
                name={`${day}-close`}
                type="time"
                value={businessHours[day]?.close || ''}
                onChange={(e) => handleDayChange(day, 'close', e.target.value)}
                disabled={businessHours[day]?.closed}
                style={{ marginBottom: 0 }}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle
                  checked={!businessHours[day]?.closed}
                  onChange={(checked) => handleDayChange(day, 'closed', !checked)}
                />
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Open</span>
=======
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('businessHours.title')} size="large">
      <form onSubmit={handleSubmit}>
        <Button type="button" variant="secondary" onClick={handleApplyToAll} style={{ marginBottom: 20 }}>
          {t('businessHours.applyToAll')}
        </Button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DAYS.map(day => (
            <div key={day} className="dashboard-card-bg" style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px', gap: 12, alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>{t(DAY_KEYS[day])}</span>
              <input type="time" value={businessHours[day]?.open || ''} onChange={(e) => handleDayChange(day, 'open', e.target.value)} disabled={businessHours[day]?.closed} className="form-input" />
              <input type="time" value={businessHours[day]?.close || ''} onChange={(e) => handleDayChange(day, 'close', e.target.value)} disabled={businessHours[day]?.closed} className="form-input" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Toggle checked={!businessHours[day]?.closed} onChange={(checked) => handleDayChange(day, 'closed', !checked)} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('businessHours.open')}</span>
>>>>>>> e66c1ea (Update app)
              </div>
            </div>
          ))}
        </div>
<<<<<<< HEAD

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Hours'}
          </Button>
=======
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>{t('businessHours.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? t('businessHours.saving') : t('businessHours.save')}</Button>
>>>>>>> e66c1ea (Update app)
        </div>
      </form>
    </Modal>
  )
}
