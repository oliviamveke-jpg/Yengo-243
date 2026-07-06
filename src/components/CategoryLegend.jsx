/**
 * Yengo+243 Category Legend
 *
 * Displays all business categories with their icon and color.
 * Driven entirely by the centralized categoryConfig, so it
 * stays in sync with markers.
 */

import React from 'react'
import { getAllCategoryConfigs, getCategoryConfig } from '../data/categoryConfig'
import { useTranslation } from '../i18n/I18nProvider'

/**
 * Category Legend component.
 *
 * @param {object} props
 * @param {Array<string>} [props.availableCategories] - If provided, only show
 *   these categories (by name). Otherwise shows all from config.
 * @param {Array<string>} props.hiddenCategories - Categories currently hidden
 * @param {Function} props.onToggleCategory - Called with category name
 */
export default function CategoryLegend({
  availableCategories,
  hiddenCategories = [],
  onToggleCategory
}) {
  const { t } = useTranslation()

  // Determine which configs to display
  const allConfigs = getAllCategoryConfigs(false)
  const configs = availableCategories && availableCategories.length > 0
    ? allConfigs.filter(c =>
        availableCategories.some(
          name => getCategoryConfig(name).id === c.id
        )
      )
    : allConfigs

  if (configs.length === 0) return null

  return (
    <div className="yengo-category-legend">
      <div className="yengo-legend-title">
        {t('map.categories', 'Categories')}
      </div>
      <div className="yengo-legend-items">
        {configs.map(config => {
          const isHidden = hiddenCategories.includes(config.label)
          return (
            <label
              key={config.id}
              className={`yengo-legend-item ${isHidden ? 'hidden' : ''}`}
            >
              <input
                type="checkbox"
                checked={!isHidden}
                onChange={() => {
                  if (onToggleCategory) onToggleCategory(config.label)
                }}
              />
              <span
                className="yengo-legend-marker"
                style={{
                  background: config.backgroundColor,
                  borderColor: config.color
                }}
              >
                <span className="yengo-legend-icon">{config.icon}</span>
              </span>
              <span className="yengo-legend-label">{config.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Inline legend chip — useful inside bottom sheets or popups
 * to show a single category with its icon.
 */
export function CategoryChip({ categoryName }) {
  const config = getCategoryConfig(categoryName)
  return (
    <span
      className="yengo-category-chip"
      style={{
        background: config.backgroundColor,
        border: `1.5px solid ${config.color}`
      }}
    >
      <span className="yengo-chip-icon">{config.icon}</span>
      <span className="yengo-chip-label">{config.label}</span>
    </span>
  )
}
