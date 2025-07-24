import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaUserCircle,
  FaPlusSquare,
  FaHistory,
  FaTasks
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => (
  <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
    <h2 className="sidebar__title">HomelyAuraDRP</h2>
    <nav className="sidebar__nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? 'sidebar__link active' : 'sidebar__link'
        }
      >
        <FaUserCircle className="sidebar__icon" />
        <span>Profile</span>
      </NavLink>

      <NavLink
        to="/submit"
        className={({ isActive }) =>
          isActive ? 'sidebar__link active' : 'sidebar__link'
        }
      >
        <FaPlusSquare className="sidebar__icon" />
        <span>Submit Report</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          isActive ? 'sidebar__link active' : 'sidebar__link'
        }
      >
        <FaHistory className="sidebar__icon" />
        <span>Report History</span>
      </NavLink>

    </nav>
  </aside>
);

export default Sidebar;
