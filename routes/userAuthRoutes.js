const express = require('express')
const router = express.Router()
const {loginCheck, getData} = require('../controllers/userControlller')
const auth = require('../middleware/requireAuth')

router.use(auth)
router.get('/loginCheck', loginCheck)
router.get('/getData', getData)

module.exports = router