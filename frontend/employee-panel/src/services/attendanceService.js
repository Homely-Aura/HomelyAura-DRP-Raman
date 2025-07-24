// src/services/attendanceService.js
import api from './api';

const attendanceService = {
  // Fetch all attendance records for the given employee & month
  getMonth: (employeeId, month) =>
    api
      .get(`/attendance/${employeeId}?month=${month}`)
      .then(res => res.data),
};

export default attendanceService;
