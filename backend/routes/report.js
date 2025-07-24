import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import {
  createReport,
  getMyReports,
  getAllReports,
  updateReport
} from '../controllers/reportController.js';

const router = express.Router();

// Employee-only endpoints
router.post(
  '/',
  auth,
  requireRole('employee'),
  createReport
);
router.get(
  '/my',
  auth,
  requireRole('employee'),
  getMyReports
);

// Sub-admin & Admin endpoints
router.get(
  '/',
  auth,
  requireRole('subadmin', 'admin'),
  getAllReports
);
router.patch(
  '/:id',
  auth,
  requireRole('subadmin', 'admin'),
  updateReport
);

export default router;
