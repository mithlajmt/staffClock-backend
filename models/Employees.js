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
  },
  salary: {
    required: true,
    type: Number,
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
