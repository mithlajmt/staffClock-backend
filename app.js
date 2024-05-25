const express = require('express');
const  mongoose = require('mongoose');
const app = express()
require('dotenv').config()

const port = process.env.port || 3000
const mongoDBUrl = process.env.MONGODB_URL


mongoose.connect(mongoDBUrl)
.then(()=>{
    console.log('connected to database')
    app.listen(port,()=>{
        console.log(`server is running on ${port}`)
    })
})

.catch(err=>console.log(err))


