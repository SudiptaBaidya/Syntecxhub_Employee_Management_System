const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');
 
 router.use(protect);
 
 router.get('/dashboard/stats', getDashboardStats);
 router.route('/')
   .get(getEmployees)
   .post(authorize('Admin', 'HR'), createEmployee);
 router.route('/:id')
   .get(getEmployeeById)
   .put(authorize('Admin', 'HR'), updateEmployee)
   .delete(authorize('Admin'), deleteEmployee);

module.exports = router;
