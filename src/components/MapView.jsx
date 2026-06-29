import React, { useEffect, useRef } from 'react'
import L from 'leaflet'

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
  markersVisible = true,
  mapStyle = 'light',
  targetCoordinate = null,
  targetZoom = null
}) {
  const mapRef = useRef(null)
  const markersRef = useRef(null)
  const vendorsRef = useRef([])
  const clickTimeoutRef = useRef(null)
  const lastClickedVendorRef = useRef(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    vendorsRef.current = vendors
  }, [vendors])

  useEffect(() => {
    if (mapRef.current) return

    const map = L.map('react-map', {
      zoomControl: true,
      doubleClickZoom: false
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
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      if (tooltipRef.current) {
        map.removeLayer(tooltipRef.current)
      }
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

      marker.on('mouseover', () => {
        if (tooltipRef.current) {
          map.removeLayer(tooltipRef.current)
        }
        
        const tooltip = L.tooltip({
          permanent: false,
          direction: 'top',
          offset: [0, -15],
          className: 'yengo-marker-tooltip'
        }).setContent(vendor.name)
        
        marker.bindTooltip(tooltip).openTooltip()
        tooltipRef.current = tooltip
      })

      marker.on('mouseout', () => {
        if (tooltipRef.current) {
          map.removeLayer(tooltipRef.current)
          tooltipRef.current = null
        }
        marker.closeTooltip()
      })

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e)
        
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
          clickTimeoutRef.current = null
          
          if (lastClickedVendorRef.current === vendor.id) {
            onVendorSelect?.(vendor.id)
          }
          lastClickedVendorRef.current = null
        } else {
          lastClickedVendorRef.current = vendor.id
          clickTimeoutRef.current = setTimeout(() => {
            clickTimeoutRef.current = null
            lastClickedVendorRef.current = null
            
            if (mapRef.current && vendor.coords) {
              mapRef.current.flyTo(vendor.coords, 17, {
                animate: true,
                duration: 1.5
              })
            }
          }, 300)
        }
      })

      marker.addTo(layer)
    })

    map.invalidateSize()

    if (vendors.length > 0) {
      const bounds = L.latLngBounds(vendors.map(v => v.coords || [-4.325, 15.3222]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 })
    }
  }, [
    vendors,
    selectedVendorId,
    markersVisible,
    onVendorSelect
  ])


  useEffect(() => {
    if (!targetCoordinate || !mapRef.current) return

    mapRef.current.flyTo(targetCoordinate, targetZoom || 14, {
      animate: true,
      duration: 1.5
    })
  }, [targetCoordinate, targetZoom])

  return (
    <div className="map-card" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {vendors.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px 30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000,
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '16px', color: '#374151' }}>
            No businesses found in this area.
          </p>
        </div>
      )}
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