const express = require('express')
const router = express.Router()

const {createData, deleteData, getData} = require('../controllers/kanbanController')

router.get('/', getData)
//feth data for each board
router.post('/', createData)

//delete board
router.delete('/:id', deleteData)

module.exports = router