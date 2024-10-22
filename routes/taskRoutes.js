const express = require('express')
const router = express.Router()
const {addTask, editTask, delTask} = require('../controllers/taskController')
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)
router.post('addTask/:id', addTask)
router.patch('editTask/:id', editTask)
router.delete('deleteTask/:id', delTask)

module.exports =router