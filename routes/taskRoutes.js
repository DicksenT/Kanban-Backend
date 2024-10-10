const express = require('express')
const router = express.Router
const {addTask, editTask, delTask} = require('../controllers/taskController')
const { deleteColumn } = require('../controllers/columnController')

router.post('/:id', addTask)
router.patch('/:id', editTask)
router.delete('/:id', deleteColumn)