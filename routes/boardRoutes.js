const express = require('express')
const router = express.Router()
const {addBoard, editBoard, delBoard} = require('../controllers/boardController')

router.post('/', addBoard)
router.patch('/:id', editBoard)
router.delete('/:id', delBoard) 

module.exports = router