const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    onBreak: {
        type: Boolean,
        default: false,
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
    breaks: [{
        startTime: {
            type: Date,
          
        },
        endTime: {
            type: Date,
            
        }
    }],
    breakTime: {
        type: Number,
        default: 0
    },
    totalWorkTime:{
        type: Number,
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
