const express = require('express')
const router = express.Router()
const {loginCheck, getData,logOut} = require('../controllers/userControlller')
const auth = require('../middleware/requireAuth')

router.use(auth)
router.get('/loginCheck', loginCheck)
router.get('/getData', getData)
router.delete('/logOut', logOut)

module.exports = router