// backend/controllers/reportController.js

import Report from '../models/Report.js';
import Employee from '../models/Employee.js';

/**
 * @desc    Employee submits a new daily report
 * @route   POST /api/report
 * @access  Employee
 */
export const createReport = async (req, res, next) => {
  try {
    const { date, workDetails, inTime, outTime } = req.body;

    if (!date || !workDetails || !inTime || !outTime) {
      return res
        .status(400)
        .json({ message: 'date, workDetails, inTime and outTime are all required' });
    }

    const employeeRecord = await Employee.findOne({ user: req.user.id });
    if (!employeeRecord) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const reportData = {
      employee:   employeeRecord._id,
      date:       new Date(date),
      workDetails
    };

    const start = new Date(`${date}T${inTime}`);
    const end   = new Date(`${date}T${outTime}`);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Invalid inTime or outTime format' });
    }

    reportData.inTime   = start;
    reportData.outTime  = end;
    reportData.duration = Math.floor((end - start) / 60000);

    const newReport = await Report.create(reportData);
    return res.status(201).json(newReport);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all reports for the logged-in employee
 * @route   GET /api/report/my
 * @access  Employee
 */
export const getMyReports = async (req, res, next) => {
  try {
    const employeeRecord = await Employee.findOne({ user: req.user.id });
    if (!employeeRecord) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }
    const reports = await Report.find({ employee: employeeRecord._id }).sort({ date: -1 });
    return res.json(reports);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all reports (optionally filter by employee)
 * @route   GET /api/report
 * @access  Sub-Admin, Admin
 */
export const getAllReports = async (req, res, next) => {
  try {
    const filter = {};
    const isSub = req.user.role === 'subadmin';

    if (isSub) {
      // Only include employees assigned to this Sub-Admin
      const assigned = await Employee.find(
        { subAdmin: req.user.id },
        '_id'
      );
      const empIds = assigned.map(e => e._id.toString());

      if (req.query.employeeId) {
        if (!empIds.includes(req.query.employeeId)) {
          return res.status(403).json({ message: 'Access denied' });
        }
        filter.employee = req.query.employeeId;
      } else {
        filter.employee = { $in: empIds };
      }
    } else {
      // Admin path: optional filter by ?employeeId
      if (req.query.employeeId) {
        filter.employee = req.query.employeeId;
      }
    }

    const reports = await Report.find(filter)
      .populate({
        path: 'employee',
        populate: { path: 'user' }    // full User doc
      })
      .sort({ date: -1 });

    return res.json(reports);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update inTime/outTime for a specific report
 * @route   PATCH /api/report/:id
 * @access  Sub-Admin, Admin
 */
export const updateReport = async (req, res, next) => {
  try {
    const { inTime, outTime, workDetails } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Sub-Admin may only update their own employees' reports
    if (req.user.role === 'subadmin') {
      const emp = await Employee.findById(report.employee);
      if (!emp || emp.subAdmin?.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    if (workDetails != null) {
      report.workDetails = workDetails;
    }

    if (inTime) {
      const start = new Date(`${report.date.toISOString().split('T')[0]}T${inTime}`);
      if (isNaN(start)) {
        return res.status(400).json({ message: 'Invalid inTime format' });
      }
      report.inTime = start;
    }
    if (outTime) {
      const end = new Date(`${report.date.toISOString().split('T')[0]}T${outTime}`);
      if (isNaN(end)) {
        return res.status(400).json({ message: 'Invalid outTime format' });
      }
      report.outTime = end;
    }

    if (report.inTime && report.outTime) {
      report.duration = Math.floor((report.outTime - report.inTime) / 60000);
    }

    const updated = await report.save();
    return res.json(updated);
  } catch (err) {
    next(err);
  }
};
