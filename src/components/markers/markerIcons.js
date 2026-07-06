/**
 * Yengo+243 Modern Marker Icons
 *
 * Generates clean, modern circular SVG markers with:
 * - White background
 * - Colored border based on category
 * - Category emoji centered inside
 * - Soft shadow
 *
 * Uses L.divIcon with bottom-center iconAnchor to prevent zoom drift.
 * No CSS transforms on the marker container — Leaflet handles all positioning.
 */

import L from 'leaflet'

const ICON_SIZE = 36 // outer diameter in px
const INNER_SIZE = 28 // inner circle diameter
const BORDER_WIDTH = 3

/**
 * Build an inline SVG data URI for a single marker pin.
 *
 * @param {string} emoji - The category emoji character
 * @param {string} color - Hex border color (e.g. '#EF4444')
 * @param {boolean} selected - Whether this marker is selected (larger + glow)
 * @returns {string} A data-URI SVG string
 */
export function createMarkerIcon(emoji, color, selected = false) {
  const size = selected ? ICON_SIZE + 8 : ICON_SIZE
  const inner = selected ? INNER_SIZE + 6 : INNER_SIZE
  const borderW = selected ? BORDER_WIDTH + 1 : BORDER_WIDTH
  const radius = size / 2
  const innerR = inner / 2
  const center = radius

  const shadowFilter = selected
    ? `<filter id="s" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="${color}" flood-opacity="0.5"/>
       </filter>`
    : `<filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
       </filter>`

  // Scale emoji for selected state
  const fontSize = selected ? Math.round((inner - 4) * 0.65) : Math.round((inner - 4) * 0.6)

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `<defs>${shadowFilter}</defs>`,
    // White circle with shadow
    `<circle cx="${center}" cy="${center}" r="${radius - 1}" fill="#FFFFFF" filter="url(#s)"/>`,
    // Colored border circle (3px wide)
    `<circle cx="${center}" cy="${center}" r="${innerR + borderW - 1}" fill="none" stroke="${color}" stroke-width="${borderW}"/>`,
    // Inner white fill
    `<circle cx="${center}" cy="${center}" r="${innerR - 1}" fill="#FFFFFF"/>`,
    // Emoji centered using dy (universally supported, unlike dominant-baseline)
    `<text x="${center}" y="${center}" text-anchor="middle" dy=".35em" font-size="${fontSize}">${emoji}</text>`,
    `</svg>`
  ].join('')

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

/**
 * Create a Leaflet-compatible L.divIcon from a category config.
 *
 * CRITICAL: iconAnchor must be bottom-center [size/2, size]
 * so the marker stays locked to the exact lat/lng point at all zoom levels.
 *
 * @param {object} config - The category config from categoryConfig.js
 * @param {boolean} selected - Whether this marker is selected
 * @returns {import('leaflet').DivIcon} Leaflet DivIcon instance
 */
export function createLeafletIcon(config, selected = false) {
  const size = selected ? ICON_SIZE + 8 : ICON_SIZE
  const src = createMarkerIcon(config.icon, config.color, selected)

  // Bottom-center anchor: marker tip is at lat/lng
  return L.divIcon({
    className: 'yengo-modern-marker',
    html: `<img src="${src}" alt="" style="width:${size}px;height:${size}px;" />`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],   // bottom-center
    popupAnchor: [0, -size - 4]
  })
}

/**
 * Size constants for external use (e.g., calculating popup offsets)
 */
export const MARKER_SIZES = {
  default: ICON_SIZE,
  selected: ICON_SIZE + 8,
  cluster: 44
}
