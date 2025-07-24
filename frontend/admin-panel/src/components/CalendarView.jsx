// frontend/admin-panel/src/components/CalendarView.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import calendarService from '../services/calendarService';
import './CalendarView.css';

export default function CalendarView({ empId, onDateClick, onClose }) {
  const [leaveDates, setLeaveDates] = useState([]);

  useEffect(() => {
    calendarService.getLeaves(empId)
      .then(res => {
        // assuming res.data = [{ date: '2025-07-01' }, …]
        const dates = res.data.map(l => new Date(l.date));
        setLeaveDates(dates);
      });
  }, [empId]);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isLeave = leaveDates.some(d =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
      return isLeave ? 'leave-day' : null;
    }
    return null;
  };

  return (
    <div className="cal-overlay">
      <div className="cal-card">
        <button className="close-btn" onClick={onClose}>×</button>
        <Calendar
          onClickDay={d => onDateClick(d.toISOString().split('T')[0])}
          tileClassName={tileClassName}
        />
      </div>
    </div>
  );
}
