// src/components/ReportForm.jsx
import React from 'react';
import { Calendar, Clock, Edit2 } from 'lucide-react';
import './ReportForm.css';

/**
 * Displays the daily report submission form.
 * Props:
 *  • report: { date, workDetails, inTime, outTime }
 *  • onChange(event): handle all inputs
 *  • onSubmit(event): submit report
 *  • loading: boolean (disable submit)
 *  • error: string (display any error)
 */
const ReportForm = ({ report, onChange, onSubmit, loading, error }) => (
  <div className="report-form">
    <h1>Daily Report</h1>
    {error && <div className="error">{error}</div>}
    <form onSubmit={onSubmit}>
      <label>
        Data
        <div className="input-icon-wrapper">
          <Calendar className="icon" size={18}/>
          <input
            name="date"
            type="date"
            value={report.date}
            onChange={onChange}
            required
          />
        </div>
      </label>

      <label>
        Work Details
        <div className="input-icon-wrapper textarea-wrapper">
          <Edit2 className="icon" size={18}/>
          <textarea
            name="workDetails"
            value={report.workDetails}
            onChange={onChange}
            required
          />
        </div>
      </label>

      <label>
        In Time
        <div className="input-icon-wrapper">
          <Clock className="icon" size={18}/>
          <input
            name="inTime"
            type="time"
            value={report.inTime}
            onChange={onChange}
            required
          />
        </div>
      </label>

      <label>
        Out Time
        <div className="input-icon-wrapper">
          <Clock className="icon" size={18}/>
          <input
            name="outTime"
            type="time"
            value={report.outTime}
            onChange={onChange}
            required
          />
        </div>
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit Report'}
      </button>
    </form>
  </div>
);

export default ReportForm;
