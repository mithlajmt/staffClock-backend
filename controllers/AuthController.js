const Employee = require("./../models/Employees");

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

    const employee = new Employee({
      name,
      dateOfBirth,
      salary,
      email,
      contactNumber,
      gender,
      password,
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
