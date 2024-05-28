const cron = require('node-cron');
const Attendance = require('./../models/attendance');
const Employees = require('./../models/Employees');

const checkOutEmployees = async () => {
  try {
    const overdueEmployees = await Attendance.find({checkOut: {$exists: false}});

    if (overdueEmployees.length > 0) {
      const employeeIds = overdueEmployees.map((employee) => employee.userID);
      await Attendance.updateMany(
          {userID: {$in: employeeIds}, checkOut: {$exists: false}},
          {$set: {checkOut: new Date(), isLate: true}},
      );

      console.log(`Checked out employees with IDs: ${employeeIds.join(', ')}`);
    } else {
      console.log('No overdue employees found.');
    }
  } catch (error) {
    console.error('Error during check-out:', error);
  }
};


const markLeave = async () => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
  
      const activeEmployees = await Employees.find({ isActive: true });
  
      // Iterate over active employees
      for (const employee of activeEmployees) {
        const existingAttendance = await Attendance.findOne({
          userID: employee.userID,
          date: { $gte: startOfDay, $lte: endOfDay },
        });
  
        if (!existingAttendance) {
          const attendance = new Attendance({
            employeeID: employee.userID,
            date: new Date(),
            status: 'leave',
          });
  
          await attendance.save();
        }
      }
    } catch (error) {
      console.error('Error marking leave:', error);
    }
  };
  


cron.schedule('0 23 * * 1-6', async () => {
  await checkOutEmployees();
});


cron.schedule('30 11 * * 1-6', async () => {
  await markLeave();
});



module.exports = cron;