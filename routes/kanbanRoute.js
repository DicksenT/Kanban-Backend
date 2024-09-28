const express = require('express')
const router = express.Router()

const {createData, deleteData} = require('../controllers/kanbanController')


//feth data for each board
router.post('/', createData)

//delete board
router.get('/:id', deleteData)

module.exports = router