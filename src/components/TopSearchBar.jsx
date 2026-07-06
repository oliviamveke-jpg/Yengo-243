import React from 'react'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { useTranslation } from '../i18n/I18nProvider'

export default function TopSearchBar({ value, onChange, onFilterToggle, placeholder }) {
  const { t } = useTranslation()
  const ph = placeholder || t('search.placeholder')

  return (
    <motion.div
      className="search-bar-container"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="search-bar-wrapper">
        <span className="search-bar-icon">🔍</span>
        <input
          type="text"
          className="search-bar-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={ph}
        />
        <button
          className="search-bar-filter-btn"
          onClick={onFilterToggle}
          aria-label={t('search.filterResults')}
        >
          <Filter size={18} />
        </button>
      </div>
    </motion.div>
  )
}
