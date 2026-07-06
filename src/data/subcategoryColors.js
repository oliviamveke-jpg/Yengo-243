// Yengo+243 Subcategory Color Palette
// 40 high-contrast, map-friendly colors.
// When a new subcategory is created, assign the first unused color from this palette.
// Colors never change once assigned.

export const SUBCATEGORY_COLORS = [
  '#e74c3c', // Red
  '#f39c12', // Orange
  '#f1c40f', // Yellow
  '#2ecc71', // Green
  '#1abc9c', // Teal
  '#3498db', // Blue
  '#9b59b6', // Purple
  '#e91e63', // Pink
  '#795548', // Brown
  '#607d8b', // Blue Grey
  '#ff5722', // Deep Orange
  '#4caf50', // Light Green
  '#00bcd4', // Cyan
  '#673ab7', // Deep Purple
  '#8bc34a', // Lime
  '#ff9800', // Amber
  '#03a9f4', // Light Blue
  '#e040fb', // Magenta
  '#009688', // Dark Teal
  '#ff6f00', // Dark Amber
  '#c62828', // Dark Red
  '#283593', // Indigo
  '#2e7d32', // Dark Green
  '#00695c', // Pine
  '#6a1b9a', // Dark Purple
  '#ef6c00', // Dark Orange
  '#00838f', // Dark Cyan
  '#4e342e', // Dark Brown
  '#37474f', // Charcoal
  '#ad1457', // Berry
  '#0d47a1', // Navy
  '#1b5e20', // Forest
  '#bf360c', // Rust
  '#4a148c', // Plum
  '#01579b', // Deep Blue
  '#33691e', // Olive
  '#880e4f', // Wine
  '#004d40', // Dark Pine
  '#3e2723', // Espresso
  '#263238', // Dark Charcoal
]

/**
 * Pick the first unused color from the palette for the given set of already-assigned colors.
 * If the palette is exhausted, generate a new distinct color using HSL spacing.
 */
export function pickColor(existingColors) {
  const used = new Set(existingColors || [])
  const palette = SUBCATEGORY_COLORS

  for (const color of palette) {
    if (!used.has(color)) return color
  }

  // Palette exhausted — generate a new color via golden-angle HSL spacing
  const baseHue = (existingColors.length * 137.508) % 360 // golden angle
  return `hsl(${baseHue}, 72%, 58%)`
}
