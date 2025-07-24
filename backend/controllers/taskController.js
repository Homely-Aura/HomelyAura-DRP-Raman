// backend/controllers/taskController.js
import Task from '../models/Task.js';
import Employee from '../models/Employee.js';

/**
 * Create a new task for a particular employee
 * POST /api/subadmin/tasks
 */
export const createTask = async (req, res, next) => {
  try {
    const { employeeId, description } = req.body;
    if (!employeeId || !description) {
      return res.status(400).json({ message: 'employeeId and description are required' });
    }
    // ensure subadmin owns that employee
    const emp = await Employee.findOne({ _id: employeeId, subAdmin: req.user.id });
    if (!emp) return res.status(403).json({ message: 'Not authorized for this employee' });

    const task = await Task.create({
      subAdmin: req.user.id,
      employee: employeeId,
      description
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * List today’s tasks for this sub-admin
 * GET /api/subadmin/tasks
 * Optional: ?employeeId=…
 */
export const getTasks = async (req, res, next) => {
  try {
    const { employeeId } = req.query;
    const start = new Date(); start.setHours(0,0,0,0);
    const end   = new Date(); end.setHours(23,59,59,999);

    const filter = {
      subAdmin: req.user.id,
      date: { $gte: start, $lte: end }
    };
    if (employeeId) filter.employee = employeeId;

    const tasks = await Task.find(filter)
      .populate({
        path: 'employee',
        select: 'designation user',
        populate: { path: 'user', select: 'name email' }
      })
      .sort('createdAt')
      .exec();

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a task’s description
 * PUT /api/subadmin/tasks/:id
 */
export const updateTask = async (req, res, next) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'Description required' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, subAdmin: req.user.id },
      { description },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a task
 * DELETE /api/subadmin/tasks/:id
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      subAdmin: req.user.id
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

/**
 * Employee fetching their own today’s tasks
 * GET /api/employee/tasks
 */
export const getEmployeeTasks = async (req, res, next) => {
  try {
    const emp = await Employee.findOne({ user: req.user.id });
    if (!emp) return res.status(404).json({ message: 'Profile not found' });

    const start = new Date(); start.setHours(0,0,0,0);
    const end   = new Date(); end.setHours(23,59,59,999);

    const tasks = await Task.find({
      employee: emp._id,
      date: { $gte: start, $lte: end }
    })
    .sort('createdAt')
    .exec();

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};
