import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
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
  const [businessHours, setBusinessHours] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (vendor && isOpen) {
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
    }
  }, [vendor, isOpen])

  const handleDayChange = (day, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
  }

  const handleApplyToAll = () => {
    const mondayHours = businessHours.monday
    const newHours = {}
    DAYS.forEach(day => {
      newHours[day] = {
        open: mondayHours.open,
        close: mondayHours.close,
        closed: mondayHours.closed
      }
    })
    setBusinessHours(newHours)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

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
    } finally {
      setIsSubmitting(false)
    }
  }

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
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Hours'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
