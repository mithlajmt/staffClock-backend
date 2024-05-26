const express = require("express");
const mongoose = require("mongoose");
const Auth = require('./routes/Auth');
const employee = require('./routes/employee')
const app = express();
const cors = require('cors');
require("dotenv").config();

const port = process.env.port || 3000;
const mongoDBUrl = process.env.MONGODB_URL;
app.use('/',express.json())

app.use(cors())
mongoose
  .connect(mongoDBUrl)
  .then(() => {
    console.log("connected to database");
    app.listen(port, () => {
      console.log(`server is running on ${port}`);
    });
  })
  .catch((err) => console.log(err));

app.use('/Auth',Auth)
app.use('/admin',employee)
