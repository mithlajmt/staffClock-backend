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
    getPreviousAttendanceData,
}=require('../controllers/attendanceController');

const {
    validateLeaveDays,
    registerLeaveRequest,
    getLeaveRequest,
    upDateLeaveRequest,
} = require('../controllers/leaveRequestController')

const{isAdmin}=require('./../utilities/jwt')


router.post('/checkIn',checkWorkingDay,checkAlreadyLoggedInToday,RegisterCheckIn);

router.get('/checkIn',getCheckInTime);




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



router.get('/leaveRequest',[
    getLeaveRequest,
]);

router.post('/leaveRequest',[
    validateLeaveDays,
    registerLeaveRequest,
]);
router.patch('/leaveRequest',[
    isAdmin,
    upDateLeaveRequest,
]);

router.get('/',[
    getPreviousAttendanceData,
])






module.exports = router;