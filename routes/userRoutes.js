const express = require('express')
const router = express.Router()
const {userSignUp, userLogin} = require('../controllers/userControlller')

router.post('/login', userLogin)
router.post('/signup', userSignUp)

module.exports = router