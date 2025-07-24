// frontend/admin-panel/src/components/ReportModal.jsx
import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import './ReportModal.css';

export default function ReportModal({ empId, date, onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      setError(null);
      try {
        const data = date
          ? await adminService.getEmployeeReportsByDate(empId, date)
          : await adminService.getEmployeeReports(empId);
        setReports(data);
      } catch (err) {
        console.error('Failed to load reports', err);
        setError('Could not load report history.');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [empId, date]);

  return (
    <div className="report-modal-overlay" role="dialog" aria-modal="true">
      <div className="report-modal-card">
        <button className="close-btn" onClick={onClose} aria-label="Close reports">
          ×
        </button>
        <h3>Report History{date ? ` on ${date}` : ''}</h3>

        {loading && <div className="loading">Loading reports…</div>}
        {error   && <div className="error">{error}</div>}

        {!loading && !error && (
          reports.length ? (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>In Time</th>
                  <th>Out Time</th>
                  <th>Duration (min)</th>
                  <th>Work Details</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r._id}>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.inTime ? new Date(r.inTime).toLocaleTimeString() : '—'}</td>
                    <td>{r.outTime ? new Date(r.outTime).toLocaleTimeString() : '—'}</td>
                    <td>{r.duration != null ? r.duration : '—'}</td>
                    <td>{r.workDetails}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-reports">
              No reports found{date ? ` for ${date}` : ''}.
            </div>
          )
        )}
      </div>
    </div>
  );
}
