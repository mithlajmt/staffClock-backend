const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({

  userID: {
    type: String,
    required: true,
  },


  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },


  requestedDates: {
    type: [Date],
    required: true,
  },

  date: {
    type: Date,
    default: new Date(),

  },

  reviewStatus: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending',
  },

});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

module.exports = LeaveRequest;
