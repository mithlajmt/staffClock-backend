const express = require('express');
const router = express.Router();
const {
    RegisterCheckIn,
    getCheckInTime,
    checkWorkingDay,
    checkAlreadyLoggedInToday,
    checkInExists,
    registerCheckOut,
    getStatus,
    markBreak,
}=require('../controllers/attendanceController');

const {
    validateLeaveDays,
    registerLeaveRequest,
    getLeaveRequest
} = require('./../controllers/leaveRequestController')


router.post('/checkIn',checkWorkingDay,checkAlreadyLoggedInToday,RegisterCheckIn);

router.get('/checkIn',getCheckInTime);

router.post('/leaveRequest',[
    validateLeaveDays,
    registerLeaveRequest,
]);

router.get('/leaveRequest',[
    getLeaveRequest,
]);

router.post('/checkOut',[
    checkInExists,
    registerCheckOut,
])

router.get('/status',[
    getStatus,
]);
router.patch('/break',[
    checkInExists,
    markBreak,
])


module.exports = router;