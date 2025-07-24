// src/pages/ReportSubmit.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightCircle, User as UserIcon } from 'lucide-react';
import employeeService from '../services/employeeService';
import { handleApiError } from '../utils/helpers';
import './ReportSubmit.css';

export default function ReportSubmit() {
  const [user, setUser] = useState(null);
  // Three motivational lines to rotate through
  const [quotes, setQuotes] = useState([
    'Make today count!',
    'Keep pushing your limits!',
    'Success starts with self-discipline!',
  ]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [report, setReport] = useState({
    date: new Date().toISOString().split('T')[0],
    workDetails: '',
    inTime: '',
    outTime: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const firstInputRef = useRef(null);
  const navigate      = useNavigate();

  // Fetch profile + apply image fix
  useEffect(() => {
    employeeService
      .getProfile()
      .then(data => {
        const prof = data.profile || data;
        setUser(prof);
        // if backend gives a dailyQuote, use it as first line
        setQuotes([
          prof.dailyQuote || quotes[0],
          quotes[1],
          quotes[2],
        ]);
      })
      .catch(() => {
        // fallback if the call fails
        setUser({ photo: null, name: '' });
      });
  }, []);

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const iv = setInterval(() => {
      setQuoteIndex(i => (i + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(iv);
  }, [quotes]);

  const handleChange = e => {
    const { name, value } = e.target;
    setReport(r => ({ ...r, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await employeeService.submitReport(report);
      navigate('/history');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // or spinner

  return (
    <div className="report-submit-container">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <h2 className='userName'>Hey, {user.name}</h2>
        {user.photo ? (
          <img
            className="avatar"
            src={user.photo}
            alt={user.name || 'avatar'}
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="avatar placeholder">
            <UserIcon size={36} />
          </div>
        )}

        {/* removed the “Let’s get you set up” heading */}

        <p className="quote">{quotes[quoteIndex]}</p>
        <button
          type="button"
          className="start-btn"
          onClick={() => firstInputRef.current?.focus()}
        >
          <ArrowRightCircle size={32} />
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h1>Daily Report</h1>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Date
            <input
              ref={firstInputRef}
              name="date"
              type="date"
              value={report.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Work Details
            <textarea
              name="workDetails"
              value={report.workDetails}
              onChange={handleChange}
              placeholder="What did you accomplish today?"
              required
            />
          </label>

          <div className="time-row">
            <label>
              In Time
              <input
                name="inTime"
                type="time"
                value={report.inTime}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Out Time
              <input
                name="outTime"
                type="time"
                value={report.outTime}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
