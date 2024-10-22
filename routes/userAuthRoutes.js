const express = require('express')
const router = express.Router()
const {loginCheck, refreshToken, getData} = require('../controllers/userControlller')
const auth = require('../middleware/requireAuth')

router.use(auth)
router.get('/loginCheck', loginCheck)
router.get('/refreshToken', refreshToken)
router.get('/getData', getData)

module.exports = router