import express from 'express';
import {
  adminLogin,
  signup,
  login,
  requestPasswordReset,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// Admin login
router.post('/admin/login', adminLogin);

// Open signup
router.post('/signup', signup);

// Sub‑Admin & Employee login
router.post('/login', login);

// ── New password‑reset endpoints ───────────────────────────────────
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
