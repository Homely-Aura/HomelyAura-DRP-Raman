import express from 'express';
import { auth }        from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import {
  getSubAdmins,
  deleteSubAdmin,
  getEmployees,
  deleteEmployee,
  getEmployeeById,
  getEmployeesBySubAdmin,
  assignEmployeesToSubAdmin,
  deassignEmployeesFromSubAdmin,
  getReportsByEmployee,
  getPendingUsers,
  approveUser
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all admin routes
router.use(auth, requireRole('admin'));

// Sub-Admin management
router.get( '/subadmins',               getSubAdmins);
router.get( '/subadmins/:id/employees', getEmployeesBySubAdmin);
router.post('/subadmins/:id/assign',    assignEmployeesToSubAdmin);
router.post('/subadmins/:id/deassign',  deassignEmployeesFromSubAdmin);
router.delete('/subadmins/:id',         deleteSubAdmin);

// Employee user management
router.get( '/employees',           getEmployees);
router.get( '/employees/:id',       getEmployeeById);
router.delete('/employees/:id',     deleteEmployee);

// Employee reports
router.get('/employees/:id/reports', getReportsByEmployee);

// ── New approval endpoints ────────────────────────────────────────
// List users awaiting approval
router.get( '/pending-signups', getPendingUsers);
// Approve a user by ID
router.post('/approve/:userId',  approveUser);

export default router;
