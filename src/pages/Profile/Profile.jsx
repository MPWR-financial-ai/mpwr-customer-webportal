import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useStore();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };
  const [showEditModal, setShowEditModal] = useState(false);

  const profileItems = [
    { label: 'Full Name', value: user?.name || 'John Doe', icon: 'user' },
    { label: 'Email', value: user?.email || 'john.doe@email.com', icon: 'mail' },
    { label: 'Phone', value: user?.phone || '(555) 123-4567', icon: 'phone' },
    { label: 'Address', value: user?.address || '123 Main St, City, ST 12345', icon: 'home' },
  ];

  const menuItems = [
    { label: 'Payment Methods', icon: 'credit-card', path: '/settings/payment-methods' },
    { label: 'Notifications', icon: 'bell', path: '/settings/notifications' },
    { label: 'Security', icon: 'shield', path: '/settings/security' },
    { label: 'Help & Support', icon: 'help', path: '/support' },
    { label: 'Terms & Privacy', icon: 'file-text', path: '/legal' },
  ];

  const getIcon = (iconName) => {
    const icons = {
      user: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      mail: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      phone: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      home: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      'credit-card': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      bell: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      shield: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      help: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      'file-text': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      logout: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  const getInitials = () => {
    const name = user?.name || 'John Doe';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      <div className="profile-card card">
        <div className="profile-avatar">
          <span className="avatar-initials">{getInitials()}</span>
        </div>
        <div className="profile-name">
          <h2>{user?.name || 'John Doe'}</h2>
          <span className="member-since">
            Member since {user?.memberSince
              ? new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : 'June 2025'}
          </span>
        </div>
        <button className="edit-profile-btn btn btn-secondary" onClick={() => setShowEditModal(true)}>
          Edit Profile
        </button>
      </div>

      <div className="profile-info card">
        <h3>Personal Information</h3>
        <div className="info-list">
          {profileItems.map((item) => (
            <div key={item.label} className="info-item">
              <span className="info-icon">{getIcon(item.icon)}</span>
              <div className="info-content">
                <span className="info-label">{item.label}</span>
                <span className="info-value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-menu card">
        {menuItems.map((item) => (
          <button key={item.label} className="menu-item">
            <span className="menu-icon">{getIcon(item.icon)}</span>
            <span className="menu-label">{item.label}</span>
            <svg className="menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>

      <button className="logout-btn btn btn-ghost" onClick={handleSignOut}>
        {getIcon('logout')}
        Sign Out
      </button>

      <div className="app-version">
        <span>MPWR Customer Portal v1.0.0</span>
      </div>
    </div>
  );
};

export default Profile;
