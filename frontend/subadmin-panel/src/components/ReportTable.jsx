import React, { useState, useEffect } from 'react';
import reportService from '../services/reportService';
import { handleApiError } from '../utils/helpers';
import {
  MdDateRange,
  MdDescription,
  MdLogin,
  MdLogout,
  MdTimer
} from 'react-icons/md';
import './ReportTable.css';

const ReportTable = ({ employeeId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await reportService.getAllReports({ employeeId });
        setReports(data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [employeeId]);

  if (loading) return <p className="rt-message">Loading reports…</p>;
  if (error)   return <p className="rt-error">{error}</p>;
  if (!reports.length) return <p className="rt-message">No reports found.</p>;

  return (
    <div className="rt-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th><MdDateRange className="rt-icon" /> Date</th>
            <th><MdDescription className="rt-icon" /> Details</th>
            <th><MdLogin className="rt-icon" /> In</th>
            <th><MdLogout className="rt-icon" /> Out</th>
            <th><MdTimer className="rt-icon" /> Dur (min)</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r._id}>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>{r.workDetails}</td>
              <td>
                {new Date(r.inTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td>
                {new Date(r.outTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td>{r.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
