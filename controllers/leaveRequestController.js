
const LeaveRequest = require('./../models/leaveRequest');
const {getDatesBetween} = require('./../utilities/dateUtility');


const validateLeaveDays = async (req, res, next) => {
    try {
      const {start, end} = req.body.range;
      console.log(req.body)
      const startd = new Date(start);
      const endt = new Date(end);
      console.log(startd,endt)
  
      if (startd <= endt) {
        next();
      } else {
        res.status(400).json({
          success: false,
          error: 'Start date must be less than or equal to end date',
        });
      }
    } catch (error) {

      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };


  


  const registerLeaveRequest = async (req, res) => {
    try {
      // Extract necessary information from the request
      const {userID} = req.user;
      const {title, description} = req.body;
      const {start, end} = req.body.range;

  
      //getDatesBetween is a function that returns an array of dates

      
      const requestedDates = getDatesBetween(start, end);

      console.log(requestedDates)
  
      if (requestedDates.length < 1) {
        return res.status(400).json({
          success: false,
          error: 'No valid dates found for the leave request. Please check your date range.',
        });
      }

  
      const newLeaveRequest = new LeaveRequest({
        title,
        description,
        date: new Date(),
        requestedDates,
        userID,
      });
  
      // Save the newLeaveRequest document to the database
      await newLeaveRequest.save();
  
      // Perform aggregation on the LeaveRequest model
      const newData = await LeaveRequest.aggregate([
        {
          $match: {
            _id: newLeaveRequest._id,
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'userID',
            foreignField: 'userID',
            as: 'employeeData',
          },
        },
        {
          $project: {
            'userID': 1,
            'title': 1,
            'description': 1,
            'reviewStatus': 1,
            'requestedDates': 1,
            'userName': {$arrayElemAt: ['$employeeData.name', 0]}, // Access employeeName directly
          },
        },
      ]);
  
      res.status(201).json({
        success: true,
        data: newData[0], // Assuming newData is an array with one element
        message: 'Your leave request has been successfully submitted for review.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };

  const getLeaveRequest = async (req, res) => {
    try {
      const { role, userID} = req.user;
      const matchQuery = {};
      console.log(role);
  
      // If the user is not a CompanyAdmin, filter by employeeID
      if (role !== 'companyAdmin') {
        matchQuery.userID = userID;
      }
  
      const leaveRequests = await LeaveRequest.aggregate([
        {
          $match: matchQuery,
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'userID',
            foreignField: 'userID',
            as: 'employeeData',
          },
        },
        {
          $project: {
            'employeeID': 1,
            'title': 1,
            'description': 1,
            'reviewStatus': 1,
            'requestedDates': 1,
            'userName': '$employeeData.name',
          },
        },
        {
          $project: {
            userID: 1,
            title: 1,
            requestedDates: 1,
            description: 1,
            reviewStatus: 1,
            userName: {$arrayElemAt: ['$userName', 0]},
          },
        },
      ]);
  
      if (leaveRequests.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No pending leave requests found.',
        });
      }
  
      console.log(leaveRequests, 'lololo');
      return res.status(200).json({
        success: true,
        data: leaveRequests,
        message: 'Pending leave requests retrieved successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  };

  

  module.exports = {
    validateLeaveDays,
    registerLeaveRequest,
    getLeaveRequest,
  }