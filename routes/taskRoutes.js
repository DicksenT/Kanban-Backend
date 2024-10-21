const express = require('express')
const router = express.Router()
const {addTask, editTask, delTask} = require('../controllers/taskController')
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)
router.post('/:id', addTask)
router.patch('/:id', editTask)
router.delete('/:id', delTask)

module.exports =router