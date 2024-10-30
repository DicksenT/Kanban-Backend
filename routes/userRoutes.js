const express = require('express')
const router = express.Router()
const {userSignUp, userLogin, refreshToken} = require('../controllers/userControlller')

router.post('/login', userLogin)
router.post('/signup', userSignUp)
router.get('/refreshToken', refreshToken)
module.exports = router