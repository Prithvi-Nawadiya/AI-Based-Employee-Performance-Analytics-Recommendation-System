// routes/employeeRoutes.js - Employee CRUD routes
const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
  employeeValidation
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// Apply JWT protection to all employee routes
router.use(protect);

// GET  /api/employees/search - Search employees (must be before /:id)
router.get('/search', searchEmployees);

// GET  /api/employees     - Get all employees
// POST /api/employees     - Add new employee
router.route('/')
  .get(getAllEmployees)
  .post(employeeValidation, addEmployee);

// GET    /api/employees/:id - Get employee by ID
// PUT    /api/employees/:id - Update employee
// DELETE /api/employees/:id - Delete employee
router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
