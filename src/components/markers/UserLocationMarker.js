/**
 * Yengo+243 User Location Marker
 *
 * Modern blue circle with white outline and pulsing ripple animation.
 * Uses L.divIcon with bottom-center iconAnchor to prevent zoom drift.
 */

/**
 * Create a Leaflet DivIcon for the user's current location.
 *
 * Returns a data-URI SVG that renders as:
 * - Outer pulsing ripple circle (animated via CSS)
 * - Solid blue circle
 * - White inner dot
 *
 * @returns {import('leaflet').DivIcon}
 */
export function createUserLocationIcon() {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">`,
    // Ripple ring (CSS animation handled by .yengo-user-location-pulse class)
    `<circle cx="24" cy="24" r="22" fill="none" stroke="#3B82F6" stroke-width="2" opacity="0.3" class="yengo-loc-ring"/>`,
    // Solid blue outer circle
    `<circle cx="24" cy="24" r="12" fill="#3B82F6" stroke="#FFFFFF" stroke-width="3"/>`,
    // White inner dot
    `<circle cx="24" cy="24" r="4" fill="#FFFFFF"/>`,
    `</svg>`
  ].join('')

  // Bottom-center anchor: the bottom of the 48px icon is the exact location point
  return L.divIcon({
    className: 'yengo-user-location-marker',
    html: `<img src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}" alt="You are here" style="width:48px;height:48px;" />`,
    iconSize: [48, 48],
    iconAnchor: [24, 48]  // bottom-center — fixes zoom drift
  })
}
