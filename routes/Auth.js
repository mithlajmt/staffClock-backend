const express = require('express');
const router = express.Router()
const {checkAllFields, AuthoriseUser,getUserData,checkUserLog}=require('./../controllers/AuthController')
const {checkToken}=require('./../utilities/jwt')

router.post('/login',[
    checkUserLog,
    checkAllFields,
    AuthoriseUser
]);

router.get('/user',[
    checkToken,
    getUserData,
])

module.exports = router