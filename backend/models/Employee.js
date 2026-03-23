const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Manager', 'Developer', 'HR', 'Other'],
    default: 'Developer'
  },
  department: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Inactive']
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
