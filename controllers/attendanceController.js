const Employee = require('./../models/Employees')
const Attendance = require('./../models/attendance');
const mongoose = require('mongoose');


const checkAlreadyLoggedInToday = async (req, res, next) => {
    try {
        const { userID } = req.user;
        
        // Get the start and end of the current day
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

        const existingAttendance = await Attendance.findOne({
            userID: userID,
            checkIn: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: "You have already checked in today"
            });
        }

        next();
    } catch (error) {
        console.error("Error checking if user already logged in today:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const checkWorkingDay = async (req, res, next) => {
    // Check the day of the week
    const today = new Date().getDay();
    if (today === 0) {
      // If it's Sunday, prevent attendance marking
      res.status(400).json({
        message: 'Attendance cannot be marked today; it\'s Sunday. Enjoy your holiday.',
      });
    } else {
      // Continue to the next middleware if it's a working day
      next();
    }
  };

const getCheckInTime = async (req, res) => {
    try {
        const { userID } = req.user;
        
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

        const attendance = await Attendance.findOne({
            userID: userID,
            checkIn: { $gte: startOfDay, $lte: endOfDay }
        });

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "No check-in record found for today"
            });
        }

        res.status(200).json({
            success: true,
            checkInTime: attendance.checkIn
        });
    } catch (error) {
        console.error("Error retrieving check-in time:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const RegisterCheckIn = async (req, res) => {
    try {
        console.log('asfsaf')
        const  {userID}  = req.user; 
        const currentTime = new Date(); 
        
        const newAttendance = new Attendance({
            userID,
            checkIn: currentTime
        });

        await newAttendance.save();

        res.status(200).json({
            success: true,
            message: "Check-in registered successfully",
            checkInTime: currentTime ,
        });
    } catch (error) {
        console.error("Error registering check-in:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    RegisterCheckIn,
    getCheckInTime,
    checkWorkingDay,
    checkAlreadyLoggedInToday,
}
