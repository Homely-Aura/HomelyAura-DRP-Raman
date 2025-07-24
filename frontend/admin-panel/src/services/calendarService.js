// frontend/admin-panel/src/services/calendarService.js
import api from './api';

const calendarService = {
  /**
   * Fetch both report entries and leave days for a given employee,
   * and merge them into a single array of calendar events.
   *
   * @param {string} empId  – The employee’s ID
   * @returns {Promise<Array<{id: string, title: string, date: string, type: string}>>}
   */
  getEvents: (empId) => {
    // Admin endpoint for reports and leaves
    const reportsReq = api.get(`/admin/employees/${empId}/reports`);
    const leavesReq  = api.get(`/admin/employees/${empId}/leaves`);

    return Promise.all([reportsReq, leavesReq])
      .then(([repRes, leaveRes]) => {
        const reportEvents = repRes.data.map(r => ({
          id:    r._id,
          title: `${r.user?.name || r.employeeName}: ${r.workDetails.slice(0, 20)}…`,
          date:  r.date,
          type:  'report',
        }));
        const leaveEvents = leaveRes.data.map(l => ({
          id:    l._id,
          title: 'Leave',
          date:  l.date,
          type:  'leave',
        }));
        // return combined events; you can sort if needed
        return [...reportEvents, ...leaveEvents];
      });
  }
};

export default calendarService;
