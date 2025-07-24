import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { listAssignedEmployees } from '../controllers/subAdminController.js';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

// All routes in this router require a logged-in sub-admin
router.use(auth, requireRole('subadmin'));

// List employees assigned to this sub-admin
router.get('/assigned', listAssignedEmployees);

// ─── Task CRUD for Sub-Admin ───────────────────────────
// Assign a task / get today's tasks
router
  .route('/tasks')
  .post(createTask)   // Create a new task for an employee
  .get(getTasks);     // List today's tasks (optionally filtered by ?employeeId=...)

// Edit or delete a specific task
router
  .route('/tasks/:id')
  .put(updateTask)    // Update task description
  .delete(deleteTask);// Delete a task

export default router;
