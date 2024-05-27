const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userID: {
       type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date
    },
    breakTime: {
        type: Number,
        default: 0
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
