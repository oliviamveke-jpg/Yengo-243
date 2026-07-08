/**
 * LocationPickerMap — Mini interactive Leaflet map for vendor registration.
 *
 * Features:
 * - Draggable marker
 * - Click anywhere to move marker
 * - "Find My Location" GPS button
 * - Zoom controls
 * - Fullscreen optional
 * - Displays current latitude/longitude
 * - Auto-zooms to quartier/commune/province centroid when selection changes
 *
 * Props:
 *   latitude        number     — Initial latitude (or 0)
 *   longitude       number     — Initial longitude (or 0)
 *   centerLat       number     — Where to center the map (from location cascade)
 *   centerLng       number     — Where to center the map
 *   onCoordsChange  (lat, lng, source) => void
 *   readOnly        boolean    — Hide interaction controls
 *   height          string     — CSS height (default "300px")
 */

import React, { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import { MapPin, Navigation, Crosshair, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react'
import { geocodingService } from '../../services/geocodingService'

// Default Kinshasa center
const DEFAULT_CENTER = [-4.3219402, 15.3118474]
const DEFAULT_ZOOM = 13

// Draggable marker icon SVG (red pin)
function createDraggableIcon() {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44">',
    '<defs><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">',
    '<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>',
    '</filter></defs>',
    '<path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 28 16 28s16-16 16-28C32 7.2 24.8 0 16 0zm0 22c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="#EF4444" filter="url(#shadow)"/>',
    '<circle cx="16" cy="16" r="6" fill="#FFFFFF"/>',
    '</svg>'
  ].join('')
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export default function LocationPickerMap({
  latitude = 0,
  longitude = 0,
  centerLat = null,
  centerLng = null,
  onCoordsChange = () => {},
  readOnly = false,
  height = '300px'
}) {
  const containerId = useRef(`loc-picker-${Math.random().toString(36).slice(2, 8)}`)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [displayLat, setDisplayLat] = useState(latitude || 0)
  const [displayLng, setDisplayLng] = useState(longitude || 0)
  const [locationSource, setLocationSource] = useState('manual')

  const hasInitialCoords = latitude && longitude && latitude !== 0 && longitude !== 0

  // Format to 6 decimal places
  const fmt = (v) => Number(v || 0).toFixed(6)

  // Notify parent of coordinate changes
  const notify = useCallback((lat, lng, source) => {
    const fLat = parseFloat(fmt(lat))
    const fLng = parseFloat(fmt(lng))
    setDisplayLat(fLat)
    setDisplayLng(fLng)
    setLocationSource(source || 'manual')
    if (onCoordsChange) {
      onCoordsChange(fLat, fLng, source || 'manual')
    }
  }, [onCoordsChange])

  // ─── Initialize map ───
  useEffect(() => {
    const container = document.getElementById(containerId.current)
    if (!container || mapInstanceRef.current) return

    // Center on existing coords or provided center or fallback
    const initLat = hasInitialCoords ? latitude : (centerLat || DEFAULT_CENTER[0])
    const initLng = hasInitialCoords ? longitude : (centerLng || DEFAULT_CENTER[1])
    const initZoom = hasInitialCoords ? 16 : DEFAULT_ZOOM

    const map = L.map(container, {
      zoomControl: false,
      attributionControl: false,
      dragging: !readOnly
    }).setView([initLat, initLng], initZoom)

    // Tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap © CARTO'
    }).addTo(map)

    // Zoom controls (left side to avoid overlap with our custom buttons)
    if (!readOnly) {
      L.control.zoom({ position: 'bottomleft' }).addTo(map)
    }

    mapInstanceRef.current = map

    // ─── Create draggable marker ───
    const markerLat = hasInitialCoords ? latitude : initLat
    const markerLng = hasInitialCoords ? longitude : initLng

    const iconUrl = createDraggableIcon()
    const icon = L.icon({
      iconUrl,
      iconSize: [32, 44],
      iconAnchor: [16, 44],
      popupAnchor: [0, -44]
    })

    const marker = L.marker([markerLat, markerLng], {
      icon,
      draggable: !readOnly
    }).addTo(map)

    markerRef.current = marker

    // If we had initial coords, set source to manual (user already placed)
    if (hasInitialCoords) {
      notify(markerLat, markerLng, 'manual')
    } else {
      notify(markerLat, markerLng, 'quartier_center')
    }

    // ─── Drag end handler ───
    marker.on('dragend', () => {
      const pos = marker.getLatLng()
      notify(pos.lat, pos.lng, 'manual')
    })

    // ─── Click on map to move marker ───
    if (!readOnly) {
      map.on('click', (e) => {
        marker.setLatLng(e.latlng)
        notify(e.latlng.lat, e.latlng.lng, 'manual')
      })
    }

    // Invalidate size after mount
    setTimeout(() => map.invalidateSize(), 200)

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markerRef.current = null
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Update map center when location cascade changes ───
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // If user has manually placed a marker, don't auto-center
    // Only auto-center if there are no manually set coords
    if (hasInitialCoords && locationSource === 'manual') return

    if (centerLat != null && centerLng != null) {
      const zoom = 15
      map.flyTo([centerLat, centerLng], zoom, {
        animate: true,
        duration: 1.0
      })

      // Place marker at center as well
      if (markerRef.current) {
        markerRef.current.setLatLng([centerLat, centerLng])
      }
      notify(centerLat, centerLng, 'quartier_center')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerLat, centerLng])

  // ─── GPS Locate Me ───
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation || readOnly) return

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const map = mapInstanceRef.current

        if (map) {
          map.flyTo([lat, lng], 17, { animate: true, duration: 1.0 })
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        }
        notify(lat, lng, 'gps')
        setLocating(false)
      },
      (err) => {
        console.warn('Geolocation error:', err)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    )
  }, [readOnly, notify])

  // ─── Fullscreen toggle ───
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
    // Invalidate map size after animation
    setTimeout(() => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize()
    }, 300)
  }, [])

  // ─── Zoom helpers ───
  const zoomIn = useCallback(() => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn()
  }, [])

  const zoomOut = useCallback(() => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut()
  }, [])

  return (
    <div className={`loc-picker-wrapper ${isFullscreen ? 'loc-picker-fullscreen' : ''}`}>
      <div
        id={containerId.current}
        className="loc-picker-map"
        style={{ width: '100%', height: isFullscreen ? '100%' : height }}
      />

      {/* ─── Coordinate display ─── */}
      <div className="loc-picker-coords">
        <MapPin size={14} />
        <span>
          {fmt(displayLat)}, {fmt(displayLng)}
        </span>
        <span className="loc-picker-source">
          {locationSource === 'gps' ? '📍 GPS' : locationSource === 'quartier_center' ? '📍 Centre' : '📍 Manuel'}
        </span>
      </div>

      {/* ─── Control buttons (bottom-right of map) ─── */}
      {!readOnly && (
        <div className="loc-picker-controls">
          <button
            type="button"
            className="loc-picker-btn"
            onClick={handleLocateMe}
            disabled={locating}
            title="Find my location"
          >
            {locating ? (
              <span className="loc-picker-spinner" />
            ) : (
              <Navigation size={16} />
            )}
          </button>
          <button
            type="button"
            className="loc-picker-btn"
            onClick={zoomIn}
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            className="loc-picker-btn"
            onClick={zoomOut}
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            type="button"
            className="loc-picker-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      )}

      {/* ─── Hint text ─── */}
      {!readOnly && !hasInitialCoords && (
        <div className="loc-picker-hint">
          Click on the map or drag the marker to set your exact location
        </div>
      )}
    </div>
  )
}
