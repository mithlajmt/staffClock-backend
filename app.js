// server.js
const express = require("express");
const mongoose = require("mongoose");
const Auth = require('./routes/Auth');
const employee = require('./routes/employee');
const attendanceRoute = require('./routes/attendance'); 
const { checkToken, isAdmin } = require('./utilities/jwt');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const mongoDBUrl = process.env.MONGODB_URL;

app.use(express.json());
app.use(cors());

mongoose
  .connect(mongoDBUrl)
  .then(() => {
    console.log("connected to database");
    app.listen(port, () => {
      console.log(`server is running on ${port}`);
    });
  })
  .catch((err) => console.log(err));

// Define routes
app.use('/attendance', checkToken, attendanceRoute);
app.use('/Auth', Auth);
app.use('/admin', checkToken, isAdmin, employee);
