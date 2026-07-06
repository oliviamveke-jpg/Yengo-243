<<<<<<< HEAD
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
=======
import React, { useEffect, useRef, useImperativeHandle } from 'react'
import L from 'leaflet'
import { useTranslation } from '../i18n/I18nProvider'
import { subcategoryService } from '../services/subcategoryService'
import { getCategoryConfig } from '../data/categoryConfig'
import { createLeafletIcon, MARKER_SIZES } from './markers/markerIcons'
import { createUserLocationIcon } from './markers/UserLocationMarker'

const STREET_LEVEL_ZOOM = 17

/* ─── SVG placeholder for vendor cards (unchanged from original) ─── */
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
}

function getVendorImage(vendor, t) {
  const productImage = vendor.products?.find(p => p.image)?.image
  if (vendor.profileImage) return vendor.profileImage
  if (productImage) return productImage
  const title = esc(vendor.name || (t('app.title') + t('app.tagline')))
  const category = esc(vendor.category || 'Boutique')
  const catConfig = getCategoryConfig(vendor.category)
  const color = catConfig.color
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="210" viewBox="0 0 320 210">
      <rect width="320" height="210" fill="#eef6ff"/>
      <rect x="38" y="58" width="244" height="112" rx="12" fill="#ffffff"/>
      <rect x="56" y="82" width="208" height="64" rx="8" fill="${color}" opacity=".14"/>
      <path d="M72 70h176l18 30H54z" fill="${color}"/>
      <path d="M82 112h52v58H82zM150 112h88v34h-88z" fill="#dbeafe"/>
      <text x="160" y="44" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#0f172a">${title}</text>
      <text x="160" y="194" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#334155">${category}</text>
    </svg>
  `
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function getStoreCardHtml(vendor, t) {
  const image = getVendorImage(vendor, t)
  const name = esc(vendor.name)
  const category = esc(vendor.category)
  const commune = esc(vendor.commune)
  const quartier = esc(vendor.quartier || '')
  const rating = Number(vendor.rating || 0).toFixed(1)

  return `
    <div class="vendor-card" style="cursor:default;box-shadow:0 2px 8px rgba(0,0,0,0.06);border-radius:14px;overflow:hidden;background:#fff;border:1px solid #e2e8f0;">
      <img class="vendor-card-image" src="${image}" alt="${name}" style="width:100%;height:150px;object-fit:cover;background:#f5f7fa;border-bottom:1px solid #e2e8f0;" />
      <div class="vendor-card-body" style="padding:14px 16px;display:flex;flex-direction:column;gap:6px;">
        <div class="vendor-card-name" style="font-weight:700;color:#1e293b;font-size:0.95rem;display:flex;align-items:center;gap:6px;">${name}</div>
        <div class="vendor-card-category" style="font-size:0.8rem;color:#94a3b8;font-weight:500;">${category}</div>
        <div class="vendor-card-location" style="font-size:0.8rem;color:#64748b;display:flex;align-items:center;gap:4px;">📍 ${quartier || commune}, ${commune}</div>
        <div class="vendor-card-rating" style="display:flex;align-items:center;gap:4px;font-size:0.8rem;color:#64748b;font-weight:600;">
          <span class="vendor-card-rating-stars" style="color:#f59e0b;letter-spacing:1px;">${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))}</span>
          <span>${rating}</span>
        </div>
      </div>
    </div>
  `
}

const MapView = React.forwardRef(function MapView({
  vendors = [],
  selectedVendorId,
  markersVisible = true,
  mapStyle = 'light',
  targetCoordinate = null,
  targetZoom = null,
  hiddenCategories = [],
  onBusinessSelect = null,
  drawerOpen = false
}, ref) {
  const { t } = useTranslation()
  const mapRef = useRef(null)
  const markersRef = useRef(null)
  const vendorsRef = useRef([])
  const fittedVendorsKeyRef = useRef(null)
  const tooltipRef = useRef(null)
  const onBusinessSelectRef = useRef(onBusinessSelect)
  const prevDrawerOpenRef = useRef(false)
  const originalCenterRef = useRef(null)
  const userMarkerRef = useRef(null)

  useImperativeHandle(ref, () => ({
    zoomIn() {
      if (mapRef.current) mapRef.current.zoomIn()
    },
    zoomOut() {
      if (mapRef.current) mapRef.current.zoomOut()
    }
  }), [])

  useEffect(() => {
    onBusinessSelectRef.current = onBusinessSelect
  }, [onBusinessSelect])
>>>>>>> e66c1ea (Update app)

  useEffect(() => {
    vendorsRef.current = vendors
  }, [vendors])

<<<<<<< HEAD
=======
  // Handle map offset when drawer opens/closes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (drawerOpen && !prevDrawerOpenRef.current) {
      originalCenterRef.current = map.getCenter()
      if (onBusinessSelectRef.current) {
        const selectedVendor = vendorsRef.current.find(v => v.id === selectedVendorId)
        if (selectedVendor?.coords) {
          const point = map.latLngToContainerPoint(selectedVendor.coords)
          const offsetX = 220
          const newPoint = L.point(point.x - offsetX, point.y)
          const newLatLng = map.containerPointToLatLng(newPoint)
          map.panTo(newLatLng, { animate: true, duration: 0.3 })
        }
      }
    }

    if (!drawerOpen && prevDrawerOpenRef.current && originalCenterRef.current) {
      map.flyTo(originalCenterRef.current, map.getZoom(), {
        animate: true,
        duration: 0.5
      })
      originalCenterRef.current = null
    }

    prevDrawerOpenRef.current = drawerOpen
  }, [drawerOpen, selectedVendorId])

  // Initialize the Leaflet map
>>>>>>> e66c1ea (Update app)
  useEffect(() => {
    if (mapRef.current) return

    const map = L.map('react-map', {
<<<<<<< HEAD
      zoomControl: true,
=======
      zoomControl: false,
>>>>>>> e66c1ea (Update app)
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
<<<<<<< HEAD

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
=======
    map.tileLayerRef = tileLayer
    markersRef.current = L.layerGroup().addTo(map)

    // Add user location marker
    const userIcon = createUserLocationIcon()
    // We'll place it when geolocation fires — just create a hidden placeholder for now
    userMarkerRef.current = L.marker([-4.325, 15.3222], {
      icon: userIcon,
      interactive: false,
      keyboard: false
    }).addTo(map)
    userMarkerRef.current.setOpacity(0)
>>>>>>> e66c1ea (Update app)

    setTimeout(() => map.invalidateSize(), 200)

    return () => {
<<<<<<< HEAD
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      if (tooltipRef.current) {
        map.removeLayer(tooltipRef.current)
      }
=======
      if (tooltipRef.current) map.removeLayer(tooltipRef.current)
>>>>>>> e66c1ea (Update app)
      map.remove()
      mapRef.current = null
    }
  }, [])

<<<<<<< HEAD
  useEffect(() => {
    const map = mapRef.current

    if (!map) return

    if (map.tileLayerRef) {
      map.removeLayer(map.tileLayerRef)
    }
=======
  // Update tile layer on map style change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (map.tileLayerRef) map.removeLayer(map.tileLayerRef)
>>>>>>> e66c1ea (Update app)

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

<<<<<<< HEAD
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
=======
  // ---- Try to get user location and update the user marker ----
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Wait a beat for map to be fully ready
    const timeout = setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = [pos.coords.latitude, pos.coords.longitude]
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng(latlng)
            userMarkerRef.current.setOpacity(1)
          }
        },
        () => {
          // Fallback: show at Kinshasa center
          userMarkerRef.current?.setOpacity(0)
        },
        { enableHighAccuracy: false, timeout: 5000 }
      )
    }, 500)

    return () => clearTimeout(timeout)
  }, [])

  // ---- Build markers ----
  useEffect(() => {
    const map = mapRef.current
    const layer = markersRef.current
    if (!map || !layer) return

    layer.clearLayers()
    if (!markersVisible) return

    vendors.forEach(vendor => {
      if (hiddenCategories.some(hc => {
        const catConfig = getCategoryConfig(vendor.category)
        return catConfig.label === hc || catConfig.id === hc || vendor.category === hc
      })) return

      const coords = vendor.coords || [-4.325, 15.3222]
      const isSelected = vendor.id === selectedVendorId

      // Get category config for this vendor
      const catConfig = getCategoryConfig(vendor.category)

      // Prefer subcategory color if available; otherwise use category color
      const firstProduct = vendor.products?.[0]
      const subColor = firstProduct?.subcategoryId
        ? subcategoryService.getColor(firstProduct.subcategoryId)
        : null

      // Build the icon with subcategory color if available, else category config
      const iconConfig = subColor
        ? { ...catConfig, color: subColor, borderColor: subColor }
        : catConfig

      const icon = createLeafletIcon(iconConfig, isSelected)

      const marker = L.marker(coords, { icon })

      // Hover tooltip
      marker.on('mouseover', () => {
        if (tooltipRef.current) map.removeLayer(tooltipRef.current)
        const tip = L.tooltip({
          permanent: false,
          direction: 'top',
          offset: [0, -22],
          className: 'yengo-marker-tooltip'
        }).setContent(vendor.name)
        marker.bindTooltip(tip).openTooltip()
        tooltipRef.current = tip
>>>>>>> e66c1ea (Update app)
      })

      marker.on('mouseout', () => {
        if (tooltipRef.current) {
          map.removeLayer(tooltipRef.current)
          tooltipRef.current = null
        }
        marker.closeTooltip()
      })

<<<<<<< HEAD
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
=======
      // Click to open business drawer
      marker.on('click', () => {
        if (!vendor.coords) return

        // Fly to street level
        map.flyTo(vendor.coords, STREET_LEVEL_ZOOM, {
          animate: true,
          duration: 1.0
        })

        // Open the business drawer after a short delay
        setTimeout(() => {
          if (onBusinessSelectRef.current) {
            onBusinessSelectRef.current(vendor.id)
          }
        }, 500)
>>>>>>> e66c1ea (Update app)
      })

      marker.addTo(layer)
    })

    map.invalidateSize()

<<<<<<< HEAD
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

=======
    // Fit bounds to visible vendors (only if no target coordinate is set)
    const visibleVendors = vendors.filter(v => !hiddenCategories.some(hc => {
      const catConfig = getCategoryConfig(v.category)
      return catConfig.label === hc || catConfig.id === hc || v.category === hc
    }))
    const vendorsKey = visibleVendors
      .map(v => `${v.id}:${(v.coords || [-4.325, 15.3222]).join(',')}`)
      .join('|')

    if (visibleVendors.length > 0 && !targetCoordinate && !targetZoom && fittedVendorsKeyRef.current !== vendorsKey) {
      const bounds = L.latLngBounds(visibleVendors.map(v => v.coords || [-4.325, 15.3222]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 })
      fittedVendorsKeyRef.current = vendorsKey
    }
  }, [vendors, selectedVendorId, markersVisible, hiddenCategories, t, targetCoordinate, targetZoom])

  // Fly to target coordinate
  useEffect(() => {
    if (!targetCoordinate || !mapRef.current || drawerOpen) return
>>>>>>> e66c1ea (Update app)
    mapRef.current.flyTo(targetCoordinate, targetZoom || 14, {
      animate: true,
      duration: 1.5
    })
<<<<<<< HEAD
  }, [targetCoordinate, targetZoom])
=======
  }, [targetCoordinate, targetZoom, drawerOpen])
>>>>>>> e66c1ea (Update app)

  return (
    <div className="map-card" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {vendors.length === 0 && (
<<<<<<< HEAD
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
=======
        <div className="map-empty-notice">
          <p>{t('map.noBusinesses')}</p>
>>>>>>> e66c1ea (Update app)
        </div>
      )}
      <div
        id="react-map"
        className="map-canvas"
<<<<<<< HEAD
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}
=======
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
})

export default MapView
>>>>>>> e66c1ea (Update app)
