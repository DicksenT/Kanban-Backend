const express = require('express')
const router = express.Router()
const {addTask, editTask, delTask, changeSubtask, changeStatus} = require('../controllers/taskController')
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)
router.post('/addTask', addTask)
router.patch('/editTask/:id', editTask)
router.patch('/changeSubtask/:id', changeSubtask)
router.patch('/changeStatus/:id', changeStatus)
router.delete('/:id', delTask)

module.exports =router