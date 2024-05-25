const express = require('express');
const {storeEmployee}= require('./../controllers/AuthController')
const router = express.Router()

router.post('/login',[
    storeEmployee
])

module.exports = router