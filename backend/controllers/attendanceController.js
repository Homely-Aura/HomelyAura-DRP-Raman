import Attendance from '../models/Attendance.js';
import Employee   from '../models/Employee.js';

/**
 * GET /api/attendance/:employeeId?month=YYYY-MM
 * Returns all attendance records for that employee in the given month.
 */
export const getAttendance = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { month }      = req.query; // e.g. "2025-07"

    // Ensure employee exists
    const emp = await Employee.findById(employeeId);
    if (!emp) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Authorization:
    // - Sub-Admins can view any of their employees
    // - Employees can only view their own (i.e. when emp.user === req.user.id)
    if (req.user.role === 'subadmin') {
      if (emp.subAdmin?.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'employee') {
      // 👇 compare the Employee’s `user` field, not the doc’s _id
      if (emp.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!month) {
      return res
        .status(400)
        .json({ message: 'month query parameter is required (YYYY-MM)' });
    }

    const [year, mon] = month.split('-').map(Number);
    if (!year || !mon || mon < 1 || mon > 12) {
      return res
        .status(400)
        .json({ message: 'Invalid month format; expected YYYY-MM' });
    }

    const start = new Date(year, mon - 1, 1);
    const end   = new Date(year, mon, 1);

    const records = await Attendance.find({
      employee: employeeId,
      date:     { $gte: start, $lt: end }
    }).sort({ date: 1 });

    return res.json(records);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/attendance/:employeeId
 * Body: { date: "YYYY-MM-DD", status, leaveType? }
 * Creates or updates the attendance entry for that date.
 */
export const markAttendance = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { date, status, leaveType } = req.body;

    // Verify employee exists and subadmin ownership
    const emp = await Employee.findById(employeeId);
    if (!emp) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    if (emp.subAdmin?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!date || !status) {
      return res
        .status(400)
        .json({ message: 'date and status are required' });
    }

    const day = new Date(date);
    if (isNaN(day)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const record = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: day },
      { status, leaveType: status === 'leave' ? leaveType : null },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json(record);
  } catch (err) {
    next(err);
  }
};
