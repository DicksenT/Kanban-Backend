const express = require('express')
const router = express.Router
const {addColumn,deleteColumn} = require('../controllers/columnController')

router.post('/:id', addColumn)
router.delete('/:id', deleteColumn)

module.exports = router