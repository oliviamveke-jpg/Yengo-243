<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';

/**
 * ProfileDropdown component for displaying user profile information and a dropdown menu.
 * 
 * @param {Object} props
 * @param {Object} props.user - The current logged-in user object.
 * @param {Function} props.onLogout - Callback function to handle logout.
 * @param {Function} props.onNavigate - Callback function to handle navigation to different sections.
 * @param {string} props.viewMode - Current application view mode.
 * @param {Function} props.setViewMode - Function to update the application view mode.
 */
export default function ProfileDropdown({ user, onLogout, onNavigate, viewMode, setViewMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
=======
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Store, Package, BarChart3, User, Heart, ShoppingBag,
  Settings, MapPin, Star, Bell, HelpCircle, LogOut
} from 'lucide-react'
import { useTranslation } from '../i18n/I18nProvider'

/**
 * ProfileDropdown — Role-based dynamic menu items.
 *
 * BUYER menu:  My Profile, Account Settings, Favorites, Orders, Saved Addresses,
 *              My Reviews, Notifications, Help, Logout
 * VENDOR menu: Dashboard, My Store, Products, Analytics, Profile, Settings,
 *              Notifications, Help (opener), Logout
 * ADMIN menu:  Dashboard + Logout (admin uses the admin-specific flow)
 */
export default function ProfileDropdown({ user, onLogout, onNavigate, viewMode, setViewMode, onOpenProfile }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getInitials = (name) => {
    if (!name) return '?'
>>>>>>> e66c1ea (Update app)
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
<<<<<<< HEAD
      .substring(0, 2);
  };

  const handleMenuItemClick = (item) => {
    setIsOpen(false);
    switch (item) {
      case 'Dashboard':
        setViewMode('dashboard');
        break;
      case 'Logout':
        onLogout();
        break;
      default:
        break;
    }
  };

  const avatarImage = user?.profilePicture || null;
  const initials = getInitials(user?.fullName);
=======
      .substring(0, 2)
  }

  const role = user?.role || 'buyer'

  /**
   * Menu item descriptors: { id, icon, labelKey, action }
   * Spec-defined menus:
   * - BUYER:  My Profile, Favorites, Orders, Notifications, Language, Help, Logout
   * - VENDEUR: My Profile, My Store, Orders, Notifications, Language, Help, Logout
   * - ADMIN:  Dashboard, Logout
   */
  const buyerMenuItems = [
    { id: 'profile',         icon: User,       labelKey: 'user.myProfile' },
    { id: 'favorites',       icon: Heart,       labelKey: 'user.favorites' },
    { id: 'orders',          icon: ShoppingBag, labelKey: 'user.orders' },
    { id: 'notifications',   icon: Bell,        labelKey: 'user.notifications' },
    { id: 'language',        icon: BarChart3,   labelKey: 'user.language' },
    { id: 'help',            icon: HelpCircle,  labelKey: 'user.help' },
  ]

  const vendorMenuItems = [
    { id: 'profile',         icon: User,            labelKey: 'user.myProfile' },
    { id: 'myStore',         icon: Store,           labelKey: 'user.myStore' },
    { id: 'orders',          icon: ShoppingBag,     labelKey: 'user.orders' },
    { id: 'notifications',   icon: Bell,            labelKey: 'user.notifications' },
    { id: 'language',        icon: BarChart3,       labelKey: 'user.language' },
    { id: 'help',            icon: HelpCircle,      labelKey: 'user.help' },
  ]

  const adminMenuItems = [
    { id: 'dashboard',       icon: LayoutDashboard, labelKey: 'user.dashboard' },
    { id: 'notifications',   icon: Bell,            labelKey: 'user.notifications' },
  ]

  let currentMenu
  if (role === 'vendor') {
    currentMenu = vendorMenuItems
  } else if (role === 'admin') {
    currentMenu = adminMenuItems
  } else {
    // buyer (default)
    currentMenu = buyerMenuItems
  }

  const handleItemClick = (itemId) => {
    setIsOpen(false)

    // Map menu item ids to app-level actions
    switch (itemId) {
      case 'profile':
        if (onOpenProfile) {
          onOpenProfile()
        }
        break
      case 'language':
        // Open language settings
        setViewMode('settingsPage')
        break
      case 'settings':
      case 'accountSettings':
        setViewMode('settingsPage')
        break
      case 'dashboard':
      case 'myStore':
        setViewMode('dashboard')
        break
      case 'products':
      case 'analytics':
        setViewMode('dashboard')
        break
      // Buyer-only items that don't have a full view yet can be surfaced
      // as future modals — for now they just close the menu.
      case 'favorites':
        // Only navigate if role is buyer (not vendor/admin)
        if (role === 'buyer') {
          setViewMode('favoritesPage')
        }
        break
      case 'orders':
      case 'savedAddresses':
      case 'myReviews':
      case 'notifications':
      case 'help':
        // Placeholder: close menu. In future these could open modals.
        break
      case 'logout':
        onLogout()
        break
      default:
        break
    }
  }

  const avatarImage = user?.profilePicture || null
  const initials = getInitials(user?.fullName)
>>>>>>> e66c1ea (Update app)

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button 
        className="profile-avatar-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
<<<<<<< HEAD
        aria-label="User profile menu"
=======
        aria-label={t('user.dashboard')}
>>>>>>> e66c1ea (Update app)
      >
        {avatarImage ? (
          <img src={avatarImage} alt={user?.fullName} className="profile-avatar-img" />
        ) : (
          <div className="profile-avatar-initials">{initials}</div>
        )}
      </button>

<<<<<<< HEAD
      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="dropdown-header">
            <p className="dropdown-user-name">{user?.fullName}</p>
            <p className="dropdown-user-role">{user?.role?.toUpperCase()}</p>
          </div>
          <div className="dropdown-divider"></div>
          <ul className="dropdown-list" role="menu">
            <li className="dropdown-item" role="menuitem" onClick={() => handleMenuItemClick('Dashboard')}>
              <span className="item-icon">📊</span> Dashboard
            </li>
            <div className="dropdown-divider"></div>
            <li className="dropdown-item logout" role="menuitem" onClick={() => handleMenuItemClick('Logout')}>
              <span className="item-icon">🚪</span> Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
=======
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="profile-dropdown-menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="dropdown-header">
              <p className="dropdown-user-name">{user?.fullName}</p>
              <p className="dropdown-user-role">{role.toUpperCase()}</p>
            </div>
            <div className="dropdown-divider"></div>
            <ul className="dropdown-list" role="menu">
              {currentMenu.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.id}
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <Icon size={16} />
                    {t(item.labelKey)}
                  </li>
                )
              })}
              <div className="dropdown-divider"></div>
              <li className="dropdown-item logout" role="menuitem" onClick={() => handleItemClick('logout')}>
                <LogOut size={16} />
                {t('user.logout')}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
>>>>>>> e66c1ea (Update app)
}
