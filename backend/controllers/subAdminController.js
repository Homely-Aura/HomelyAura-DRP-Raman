import Employee from '../models/Employee.js';

/**
 * GET /api/subadmin/assigned
 * List all employees assigned to the logged-in sub-admin, with full details.
 */
export const listAssignedEmployees = async (req, res, next) => {
  try {
    const employees = await Employee
      .find({ subAdmin: req.user.id })
      .populate('user')          // ← no field filter: brings in entire User doc
      // .populate('otherRef')   // ← if you need other refs, chain more populates
      .exec();
    return res.json(employees);
  } catch (err) {
    next(err);
  }
};
