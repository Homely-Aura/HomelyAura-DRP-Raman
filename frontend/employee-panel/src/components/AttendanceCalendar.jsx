// src/components/AttendanceCalendar.jsx
import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendanceService';
import './AttendanceCalendar.css';

const pad = (n) => String(n).padStart(2, '0');

export default function AttendanceCalendar({ employeeId }) {
  const [month, setMonth]     = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  });
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!employeeId) return;
    attendanceService
      .getMonth(employeeId, month)
      .then(setRecords)
      .catch(() => setRecords([]));
  }, [employeeId, month]);

  // Build a map keyed by "YYYY-MM-DD"
  const recMap = {};
  records.forEach(r => {
    const iso = typeof r.date === 'string' ? r.date : r.date.toISOString();
    const key = iso.split('T')[0];    // "2025-07-01"
    recMap[key] = r;
  });

  const [year, mon]    = month.split('-').map(Number);
  const firstDay      = new Date(year, mon - 1, 1).getDay();
  const daysInMonth   = new Date(year, mon, 0).getDate();
  const blanks        = Array(firstDay).fill(null);
  const days          = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const cells         = [...blanks, ...days];

  const go = (offset) => {
    const d = new Date(year, mon - 1 + offset, 1);
    setMonth(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-inner">
        {/* Header with month navigation */}
        <div className="calendar-header">
          <button onClick={() => go(-1)}>&lsaquo;</button>
          <h2 className="calendar-month">
            {new Date(year, mon - 1).toLocaleString(undefined, {
              month: 'long', year: 'numeric'
            })}
          </h2>
          <button onClick={() => go(+1)}>&rsaquo;</button>
        </div>

        {/* Day‐of‐week labels + calendar grid */}
        <div className="calendar-grid">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="calendar-day-label">{d}</div>
          ))}

          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={idx} className="day-cell empty" />;
            }
            const dateStr = `${year}-${pad(mon)}-${pad(day)}`; // e.g. "2025-07-01"
            const rec     = recMap[dateStr];
            const status  = rec?.status?.toLowerCase();
            const cls     = ['present','absent','half_first','half_second','leave']
                              .includes(status) ? status : '';
            return (
              <div key={idx} className={`day-cell ${cls}`}>
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
