const express = require("express");
const mongoose = require("mongoose");
const Auth = require('./routes/Auth')
const app = express();
require("dotenv").config();

const port = process.env.port || 3000;
const mongoDBUrl = process.env.MONGODB_URL;
app.use('/',express.json())
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
