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
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
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

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button 
        className="profile-avatar-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User profile menu"
      >
        {avatarImage ? (
          <img src={avatarImage} alt={user?.fullName} className="profile-avatar-img" />
        ) : (
          <div className="profile-avatar-initials">{initials}</div>
        )}
      </button>

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
}
