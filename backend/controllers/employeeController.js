// controllers/employeeController.js - CRUD operations for employee management
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const { AppError } = require('../middleware/errorHandler');

// ─── Validation Rules ──────────────────────────────────────────────────────────

exports.employeeValidation = [
  body('name').trim().notEmpty().withMessage('Employee name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .isIn(['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales', 'QA'])
    .withMessage('Invalid department'),
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  body('performanceScore')
    .isNumeric()
    .withMessage('Performance score must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Performance score must be between 0 and 100'),
  body('experience')
    .isNumeric()
    .withMessage('Experience must be a number')
    .isFloat({ min: 0 })
    .withMessage('Experience cannot be negative')
];

// ─── Controllers ───────────────────────────────────────────────────────────────

/**
 * @desc    Add a new employee
 * @route   POST /api/employees
 * @access  Private
 */
exports.addEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Check for duplicate email
    const existing = await Employee.findOne({ email });
    if (existing) {
      return next(new AppError('An employee with this email already exists', 400));
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    });

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Private
 */
exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    // Assign ranks based on performance score
    const ranked = employees.map((emp, index) => ({
      ...emp.toObject(),
      rank: index + 1
    }));

    res.status(200).json({
      success: true,
      count: ranked.length,
      data: ranked
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single employee by ID
 * @route   GET /api/employees/:id
 * @access  Private
 */
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search/filter employees by department or name
 * @route   GET /api/employees/search?department=Development&name=Aman
 * @access  Private
 */
exports.searchEmployees = async (req, res, next) => {
  try {
    const { department, name, minScore, maxScore } = req.query;
    const query = {};

    if (department) query.department = department;
    if (name) query.name = { $regex: name, $options: 'i' };
    if (minScore || maxScore) {
      query.performanceScore = {};
      if (minScore) query.performanceScore.$gte = Number(minScore);
      if (maxScore) query.performanceScore.$lte = Number(maxScore);
    }

    const employees = await Employee.find(query).sort({ performanceScore: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee details
 * @route   PUT /api/employees/:id
 * @access  Private
 */
exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }
    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete employee
 * @route   DELETE /api/employees/:id
 * @access  Private
 */
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
