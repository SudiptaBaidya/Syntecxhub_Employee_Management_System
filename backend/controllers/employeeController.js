const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search & Filter
    let query = { user: req.user.id };
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.role) query.role = req.query.role;
    if (req.query.department) query.department = req.query.department;
    if (req.query.status) query.status = req.query.status;

    // Sorting
    let sortQuery = { createdAt: -1 };
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sortQuery[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const employees = await Employee.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, user: req.user.id });
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = async (req, res, next) => {
  try {
    const emailExists = await Employee.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already exists');
    }

    const employee = await Employee.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, user: req.user.id });

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    if (req.body.email && req.body.email !== employee.email) {
      const emailExists = await Employee.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already exists');
      }
    }

    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedEmployee);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, user: req.user.id });

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    await employee.deleteOne();
    res.json({ message: 'Employee removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/employees/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments({ user: req.user.id });
    const activeEmployees = await Employee.countDocuments({ user: req.user.id, status: 'Active' });
    const inactiveEmployees = await Employee.countDocuments({ user: req.user.id, status: 'Inactive' });

    // Department wise distribution
    const departmentStats = await Employee.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const recentEmployees = await Employee.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(5);

    res.json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      departmentStats: departmentStats.map(stat => ({
        name: stat._id || 'Unassigned',
        value: stat.count
      })),
      recentEmployees
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats
};
