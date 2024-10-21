const express = require('express')
const router = express.Router()
const {addBoard, editBoard, delBoard} = require('../controllers/boardController')
const requireAuth = require('../middleware/requireAuth')

//verify token first before going further
router.use(requireAuth)

router.post('/addBoard', addBoard)
router.patch('/:id', editBoard)
router.delete('/:id', delBoard) 

module.exports = router