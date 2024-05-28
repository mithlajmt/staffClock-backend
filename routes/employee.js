const express = require('express');
const router = express.Router();
const {
     generateEmployeeID,
    storeEmployee,
    checkAllFields,
    ValidateData,
    getEmployeesDatas,
    getEmployeeData,
    terminateEmployee,
} = require('./../controllers/Employee')

router.post('/employee',[
    checkAllFields,
    ValidateData,
    generateEmployeeID,
    storeEmployee,
]);

router.get('/employee',[
    getEmployeesDatas,
])

router.get('/employee/:userID',[
    getEmployeeData,
])


router.delete('/employee/:userID',[
    terminateEmployee,
])

module.exports = router;
