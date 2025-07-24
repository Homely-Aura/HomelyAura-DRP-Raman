import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import logger from './utils/logger.js';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import subadminRoutes from './routes/subadmin.js';
import employeeRoutes from './routes/employee.js';
import reportRoutes from './routes/report.js';
import attendanceRoutes from './routes/attendance.js';

import { auth } from './middleware/auth.js';
import { requireRole } from './middleware/role.js';

dotenv.config();
const app = express();

// ─── MIDDLEWARE ────────────────────────────────────────
// CORS configuration
const corsOptions = {
  origin: [
    'http://192.168.1.30:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
  ],
  methods: ['GET','POST','PATCH','DELETE','OPTIONS','PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
connectDB();

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── PUBLIC ROUTES ─────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── PROTECTED & ROLE-GUARDED ROUTES ───────────────────
app.use('/api/admin',    auth, requireRole('admin'),    adminRoutes);
app.use('/api/subadmin', auth, requireRole('subadmin'), subadminRoutes);
app.use('/api/employee', auth, requireRole('employee'), employeeRoutes);

// ─── OTHER FEATURE ROUTES ───────────────────────────────
app.use('/api/report',     reportRoutes);
// Attendance router handles its own auth/roles internally
app.use('/api/attendance', attendanceRoutes);

// ─── GLOBAL ERROR HANDLER ───────────────────────────────
app.use((err, req, res, next) => {
  logger.error(err);
  // Handle Multer errors or invalid file types
  if (err instanceof multer.MulterError || err.message.includes('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Server Error' });
});

// ─── START SERVER ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
