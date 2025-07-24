// src/pages/ReportHistory.jsx

import React, { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import { handleApiError } from '../utils/helpers';
import './ReportHistory.css';

export default function ReportHistory() {
  const [reports, setReports]   = useState([]);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getMyReports();
        setReports(data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Format "2025-07-22" → "22 Jul 2025"
  const formatDate = isoDate => {
    const d = new Date(isoDate);
    if (isNaN(d)) return isoDate; 
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  };

  // Format "09:30" or "9:30:00" → "9:30 AM"
  const formatTime = timeStr => {
    if (!timeStr) return '';
    // split off hours and minutes
    const [h, m] = timeStr.split(':');
    const hour   = parseInt(h, 10);
    const minute = parseInt(m, 10);
    if (isNaN(hour) || isNaN(minute)) return timeStr;
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return new Intl.DateTimeFormat('en-IN', {
      hour:   'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (loading) return <p className="loading">Loading your report history…</p>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="report-history-container">
      <h1>Report History</h1>

      {reports.length === 0 ? (
        <p className="no-reports">You haven’t submitted any reports yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Work Details</th>
                <th>In Time</th>
                <th>Out Time</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r._id}>
                  <td>{formatDate(r.date)}</td>
                  <td>{r.workDetails}</td>
                  <td>{formatTime(r.inTime)}</td>
                  <td>{formatTime(r.outTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
