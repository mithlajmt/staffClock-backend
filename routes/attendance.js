const express = require('express');
const router = express.Router();
const {
    RegisterCheckIn,
    getCheckInTime,
    checkWorkingDay,
    checkAlreadyLoggedInToday,
}=require('../controllers/attendanceController')

router.post('/checkIn',checkWorkingDay,checkAlreadyLoggedInToday,RegisterCheckIn);
router.get('/checkIn',getCheckInTime);

module.exports = router;