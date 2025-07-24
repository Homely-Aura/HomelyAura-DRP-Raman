import express from 'express';
import { auth }        from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import {
  getAttendance,
  markAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

// All attendance routes require authentication
router.use(auth);

/**
 * GET /api/attendance/:employeeId?month=YYYY-MM
 * - subadmins can fetch any of their employees
 * - employees can only fetch their own
 */
router.get(
  '/:employeeId',
  requireRole('subadmin', 'employee'),
  getAttendance
);

/**
 * POST /api/attendance/:employeeId
 * - only subadmins can create/update attendance
 */
router.post(
  '/:employeeId',
  requireRole('subadmin'),
  markAttendance
);

export default router;
