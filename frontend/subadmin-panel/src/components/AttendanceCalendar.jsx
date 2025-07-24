import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendanceService';
import './AttendanceCalendar.css';

const pad = (n) => String(n).padStart(2, '0');

export default function AttendanceCalendar({ employeeId }) {
  // State
  const [month, setMonth]       = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  });
  const [records, setRecords]   = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [leaveType, setLeaveType]       = useState('');

  // Fetch month’s attendance
  useEffect(() => {
    attendanceService
      .getMonth(employeeId, month)
      .then(setRecords)
      .catch(() => setRecords([]));
  }, [employeeId, month]);

  // Map for quick lookup
  const recMap = {};
  records.forEach(r => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    recMap[key] = r;
  });

  // Build calendar cells
  const [year, mon]    = month.split('-').map(Number);
  const firstDay      = new Date(year, mon-1, 1).getDay();
  const daysInMonth   = new Date(year, mon, 0).getDate();
  const cells         = Array(firstDay).fill(null)
                        .concat([...Array(daysInMonth)].map((_,i)=>`${year}-${pad(mon)}-${pad(i+1)}`));

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  })();

  // Handlers
  const handleDateClick = (dateStr) => {
    if (!dateStr) return;
    setSelectedDate(dateStr);
    setLeaveType('');
  };

  const handleMark = async (status, type=null) => {
    await attendanceService.markDay(employeeId, { date: selectedDate, status, leaveType: type });
    const updated = await attendanceService.getMonth(employeeId, month);
    setRecords(updated);
    setSelectedDate(null);
  };

  // Month navigation
  const go = (offset) => {
    const d = new Date(year, mon - 1 + offset, 1);
    setMonth(`${d.getFullYear()}-${pad(d.getMonth()+1)}`);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => go(-1)}>&lt;</button>
        <h2 className="calendar-month">
          {new Date(year, mon-1).toLocaleString(undefined, { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => go(+1)}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="calendar-day-label">{d}</div>
        ))}
        {cells.map((dateStr, i) => {
          const rec   = dateStr && recMap[dateStr];
          const cls   = dateStr
                        ? [
                            dateStr === todayStr && 'today',
                            rec?.status
                          ].filter(Boolean).join(' ')
                        : '';
          return (
            <div
              key={i}
              className={`day-cell ${cls}`}
              data-leavetype={rec?.leaveType || ''}
              onClick={() => handleDateClick(dateStr)}
            >
              {dateStr ? Number(dateStr.split('-')[2]) : ''}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="status-toolbar">
          <button onClick={() => handleMark('present')}>Present</button>
          <button onClick={() => handleMark('absent')}>Absent</button>
          <button onClick={() => handleMark('half_first')}>Half Day 1</button>
          <button onClick={() => handleMark('half_second')}>Half Day 2</button>

          <select
            value={leaveType}
            onChange={e => {
              const type = e.target.value;
              setLeaveType(type);
              if (type) handleMark('leave', type);
            }}
          >
            <option value="">Mark Leave…</option>
            <option value="sick">Sick</option>
            <option value="casual">Casual</option>
            <option value="other">Other</option>
          </select>

          <button className="cancel" onClick={() => setSelectedDate(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
