const Employee = require("./../models/Employees");
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const {generatePassword}=require('./../utilities/password')
const {sendWelcomeEmail}=require('./../utilities/nodemailer')



const checkAllFields = async (req, res, next) => {
  const {
    employeeName,
    dateOfBirth,
    salary,
    contactEmail,
    contactNumber,
    gender,
    jobTitle,
  } = req.body;

  const errors = [];

  if (!employeeName || typeof employeeName !== 'string' || employeeName.trim().length < 2) {
    errors.push('Employee name is required and must be at least 2 characters long.');
  }
  if (!dateOfBirth || !Date.parse(dateOfBirth)) {
    errors.push('Valid date of birth is required.');
  }
  if (!salary || isNaN(salary) || salary <= 0) {
    errors.push('Valid salary is required.');
  }
  if (!contactEmail || !/^\S+@\S+\.\S+$/.test(contactEmail)) {
    errors.push('Valid email address is required.');
  }
  if (!contactNumber || !/^\d{10}$/.test(contactNumber)) {
    errors.push('Phone number must be 10 digits long.');
  }
  if (!gender || (gender !== 'male' && gender !== 'female')) {
    errors.push('Gender is required and must be either "male" or "female".');
  }
  if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length < 2) {
    errors.push('Job title is required and must be at least 2 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success:false,
      message:errors[0]
     });
  }

  next();
};


const ValidateData = async (req, res, next) => {
  const { contactEmail, contactNumber } = req.body;

  try {
    const existingEmployee = await Employee.findOne({
      $or: [
        { email: contactEmail },
        { contactNumber: contactNumber }
      ]
    });

    if (existingEmployee) {
      return res.status(400).json({ message: "Email or contact number already exists." });
    }

    next();
  } catch (error) {
    console.error("Error in ValidateData middleware:", error);
    return res.status(500).json({
      success:false,
       message: "Server error" });
  }
};


const generateEmployeeID = async (req, res, next) => {

  try {
    const { contactNumber, contactEmail, employeeName, } = req.body;

    const namePart = employeeName.slice(0, 3).toUpperCase();
    const emailPart = contactEmail.slice(0, 3).toUpperCase();
    const numPart = contactNumber.slice(-3);
    const randomDigits = Math.floor(Math.random() * 900) + 100; 

    const employeeID = `EMP-${namePart}${emailPart}${numPart}${randomDigits}`;

    console.log('Generated Employee ID:', employeeID);

    req.employeeID = employeeID;

    next();
  } catch (error) {
    console.error('Error generating employee ID:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error while generating employee ID' });
  }
};

const storeEmployee = async (req, res) => {
  try {
    const {
      employeeName,
      dateOfBirth,
      salary,
      contactEmail,
      contactNumber,
      gender,
      role,
      jobTitle,
    } = req.body;

    console.log(req.body)

    const password = generatePassword(employeeName,contactEmail);

    const saltRound = 10
    const hashedPass = await bcrypt.hash(password,saltRound);

    const userID = req.employeeID

    const employee = new Employee({
      name:employeeName,
      dateOfBirth,
      salary,
      email:contactEmail,
      contactNumber,
      gender,
      jobTitle,
      password:hashedPass,
      role,
      userID,
    });


    await employee.save();
    await sendWelcomeEmail(contactEmail, userID, password);
    console.log(password, 'email')
    res.json({
      success:true,
      message: "employee Added SuccessFully",
    });
  } catch (err) {
    console.log(err);
  }
};

const getEmployeesDatas = async (req, res) => {
  try {
      const { userID } = req.user;
      const employees = await Employee.aggregate([
          {
              $match: { role:'employee', isActive: true }
          },
          {
              $project: {
                  _id: 0,
                  name: 1,
                  email: 1,
                  userID: 1,
                  jobTitle: 1,
                  salary: 1,
              }
          }
      ]);

      // Send the response with the fetched employee data
      res.json({ success: true, employees });
  } catch (err) {
      console.error('Error fetching employee data:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const getEmployeeData = async (req, res, next) => {
  try {
    const employeeID = req.params.userID;

    const employee = await Employee.findOne({
      userID:employeeID,
    });

    // Check if employee is found
    if (employee) {
      res.json({
        success: true,
        data: employee,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Employee not found',
      });
    }
  } catch (error) {
    console.error('Error fetching employee data:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const terminateEmployee = async (req, res) => {
  try {
    const userID = req.params.userID;

    // Find the employee by userID and update isActive to false
    const updatedEmployee = await Employee.findOneAndUpdate(
      { userID: userID },
      { isActive: false },
      { new: true } // Return the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee terminated successfully', employee: updatedEmployee });
  } catch (err) {
    console.error('Error terminating employee:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



module.exports = {
  generateEmployeeID,
  storeEmployee,
  checkAllFields,
  ValidateData,
  getEmployeesDatas,
  getEmployeeData,
  terminateEmployee
};
