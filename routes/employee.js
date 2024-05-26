const express = require('express');
const router = express.Router();
const {storeEmployee} = require('./../controllers/Employee')

router.post('/employee',[
    storeEmployee,
]);

module.exports = router;
