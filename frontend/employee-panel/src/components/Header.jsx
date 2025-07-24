// src/components/Header.jsx
import React from 'react';
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className='div1'>
      <button className="header__toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className="header__brand">Employee Panel</div>
      </div>
      <div className="header__actions">
        <button className="header__icon-btn">
          <FaBell />
          {/* example badge */}
          <span className="header__badge">3</span>
        </button>
        <button className="header__icon-btn">
          <FaUserCircle />
          <span className="header__username">{user?.name || user?.email}</span>
        </button>
        <button className="header__icon-btn" onClick={logout}>
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Header;
