const express = require('express');
const router = express.Router()
const {checkAllFields, AuthoriseUser,getUserData}=require('./../controllers/AuthController')
const {checkToken}=require('./../utilities/jwt')

router.post('/login',[
    checkAllFields,
    AuthoriseUser
]);

router.get('/user',[
    checkToken,
    getUserData,
])

module.exports = router