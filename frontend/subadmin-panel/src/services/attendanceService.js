// src/services/attendanceService.js

import api from './api';

const attendanceService = {
  getMonth: (employeeId, month) =>
    api.get(`/attendance/${employeeId}?month=${month}`).then(res => res.data),

  markDay: (employeeId, payload) =>
    api.post(`/attendance/${employeeId}`, payload).then(res => res.data),
};

export default attendanceService;
