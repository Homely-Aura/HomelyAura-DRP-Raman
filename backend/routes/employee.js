import express from 'express';
import { getProfile, upsertProfile } from '../controllers/employeeController.js';
import upload from '../middleware/upload.js';
import { getEmployeeTasks } from '../controllers/taskController.js';

const router = express.Router();

// Fetch the logged-in employee’s profile (or basic info if none)
router.get('/profile', getProfile);

// Create or update profile (one-time), handling photo upload
router.post('/profile', upload.single('photo'), upsertProfile);

// ─── Fetch Today’s Assigned Tasks ───────────────────────
router.get('/tasks', getEmployeeTasks);

export default router;
