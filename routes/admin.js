const express = require('express');
const router = express.Router();
const {upDateLeaveRequest}=require('./../controllers/leaveRequestController')

router.patch('/leaveRequest',
 [upDateLeaveRequest]);

module.exports = router;