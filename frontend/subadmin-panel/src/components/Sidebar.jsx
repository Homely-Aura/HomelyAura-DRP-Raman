import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaChartBar,
  FaCalendarCheck,
  FaTasks
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ collapsed }) => (
  <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
    <nav className="sidebar__nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `sidebar__link${isActive ? ' active' : ''}`
        }
      >
        <FaTachometerAlt className="sidebar__icon" />
        Dashboard
      </NavLink>
      <NavLink
        to="/reports"
        className={({ isActive }) =>
          `sidebar__link${isActive ? ' active' : ''}`
        }
      >
        <FaChartBar className="sidebar__icon" />
        Report Viewer
      </NavLink>
      <NavLink
        to="/attendance"
        className={({ isActive }) =>
          `sidebar__link${isActive ? ' active' : ''}`
        }
      >
        <FaCalendarCheck className="sidebar__icon" />
        Attendance
      </NavLink>
      <NavLink
        to="/tasks"
        className={({ isActive }) =>
          `sidebar__link${isActive ? ' active' : ''}`
        }
      >
        <FaTasks className="sidebar__icon" />
        Assign Tasks
      </NavLink>
    </nav>
  </aside>
);

export default Sidebar;
