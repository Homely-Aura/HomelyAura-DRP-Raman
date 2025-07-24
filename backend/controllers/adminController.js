import User     from '../models/User.js';
import Employee from '../models/Employee.js';
import Report   from '../models/Report.js';
import { sendApprovalEmail } from '../utils/email.js';

/**
 * GET /api/admin/employees/:id
 * Return the Employee‐profile plus populated User data
 */
export const getEmployeeById = async (req, res, next) => {
  try {
    const empProfile = await Employee
      .findOne({ user: req.params.id })
      .populate('user', '-password');
    if (!empProfile) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(empProfile);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/subadmins/:id/employees
 * List all employees assigned to a given Sub-Admin
 */
export const getEmployeesBySubAdmin = async (req, res, next) => {
  try {
    const employees = await Employee
      .find({ subAdmin: req.params.id })
      .populate('user', '-password');
    return res.json(employees);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/subadmins/:id/assign
 * Body: { employeeIds: [...] }
 */
export const assignEmployeesToSubAdmin = async (req, res, next) => {
  const subId = req.params.id;
  const { employeeIds } = req.body;
  try {
    await Employee.updateMany(
      { user: { $in: employeeIds } },
      { $set: { subAdmin: subId } }
    );
    const updated = await Employee
      .find({ subAdmin: subId })
      .populate('user', '-password');
    res.json(updated);
  } catch (err) {
    console.error('assignEmployeesToSubAdmin error:', err);
    res.status(500).json({ message: 'Assignment failed' });
  }
};

/**
 * POST /api/admin/subadmins/:id/deassign
 * Body: { employeeIds: [...] }
 */
export const deassignEmployeesFromSubAdmin = async (req, res, next) => {
  const subId = req.params.id;
  const { employeeIds } = req.body;
  try {
    await Employee.updateMany(
      { user: { $in: employeeIds } },
      { $set: { subAdmin: null } }
    );
    const remaining = await Employee
      .find({ subAdmin: subId })
      .populate('user', '-password');
    res.json(remaining);
  } catch (err) {
    console.error('deassignEmployeesFromSubAdmin error:', err);
    res.status(500).json({ message: 'Deassignment failed' });
  }
};

/**
 * GET /api/admin/employees/:id/reports
 */
export const getReportsByEmployee = async (req, res, next) => {
  try {
    const reports = await Report
      .find({ employee: req.params.id })
      .sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error('getReportsByEmployee error:', err);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

/**
 * GET /api/admin/subadmins
 */
export const getSubAdmins = async (req, res, next) => {
  try {
    const subs = await User.find({ role: 'subadmin' }).select('-password');
    res.json(subs);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/subadmins/:id
 */
export const deleteSubAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sub = await User.findOneAndDelete({ _id: id, role: 'subadmin' });
    if (!sub) return res.status(404).json({ message: 'Sub-Admin not found' });
    res.json({ message: 'Sub-Admin deleted' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/employees
 */
export const getEmployees = async (req, res, next) => {
  try {
    const emps = await User.find({ role: 'employee' }).select('-password');
    res.json(emps);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/employees/:id
 */
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const emp = await User.findOneAndDelete({ _id: id, role: 'employee' });
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/pending-signups
 * List all users awaiting approval
 */
export const getPendingUsers = async (req, res, next) => {
  try {
    const pending = await User
      .find({ role: { $in: ['subadmin','employee'] }, isApproved: false })
      .select('-password');
    res.json(pending);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/approve/:userId
 * Approve a pending user and notify them by email
 */
export const approveUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = true;
    await user.save();

    // Send approval notification
    await sendApprovalEmail(user.email);

    res.json({ message: 'User approved successfully' });
  } catch (err) {
    next(err);
  }
};
