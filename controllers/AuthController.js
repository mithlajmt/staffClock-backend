const Employee = require("./../models/Employees");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Correct dotenv config
const client = require('./../utilities/redis');
const crypto = require('crypto')

// Middleware for checking if all fields are provided


const checkUserLog = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (token) {
    return res.status(400).json({
      success: false,
      message: "User already logged in",
    });
  }
  next();
};

const checkAllFields = async (req, res, next) => {
  try {
    const { userID, password } = req.body;
    if (!userID || !password) {
      return res.status(400).json({
        success: false,
        message: "UserID and Password are required",
      });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Authorise user on login
const AuthoriseUser = async (req, res) => {
  try {
    const { userID, password } = req.body;
    console.log(userID,password)
    const user = await Employee.findOne({ userID });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Doesn't Exist",
      });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password Doesn't Match. Please Try Again",
      });
    }

    const payload = {
      userID: user.userID,
      role: user.role,
      name: user.name,
    };

    // Sign the JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '4h' });

    //creating secured random id for creating secretId for storing token
    const randomString = crypto.randomBytes(16).toString('hex');
    const randomNumber = Math.floor(Math.random() * 10000);
    const secretID = `${user.name}-${randomString}-${randomNumber}`;

    //storing secretID in redis
    await client.set(secretID, token);


    res.status(200).json({
      success: true,
      message: "User authorised successfully",
      role:user.role,
      token:secretID,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};


const getUserData = async (req, res) => {
  try {
    const { role,userID } = req.user;
    console.log(role);

    res.status(200).json({
      success: true,
      data: {
        role: role,
        userID:userID,
      },
    });
  } catch (err) {
    console.error("Error retrieving user data:", err);

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving user data. Please try again later.',
    });
  }
}


module.exports = {
  checkUserLog,
  checkAllFields,
  AuthoriseUser,
  getUserData,
};
