import React from 'react'
import { useTranslation } from '../i18n/I18nProvider'

export default function ResultsToggle({ value, onChange, options = [] }) {
  const { t } = useTranslation()

  const items = options.length > 0 ? options : [
    { key: 'products', label: t('market.products') },
    { key: 'vendors', label: t('market.vendors') }
  ]

  return (
    <div className="results-toggle-brutal">
      {items.map((item) => {
        const active = value === item.key
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={active ? 'active' : ''}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
