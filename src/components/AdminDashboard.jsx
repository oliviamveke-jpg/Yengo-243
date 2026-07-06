import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Users, Star, BarChart3, Megaphone, CheckCircle, XCircle, Award,
  Trash2, Mail, User, Clock, TrendingUp, Activity, AlertCircle, ChevronLeft,
  Search, Filter, Send, Eye, ThumbsUp, Ban, ExternalLink, Layers, Edit3,
  Palette, Merge, Hash
} from 'lucide-react'
import { adminService } from '../services/adminService'
import { subcategoryService } from '../services/subcategoryService'
import { pickColor } from '../data/subcategoryColors'
import { useTranslation } from '../i18n/I18nProvider'

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.15, ease: 'easeIn' } }
}

export default function AdminDashboard({ setViewMode }) {
  const { t } = useTranslation()
  const [pendingVendors, setPendingVendors] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [announcement, setAnnouncement] = useState({ title: '', message: '' })
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    setPendingVendors(adminService.getPendingVendors())
    setUsers(adminService.getUsers())
    setReviews(adminService.getAllReviews())
    setAnalytics(adminService.getPlatformAnalytics())
  }, [])

  const refresh = () => {
    setPendingVendors(adminService.getPendingVendors())
    setUsers(adminService.getUsers())
    setReviews(adminService.getAllReviews())
    setAnalytics(adminService.getPlatformAnalytics())
  }

  const approve = (id) => {
    adminService.approveVendor(id)
    refresh()
  }

  const suspend = (id) => {
    adminService.suspendVendor(id)
    refresh()
  }

  const feature = (id) => {
    adminService.featureVendor(id)
    refresh()
  }

  const removeReview = (id) => {
    adminService.removeReview(id)
    refresh()
  }

  const sendAnnouncement = () => {
    if (!announcement.title || !announcement.message) return
    adminService.sendAnnouncement(announcement)
    setAnnouncement({ title: '', message: '' })
  }

  const [subcatSearch, setSubcatSearch] = useState('')
  const [subcatEditId, setSubcatEditId] = useState(null)
  const [subcatEditName, setSubcatEditName] = useState('')
  const [subcatPickColor, setSubcatPickColor] = useState('')

  const tabs = [
    { id: 'overview', labelKey: 'admin.overview', icon: Activity },
    { id: 'vendors', labelKey: 'admin.pendingVendors', icon: Users },
    { id: 'users', labelKey: 'admin.users', icon: User },
    { id: 'reviews', labelKey: 'admin.reviews', icon: Star },
    { id: 'subcategories', labelKey: 'admin.subcategories', icon: Layers },
    { id: 'announcement', labelKey: 'admin.announcement', icon: Megaphone }
  ]

  const analyticsCards = analytics ? [
    { icon: Users, labelKey: 'admin.totalVendors', value: analytics.totalVendors, color: '#2563EB' },
    { icon: User, labelKey: 'admin.totalUsers', value: analytics.totalUsers, color: '#10b981' },
    { icon: Star, labelKey: 'admin.totalReviews', value: analytics.totalReviews, color: '#8b5cf6' },
    { icon: TrendingUp, labelKey: 'admin.avgRating', value: analytics.avgRating.toFixed(2), color: '#f59e0b' }
  ] : []

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <motion.div key="overview" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <section>
              <h3>{t('dashboard.platformAnalytics')}</h3>
              {analytics ? (
                <div className="dashboard-metrics-grid">
                  {analyticsCards.map((card, i) => (
                    <div key={i} className="dashboard-metric-card">
                      <div className="metric-icon" style={{ color: card.color }}>
                        <card.icon size={20} />
                      </div>
                      <div className="metric-content">
                        <h4>{t(card.labelKey)}</h4>
                        <p className="metric-value">{card.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>{t('dashboard.loadingAnalytics')}</p>
              )}
            </section>
          </motion.div>
        )

      case 'vendors':
        return (
          <motion.div key="vendors" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <section>
              <h3>{t('admin.pendingVendors')}</h3>
              {pendingVendors.length === 0 ? (
                <div className="dashboard-empty-state">
                  <CheckCircle size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <p>{t('admin.noPending')}</p>
                </div>
              ) : (
                <ul>
                  {pendingVendors.map(v => (
                    <li key={v.id}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong>{v.name}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 8 }}>
                          <Mail size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                          {v.ownerId}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button className="btn btn-sm btn-primary" onClick={() => approve(v.id)}>
                          <ThumbsUp size={12} /> {t('general.approve')}
                        </button>
                        <button className="btn btn-sm" style={{ color: '#ef4444', borderColor: '#fecaca' }} onClick={() => suspend(v.id)}>
                          <Ban size={12} /> {t('general.suspend')}
                        </button>
                        <button className="btn btn-sm" style={{ color: '#8b5cf6', borderColor: '#ddd6fe' }} onClick={() => feature(v.id)}>
                          <Award size={12} /> {t('general.feature')}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </motion.div>
        )

      case 'users':
        return (
          <motion.div key="users" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <section>
              <h3>{t('admin.users')}</h3>
              {users.length === 0 ? (
                <div className="dashboard-empty-state">
                  <User size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <p>{t('admin.noUsers')}</p>
                </div>
              ) : (
                <ul>
                  {users.map(u => (
                    <li key={u.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', background: 'var(--bg)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0
                        }}>
                          {(u.fullName || u.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem', display: 'block' }}>
                            {u.fullName || u.email}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            {u.email}
                          </span>
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700,
                        background: u.role === 'vendor' ? 'rgba(37,99,235,0.1)' : 'rgba(16,185,129,0.1)',
                        color: u.role === 'vendor' ? '#2563EB' : '#10b981',
                        textTransform: 'uppercase', letterSpacing: '0.3px', flexShrink: 0
                      }}>
                        {u.role}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </motion.div>
        )

      case 'reviews':
        return (
          <motion.div key="reviews" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <section>
              <h3>{t('admin.reviews')}</h3>
              {reviews.length === 0 ? (
                <div className="dashboard-empty-state">
                  <Star size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <p>{t('admin.noReviews')}</p>
                </div>
              ) : (
                <ul>
                  {reviews.map(r => (
                    <li key={r.id}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ color: 'var(--text)' }}>{r.vendorId}</strong>
                        <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          "{r.text || r.reviewComment}"
                        </p>
                        {r.rating && (
                          <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                            {'⭐'.repeat(r.rating)}
                          </span>
                        )}
                      </div>
                      <button className="btn btn-sm" style={{ color: '#ef4444', borderColor: '#fecaca', flexShrink: 0 }} onClick={() => removeReview(r.id)}>
                        <Trash2 size={12} /> {t('general.remove')}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </motion.div>
        )

      case 'announcement':
        return (
          <motion.div key="announcement" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <section>
              <h3>{t('admin.announcement')}</h3>
              <input
                placeholder={t('admin.announcementTitle')}
                value={announcement.title}
                onChange={(e) => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              />
              <textarea
                placeholder={t('admin.announcementMessage')}
                value={announcement.message}
                onChange={(e) => setAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
              <button className="btn btn-primary" onClick={sendAnnouncement}>
                <Send size={16} /> {t('admin.send')}
              </button>
            </section>
          </motion.div>
        )

      case 'subcategories':
        return (
          <motion.div key="subcategories" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <section>
              <h3><Layers size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />{t('admin.manageSubcategories')}</h3>
              <input
                placeholder={t('admin.searchSubcategories')}
                value={subcatSearch}
                onChange={(e) => setSubcatSearch(e.target.value)}
                style={{ marginBottom: 16 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(() => {
                  const all = subcategoryService.getAll()
                  const q = subcatSearch.trim().toLowerCase()
                  const filtered = q ? all.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) : all
                  const grouped = {}
                  for (const s of filtered) {
                    if (!grouped[s.category]) grouped[s.category] = []
                    grouped[s.category].push(s)
                  }
                  return Object.entries(grouped).length === 0
                    ? <div className="dashboard-empty-state"><Layers size={40} style={{ marginBottom: 12, opacity: 0.3 }} /><p>{t('admin.noSubcategories')}</p></div>
                    : Object.entries(grouped).sort().map(([category, items]) => (
                        <div key={category}>
                          <h4 style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, margin: '12px 0 6px' }}>{category}</h4>
                          {items.map(sc => {
                            const isEditing = subcatEditId === sc.id
                            return (
                              <div key={sc.id} style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                                border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)',
                                marginBottom: 4
                              }}>
                                <span style={{ width: 14, height: 14, borderRadius: '50%', background: sc.markerColor || '#6b7280', flexShrink: 0, display: 'inline-block' }} />
                                {isEditing ? (
                                  <input
                                    value={subcatEditName}
                                    onChange={(e) => setSubcatEditName(e.target.value)}
                                    style={{ flex: 1, padding: '4px 8px', fontSize: '0.85rem', borderRadius: 4, border: '1px solid var(--primary)' }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        subcategoryService.rename(sc.id, subcatEditName)
                                        setSubcatEditId(null)
                                        setSubcatEditName('')
                                      }
                                      if (e.key === 'Escape') { setSubcatEditId(null); setSubcatEditName('') }
                                    }}
                                  />
                                ) : (
                                  <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text)' }}>{sc.name}</span>
                                )}
                                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                  {isEditing ? (
                                    <button className="btn btn-sm btn-primary" style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                                      onClick={() => { subcategoryService.rename(sc.id, subcatEditName); setSubcatEditId(null) }}>
                                      {t('general.save')}
                                    </button>
                                  ) : (
                                    <button className="btn btn-sm" style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                                      onClick={() => { setSubcatEditId(sc.id); setSubcatEditName(sc.name) }}>
                                      <Edit3 size={12} />
                                    </button>
                                  )}
                                  <button className="btn btn-sm" style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                                    onClick={() => {
                                      const newColor = prompt('Enter a new marker color (hex):', sc.markerColor)
                                      if (newColor && /^#[0-9a-f]{6}$/i.test(newColor.trim())) {
                                        subcategoryService.setColor(sc.id, newColor.trim())
                                        setActiveSection('subcategories')
                                      }
                                    }}>
                                    <Palette size={12} />
                                  </button>
                                  <button className="btn btn-sm" style={{ fontSize: '0.7rem', padding: '2px 8px', color: '#ef4444' }}
                                    onClick={() => {
                                      if (confirm(`Delete "${sc.name}"? This action is permanent.`)) {
                                        subcategoryService.delete(sc.id)
                                        setActiveSection('overview')
                                        setTimeout(() => setActiveSection('subcategories'), 50)
                                      }
                                    }}>
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ))
                })()}
              </div>
            </section>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="dashboard-admin">
      <header>
        <h2>
          <Shield size={24} style={{ color: 'var(--primary)', verticalAlign: 'middle', marginRight: 8 }} />
          {t('admin.title')}
        </h2>
        <button className="btn btn-sm btn-ghost" onClick={() => setViewMode('marketplace')}>
          <ChevronLeft size={16} /> {t('admin.backToMarketplace')}
        </button>
      </header>

      <div className="dashboard-tabs-pill">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`dashboard-tab-pill ${activeSection === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSection(tab.id)}
            >
              <Icon size={16} />
              <span>{t(tab.labelKey)}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {renderSection()}
      </AnimatePresence>
    </div>
  )
}
