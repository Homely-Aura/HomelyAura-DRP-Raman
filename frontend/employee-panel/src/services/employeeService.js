import api from './api';

/**
 * Employee‐specific endpoints:
 *  • GET  /employee/profile     → fetch this user’s profile
 *  • POST /employee/profile     → create or update profile (with photo upload)
 *  • POST /report               → submit a new daily report
 *  • GET  /report/my            → fetch this user’s reports
 *  • GET  /employee/tasks       → fetch today’s assigned tasks
 */
const employeeService = {
  getProfile: () =>
    api.get('/employee/profile').then(res => res.data),

  saveProfile: formData =>
    api.post('/employee/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),

  submitReport: reportData =>
    api.post('/report', reportData).then(res => res.data),

  getMyReports: () =>
    api.get('/report/my').then(res => res.data),

  // ← NEW
  getTasks: () =>
    api.get('/employee/tasks').then(res => res.data),
};

export default employeeService;
