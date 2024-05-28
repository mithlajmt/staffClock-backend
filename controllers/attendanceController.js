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
            return res.status(201).json({
                success: false,
                message: "No check-in record found for today"
            });
        }
        if (attendance.checkOut) {
            return res.status(201).json({
                success: false,
                checkInTime: 'm'
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

// to check whether employee checkedin to checkout and is he already checked out
const checkInExists = async (req, res, next) => {
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
        if (!existingAttendance) {
            return res.status(400).json({
                success: false,
                message: "checkIn First "
            });
        }

        if (existingAttendance.checkOut) {
            return res.status(400).json({
                success: false,
                message: "You have already checkededout in today"
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
  
  // Middleware to register employee check-out
  const registerCheckOut = async (req, res, next) => {
    try {
      const { userID } = req.user;
      const currentDate = new Date().toISOString().split('T')[0];
      const checkOut = new Date();
  
      const query = { userID, date: { $gte: new Date(currentDate), $lt: new Date(currentDate + 'T23:59:59Z') } };
  
      let attendance = await Attendance.findOne(query);
      
      if (!attendance) {
        return res.status(404).json({ success: false, message: 'Check-in record not found' });
      }
  
      // Check if the last break has an open startTime without an endTime
      const breaks = attendance.breaks;
      if (breaks.length > 0 && !breaks[breaks.length - 1].endTime) {
        breaks[breaks.length - 1].endTime = checkOut;
      }
  
      let totalBreakTime = 0;
      breaks.forEach(breakPeriod => {
        if (breakPeriod.startTime && breakPeriod.endTime) {
          totalBreakTime += (new Date(breakPeriod.endTime) - new Date(breakPeriod.startTime)) / 60000; // Convert milliseconds to minutes
        }
      });
  
      // Calculate total working time (in minutes)
      const checkInTime = new Date(attendance.checkIn);
      const totalWorkTime = ((checkOut - checkInTime) / 60000) - totalBreakTime; // Convert milliseconds to minutes
  
      attendance.checkOut = checkOut;
      attendance.breakTime = totalBreakTime;
      attendance.totalWorkTime = totalWorkTime; // Store total working time in minutes
      attendance.breaks = breaks;
  
      await attendance.save();
  
      res.json({ success: true, message: 'Check-out successful', attendance });
  
    } catch (err) {
      console.error('Error during check-out:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  

  const getStatus = async (req, res) => {
    try {
      const { userID } = req.user;
  
      const currentDate = new Date();
      const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
      const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
  
      // Find the attendance record for the current day
      const attendance = await Attendance.findOne({
        userID: userID,
        checkIn: { $gte: startOfDay, $lte: endOfDay }
      });
  
      // Check if attendance record exists
      if (!attendance) {
        return res.json({
            onBreak:false,
             showCheckedIn: true });
      }
  
      // Check if user has checked out
      if (attendance.checkOut) {

        return res.json({
            onBreak:false,
             showCheckedIn: true 
            });
      }
  
      // User has checked in but not checked out
      if (attendance.checkIn && !attendance.checkOut) {
        if(attendance.onBreak){
            return res.json({
                onBreak:true,
                 showCheckedIn: false 
                });
        }else{
            return res.json({
                onBreak:false,
                 showCheckedIn: false 
                });
        }
      }
    } catch (error) {
      console.error('Error fetching attendance status:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  const markBreak = async (req, res) => {
    try {
      const { userID } = req.user;

      const currentDate = new Date();
      const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
      const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
  
    
      const now = new Date();
  
      const query = {
        userID,
        date: { $gte: startOfDay, $lt: endOfDay }
      };
  
      let attendance = await Attendance.findOne(query);
  
      if (!attendance) {
        return res.status(404).json({ success: false, message: 'Attendance record not found' });
      }
  
      //  checking unclosed breaks
      const breaks = attendance.breaks;
      if (breaks.length > 0 && !breaks[breaks.length - 1].endTime) {
        // If there's an open break, close it
        breaks[breaks.length - 1].endTime = now;
        attendance.onBreak = false;
      } else {

        // If no open break, start a new one
        breaks.push({ startTime: now });
        attendance.onBreak = true;
      }
  
      attendance.breaks = breaks;
      await attendance.save();
  
      res.json({ success: true, message: 'Break status updated', onBreak:attendance.onBreak });
    } catch (err) {
      console.error('Error updating break status:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };


  const getPreviousAttendanceData = async (req, res) => {
    try {
      const { userID } = req.user;
  
      const attendanceRecords = await Attendance.aggregate([
        {
          $match: {
            userID: userID
          }
        },
        {
          $project: {
            _id: 0,
            date: { $dateToString: { format: "%d/%m/%Y", date: "$date" } }, // Format date as "day/month/year"
            checkIn: 1,
            checkOut: 1,
            isLate: "$isLate",
            totalWorkTime: "$totalWorkTime",
            totalBreakTime: "$breakTime"
          }
        }
      ]);
  
      if (!attendanceRecords || attendanceRecords.length === 0) {
        return res.status(404).json({ success: false, message: 'No attendance records found' });
      }
  
      // Transform totalWorkTime and totalBreakTime to human-readable formats
      const formattedRecords = attendanceRecords.map(record => {
        const workHours = Math.floor(record.totalWorkTime / 60);
        const workMinutes = Math.floor(record.totalWorkTime % 60);
        const totalWorkedTime = `${workHours} hours ${workMinutes} minutes`;
  
        const breakHours = Math.floor(record.totalBreakTime / 60);
        const breakMinutes = Math.floor(record.totalBreakTime % 60);
        const totalBreakTime = `${breakHours} hours ${breakMinutes} minutes`;

        const checkInTime = new Date(record.checkIn).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
      const checkOutTime = new Date(record.checkOut).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
  
        return {
          date: record.date,
          totalWorkedTime,
          totalBreakTime,
          checkInTime,
          checkOutTime,
        };
      });

      res.json({ success: true, attendanceRecords: formattedRecords });
    } catch (err) {
      console.error('Error fetching attendance history:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
module.exports = {
    RegisterCheckIn,
    getCheckInTime,
    checkWorkingDay,
    checkAlreadyLoggedInToday,
    checkInExists,
    registerCheckOut,
    getStatus,
    markBreak,
    getPreviousAttendanceData,
}
