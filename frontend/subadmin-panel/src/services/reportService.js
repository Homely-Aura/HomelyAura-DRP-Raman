// TODO: service
import api from './api';

/**
 * Service for Report endpoints:
 *  • POST   /report          → create a new report
 *  • GET    /report/my       → get reports for current user
 *  • GET    /report          → get all reports (can filter by employeeId)
 *  • PATCH  /report/:id      → update a report
 */
const reportService = {
  createReport: reportData =>
    api.post('/report', reportData).then(res => res.data),

  getMyReports: () =>
    api.get('/report/my').then(res => res.data),

  getAllReports: filter =>
    api
      .get('/report', { params: filter })
      .then(res => res.data),

  updateReport: (id, updateData) =>
    api.patch(`/report/${id}`, updateData).then(res => res.data),
};

export default reportService;
