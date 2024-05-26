const express = require('express');
const router = express.Router();
const {
     generateEmployeeID,
    storeEmployee,
    checkAllFields,
    ValidateData,} = require('./../controllers/Employee')

router.post('/employee',[
    checkAllFields,
    ValidateData,
    generateEmployeeID,
    storeEmployee,
]);

module.exports = router;
