const express = require('express');
const router = express.Router()
const {checkAllFields, AuthoriseUser}=require('./../controllers/AuthController')

router.post('/login',[
    checkAllFields,
    AuthoriseUser
]);

module.exports = router