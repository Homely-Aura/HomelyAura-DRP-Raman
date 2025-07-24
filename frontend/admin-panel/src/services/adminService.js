import api from './api';

const adminService = {
  // ─── Employees ───────────────────────────────────────

  /**
   * Fetch all employee users, then fetch each employee’s full profile.
   * If a profile request 404s, fall back to a minimal user-only object.
   */
  getEmployeesWithProfile: async () => {
    const users = await api.get('/employees').then(res => res.data);

    const profiles = await Promise.all(
      users.map(async u => {
        try {
          return await api.get(`/employees/${u._id}`).then(res => res.data);
        } catch {
          console.warn(`No profile for user ${u._id}, using fallback.`);
          return {
            _id: u._id,
            user: { name: u.name, email: u.email },
            designation: '',
            photo: '',
            age: null,
            gender: null,
            dateOfJoining: null,
            subAdmin: null,
          };
        }
      })
    );

    return profiles;
  },

  /** List of employee users (no profile fields) */
  getEmployees: () =>
    api.get('/employees').then(res => res.data),

  /** Single employee detail (for EmployeeDetailModal) */
  getEmployee: id =>
    api.get(`/employees/${id}`).then(res => res.data),

  // ─── Sub-Admins ─────────────────────────────────────

  /** List all sub-admins */
  getSubAdmins: () =>
    api.get('/subadmins').then(res => res.data),

  /** Employees assigned to a given sub-admin */
  getEmployeesBySubAdmin: subId =>
    api.get(`/subadmins/${subId}/employees`).then(res => res.data),

  /** Assign employees (by array of IDs) to a sub-admin */
  assignEmployeesToSubAdmin: (subId, employeeIds) =>
    api
      .post(`/subadmins/${subId}/assign`, { employeeIds })
      .then(res => res.data),

  /** Remove (deassign) employees from a sub-admin */
  deassignEmployeesFromSubAdmin: (subId, employeeIds) =>
    api
      .post(`/subadmins/${subId}/deassign`, { employeeIds })
      .then(res => res.data),

  // ─── Reports ────────────────────────────────────────

  getEmployeeReports: empId =>
    api
      .get(`/employees/${empId}/reports`)
      .then(res => res.data),

  /**
   * Optional: fetch reports filtered by date
   * GET /api/admin/employees/:id/reports?date=YYYY-MM-DD
   */
  getEmployeeReportsByDate: (empId, date) =>
    api
      .get(`/employees/${empId}/reports`, { params: { date } })
      .then(res => res.data),

  // ─── Approval Flow ───────────────────────────────────

  /** List users awaiting admin approval */
  getPendingUsers: () =>
    api.get('/pending-signups').then(res => res.data),

  /** Approve a user */
  approveUser: (userId) =>
    api.post(`/approve/${userId}`).then(res => res.data),
};

export default adminService;
