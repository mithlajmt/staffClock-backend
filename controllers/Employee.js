const Employee = require("./../models/Employees");
const bcrypt = require('bcrypt');

const storeEmployee = async (req, res) => {
  try {
    const {
      name,
      dateOfBirth,
      salary,
      email,
      contactNumber,
      gender,
      password,
      role,
      userID,
    } = req.body;

    const saltRound = 10
    const hashedPass = await bcrypt.hash(password,saltRound)

    const employee = new Employee({
      name,
      dateOfBirth,
      salary,
      email,
      contactNumber,
      gender,
      password:hashedPass,
      role,
      userID,
    });

    await employee.save();
    res.json({
      message: "admin Added SuccessFully",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  storeEmployee,
};
