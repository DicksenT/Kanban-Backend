const Task = require('../model/taskModel')
const Subtask = require('../model/subtaskModel')
const Column = require('../model/columnModel')
const Board = require('../model/boardModel')
const mongoose = require('mongoose')

const addTask = async(req,res) =>{
    const userId = req.user.id
    const {colId, newTask, subtasks} = req.body
    if(!mongoose.Types.ObjectId.isValid(colId)){
        return res.status(400).json({mssg: 'id is not valid'})
    }
    try{
        const col = await Column.findById(colId)
        if(!col){
            return res.status(404).json({mssg:'column not available'})
        }
        const board = await Board.findOne({_id:col.boardId, userId:userId})
        if(!board){
            return res.status(404).json({mssg: 'Board is not found or unauthorized'})
        }
    
        const task = new Task({
            columnId: colId,
            title:newTask.title,
            description:newTask.description
        })
        if(subtasks){
            const newSubtasks = await Promise.all(subtasks.map(async(subtask) =>{
                const newsubtask = new Subtask({
                    taskid:task._id,
                    title:subtask.title,
                    isCompleted:false
                })
                await newsubtask.save()
                return newsubtask._id
            }))
            task.subtasks = newSubtasks
        }

        await task.save()
        col.tasks.push(task._id)
        await col.save()
        const returnTask = await task.populate('subtasks')
        return res.status(200).json(returnTask)
    }catch(error){
        return res.status(400).json(error)
    }
}

const editTask = async(req,res) =>{
    const userId = req.user.id
    const {id} = req.params
    const {newTask, subtasks} = req.body

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).jsoN({mssg: 'Id is not valid'})
    }

    try{
        const updatedTask = await Task.findById(id)
        if(!updatedTask){
            return res.status(400).json({mssg: 'Task not found'})
        }
        const col = await Column.findOne({_id: updatedTask.columnId})
        if(!col){
            return res.status(400).json({mssg: 'col is not found'})
        }
        const board = await Board.findOne({_id: col.boardId, userId:userId})
        if(!board){
            return res.status(401).json({mssg: 'Board not found or user unauthorized'})
        }
        updatedTask.title = newTask.title
        updatedTask.description = newTask.description

        if(subtasks){
            const newSubtask = []
            const oldSubtask = []

            subtasks.forEach((subtask) =>{
                if(subtask._id){
                    oldSubtask.push(subtask._id)
                }
                else{
                    newSubtask.push(subtask)
                }
            })

            const newlyCreateedSubtask = await Promise.all(newSubtask.map(async(subtask) =>{
                const newSub = new Subtask({
                    taskid:id,
                    title:subtask.title,
                    isCompleted: false
                })
                await newSub.save()
                return newSub._id
            }))

            const updatedSubtask = oldSubtask.concat(newlyCreateedSubtask)

            const subtaskToDelete = updatedTask.subtasks.filter((subtask) => !updatedSubtask.includes(subtask.toString()))

            await Promise.all(subtaskToDelete.map(async(subtask) =>{
                await Subtask.findByIdAndDelete(subtask)
            }))


            updatedTask.subtasks=updatedSubtask
            
        }
        await updatedTask.save()

        const returnTask = await updatedTask.populate('subtasks')
        return res.status(200).json(returnTask)
    }catch(error){
        return res.status(400).json(error)
    }
}


const delTask = async(req,res) =>{
    const userId = req.user.id
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({mssg: 'Id is not valid'})
    }
    try{
        const updatedTask = await Task.findById(id)
        if(!updatedTask){
            return res.status(400).json({mssg: 'Task not found'})
        }
        const col = await Column.findOne({_id: updatedTask.columnId})
        if(!col){
            return res.status(400).json({mssg: 'col is not found'})
        }
        const board = await Board.findOne({_id: col.boardId, userId:userId})
        if(!board){
            return res.status(401).json({mssg: 'Board not found or user unauthorized'})
        }
        await Task.findByIdAndDelete(id)
        return res.status(200).json({mssg:'Task Successfully deleted'})
    }catch(error){
        return res.status(400).json(error)
    }
}


const changeSubtask = async(req, res) =>{
    const userId = req.user.id
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({mssg: 'id is not valid'})
    }
    try{
        const subtask = await Subtask.findById(id)
        if(!subtask){
            return res.state(400).json({mssg: 'not found'})
        }
        const updatedTask = await Task.findById(subtask.taskid)
        if(!updatedTask){
            return res.status(400).json({mssg: 'Task not found'})
        }
        const col = await Column.findOne({_id: updatedTask.columnId})
        if(!col){
            return res.status(400).json({mssg: 'col is not found'})
        }
        const board = await Board.findOne({_id: col.boardId, userId:userId})
        if(!board){
            return res.status(401).json({mssg: 'Board not found or user unauthorized'})
        }
        subtask.isCompleted = !subtask.isCompleted
        await subtask.save()
        return res.status(200).json(subtask)
    }catch(error){
        return res.status(400).json({mssg: error + 'error please check'})
    }
    
}


const changeStatus = async(req,res) =>{
    const {id} = req.params
    const {newCol} = req.body
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({mssg: 'id is not valid'})
    }
    try{
    //verifying task and all related collection until board,
    const task = await Task.findById(id)
    if(!task){
        return res.status(400).json({mssg: 'Task not found'})
    }
    const col = await Column.findOne({_id: task.columnId})
    if(!col){
        return res.status(400).json({mssg: 'col is not found'})
    }
    const board = await Board.findOne({_id: col.boardId, userId:userId})
    if(!board){
        return res.status(401).json({mssg: 'Board not found or user unauthorized'})
    }
        //removing taskId from old column
        await Column.updateOne({_id:col._id},{$pull:{tasks: task._id}})

        //set new column id in task
        task.columnId = newCol
        await task.save()

        //add task id to new column
        await Column.updateOne({_id: newCol}, {$push:{tasks: task._id}})


        const returnTask = await task.populate('subtasks')
        return res.status(200).json(returnTask)
    }catch(error){
        return res.status(400).json(error)
    }
}


module.exports = {addTask, editTask, delTask, changeSubtask, changeStatus}