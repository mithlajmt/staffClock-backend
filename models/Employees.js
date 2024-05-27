const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  userID: {
    unique: true,
    required: true,
    type: String,
  },
  email: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  hiringDate: {
    type: Date,
    default: Date.now,
  },
  dateOfBirth: {
    type: Date,
  },
  jobTitle: {
    type: String,
  },
  gender: {
    type: String,
  },
  contactNumber: {
    required: true,
    type: Number,
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: 'employee',
  },
  salary: {
    required: true,
    type: Number,
  },
  isLate:{
    type: Boolean,
    default:false,
  },
  shiftTime: {
    type: [{
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      }
    }],
    default: [{ startTime: '10:00', endTime: '17:00' }],
  }
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
