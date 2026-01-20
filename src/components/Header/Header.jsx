import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, notifications } = useStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getInitials = () => {
    if (!user) return 'U';
    const name = user.name || user.email || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="app-header safe-area-top">
      <div className="header-content">
        <div className="header-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#008994" />
            <path
              d="M8 16L12 12L16 16L20 12L24 16"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 20L12 16L16 20L20 16L24 20"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          </svg>
          <span className="logo-text">MPWR</span>
        </div>

        <div className="header-actions">
          <button
            className="notification-btn"
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          <button
            className="avatar-btn"
            onClick={() => navigate('/profile')}
            aria-label="Profile"
          >
            <span className="avatar-initials">{getInitials()}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
