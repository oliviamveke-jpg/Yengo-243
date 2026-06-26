import React, { useEffect, useRef } from 'react'
import L from 'leaflet'

function haversineDistance([lat1, lng1], [lat2, lng2]) {
  const toRad = deg => (deg * Math.PI) / 180
  const R = 6371000

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const categoryColors = {
  Électronique: '#10b981',
  Vêtements: '#3b82f6',
  Alimentation: '#ef4444',
  Maison: '#8b5cf6',
  Beauté: '#ec4899',
  Outillage: '#f59e0b'
}

function getCategoryColor(category) {
  return categoryColors[category] || '#6b7280'
}

export default function MapView({
  vendors = [],
  selectedVendorId,
  onVendorSelect,
  onNearestVendorClick,
  markersVisible = true,
  mapStyle = 'light',
  targetCoordinate = null,
  targetZoom = null
}) {
  const mapRef = useRef(null)
  const markersRef = useRef(null)
  const vendorsRef = useRef([])

  useEffect(() => {
    vendorsRef.current = vendors
  }, [vendors])

  useEffect(() => {
    if (mapRef.current) return

    const map = L.map('react-map', {
      zoomControl: true
    }).setView([-4.325, 15.3222], 12)

    mapRef.current = map

    const tileLayer = L.tileLayer(
      mapStyle === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        attribution: '© OpenStreetMap © CARTO'
      }
    )

    tileLayer.addTo(map)

    map.tileLayerRef = tileLayer

    markersRef.current = L.layerGroup().addTo(map)

    map.on('click', e => {
      const currentVendors = vendorsRef.current

      if (!currentVendors.length) return

      let nearest = null

      currentVendors.forEach(vendor => {
        if (!vendor.coords) return

        const distance = haversineDistance(
          [e.latlng.lat, e.latlng.lng],
          vendor.coords
        )

        if (!nearest || distance < nearest.distance) {
          nearest = { vendor, distance }
        }
      })

      if (nearest && nearest.distance < 3000) {
        onNearestVendorClick?.(nearest.vendor.id)
      }
    })

    const locateControl = L.control({ position: 'topleft' })

    locateControl.onAdd = () => {
      const btn = L.DomUtil.create('button')

      btn.innerHTML = '📍'
      btn.className = 'leaflet-bar locate-btn'
      btn.title = 'Locate Me'

      btn.onclick = () => {
        navigator.geolocation.getCurrentPosition(
          pos => {
            map.flyTo(
              [pos.coords.latitude, pos.coords.longitude],
              15
            )
          },
          err => {
            console.error(err)
          }
        )
      }

      return btn
    }

    locateControl.addTo(map)

    setTimeout(() => map.invalidateSize(), 200)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current

    if (!map) return

    if (map.tileLayerRef) {
      map.removeLayer(map.tileLayerRef)
    }

    const layer = L.tileLayer(
      mapStyle === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        attribution: '© OpenStreetMap © CARTO'
      }
    )

    layer.addTo(map)
    map.tileLayerRef = layer
  }, [mapStyle])

  useEffect(() => {
    const map = mapRef.current
    const layer = markersRef.current

    if (!map || !layer) return

    layer.clearLayers()

    if (!markersVisible) return

    vendors.forEach(vendor => {
      const coords = vendor.coords || [-4.325, 15.3222]

      const isSelected =
        vendor.id === selectedVendorId

      const color = getCategoryColor(vendor.category)

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div
            class="marker-pin ${isSelected ? 'selected' : ''}"
            style="
              background:${color};
              width:24px;
              height:24px;
              border-radius:50%;
              border:3px solid white;
              box-shadow:0 0 8px rgba(0,0,0,.3);
            ">
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      const marker = L.marker(coords, { icon })

      marker.bindPopup(`
        <strong>${vendor.name}</strong>
        <br />
        ${vendor.category}
      `)

      marker.on('click', () => {
        onVendorSelect?.(vendor.id)
      })

      marker.addTo(layer)

      if (isSelected) {
        marker.openPopup()
      }
    })

    map.invalidateSize()
  }, [
    vendors,
    selectedVendorId,
    markersVisible,
    onVendorSelect
  ])

  useEffect(() => {
    if (!selectedVendorId || !mapRef.current) return

    const vendor = vendors.find(
      v => v.id === selectedVendorId
    )

    if (!vendor?.coords) return

    mapRef.current.flyTo(vendor.coords, 15, {
      animate: true,
      duration: 1.5
    })
  }, [selectedVendorId, vendors])

  useEffect(() => {
    if (!targetCoordinate || !mapRef.current) return

    mapRef.current.flyTo(targetCoordinate, targetZoom || 14, {
      animate: true,
      duration: 1.5
    })
  }, [targetCoordinate, targetZoom])

  return (
    <div className="map-card">
      <div
        id="react-map"
        className="map-canvas"
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}