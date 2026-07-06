import React from 'react'
import { useTranslation } from '../i18n/I18nProvider'

export default function FilterRow({
  filters,
  onFilterChange,
  provinces = [],
  communes = [],
  quartiers = [],
  streets = []
}) {
  const { t } = useTranslation()

  return (
    <div className="filters-row">
      <select
        className="filter-select"
        value={filters.province || ''}
        onChange={(e) => onFilterChange('province', e.target.value)}
      >
        <option value="">{t('filter.province')}</option>
        {provinces.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters.commune || ''}
        onChange={(e) => onFilterChange('commune', e.target.value)}
      >
        <option value="">{t('filter.commune')}</option>
        {communes.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters.quartier || ''}
        onChange={(e) => onFilterChange('quartier', e.target.value)}
      >
        <option value="">{t('filter.quartier')}</option>
        {quartiers.map((q) => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>

      <input
        className="filter-select filter-input"
        type="text"
        value={filters.street || ''}
        onChange={(e) => onFilterChange('street', e.target.value)}
        placeholder={t('filter.street')}
      />
    </div>
  )
}
