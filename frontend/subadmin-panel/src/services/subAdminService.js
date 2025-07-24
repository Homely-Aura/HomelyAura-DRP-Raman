import api from './api';

/**
 * Service for Sub-Admin–specific endpoints:
 *  • GET  /subadmin/assigned       → list employees assigned to this sub-admin
 *  • POST /subadmin/assign         → assign an employee under this sub-admin
 *  • DELETE /subadmin/unassign/:id → remove an employee assignment
 *  • GET  /subadmin/tasks          → list today’s tasks
 *  • POST /subadmin/tasks         → create a new task
 *  • PUT  /subadmin/tasks/:id     → update an existing task
 *  • DELETE /subadmin/tasks/:id   → delete a task
 */
const subAdminService = {
  // existing employee-assignment methods
  getAssignedEmployees: () =>
    api.get('/subadmin/assigned').then(res => res.data),

  assignEmployee: employeeId =>
    api.post('/subadmin/assign', { employeeId })
       .then(res => res.data),

  unassignEmployee: employeeId =>
    api.delete(`/subadmin/unassign/${employeeId}`)
       .then(res => res.data),

  // new task methods
  getTasks: () =>
    api.get('/subadmin/tasks').then(res => res.data),

  createTask: (employeeId, description) =>
    api.post('/subadmin/tasks', { employeeId, description })
       .then(res => res.data),

  updateTask: (taskId, description) =>
    api.put(`/subadmin/tasks/${taskId}`, { description })
       .then(res => res.data),

  deleteTask: taskId =>
    api.delete(`/subadmin/tasks/${taskId}`)
       .then(res => res.data),
};

export default subAdminService;
