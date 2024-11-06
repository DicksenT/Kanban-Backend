const Task = require('../model/taskModel')
const Subtask = require('../model/subtaskModel')
const Column = require('../model/columnModel')
const Board = require('../model/boardModel')
const mongoose = require('mongoose')

const addTask = async(req,res) =>{
    const userId = req.user.id
    const {colId, newTask, subtasks} = req.body
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({mssg: 'id is not valid'})
    }
    try{
        const col = await Column.findById(colId)
        if(!col){
            return res.status(404).json({mssg:'column not available'})
        }
        const board = await Board.findOne({_id:col.boardId, userId:userId})
        if(!board){
            return res.state(404).json({mssg: 'Board is not found or unauthorized'})
        }
    
        const task = new Task({
            columnId: colId,
            title:newTask.title,
            description:newTask.description,
            status:newTask.status
        })
        
        if(subtasks){
            const newSubtasks = await Promise.all(subtasks.map(async(subtask) =>{
                const newsubtask = new Subtask({
                    taskid:task._id,
                    title:subtask.title,
                    isCompleted:false
                })
                await newsubtask.save()
                return newSubtasks._id
            }))
            task.subtasks.push(...newSubtasks)
        }

        await task.save()
        const returnTask = task.populate('subtasks')
        return res.status(200).json(returnTask)
    }catch(error){
        return res.status(400).json(error)
    }
}

const editTask = async(req,res) =>{
    const userId = req.user.id
    const {id} = req.params
    const {task, subtasks} = req.body

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
        updatedTask.title = task.title
        updatedTask.description = task.description
        updatedTask.status = task.status

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
                    taskId:id,
                    title:subtask.title,
                    description:subtask.description,
                    status:subtask.status
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
        const task = await Task.findById(id).populate({
            path: 'columnId',
            populate:{
                path:'boardId',
                match:{userId: userId},
                select: '_id userId'
            }
        })
        
        await task.remove()
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
        const subtask = await Subtask.findById(id).populate({
            path:'taskId',
            populate:{
                path:'columnId',
                populate:{
                    path:'boardId',
                    match:{userId: userId},
                    select:'_id userId'
                }
            }
        })
        if(!subtask || !subtask.taskid || !subtask.taskid.columnId || !subtask.taskid.columnId.boardId){
            return res.status(404).json({mssg: 'Not Found or unauthorized'})
        }
        subtask.isCompleted = !subtask.isCompleted
        await subtask.save()
        return res.status(200).json(subtask)
    }catch(error){
        return res.status(200).json(error)
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
    const task = await Task.findById(id).populate({
        path:'columnId',
        populate:{
            path:'boardId',
            match:{userId: req.user.id},
            select:'_id, userId'
        }
    })
    if(!task || !task.columnId || !task.columnId.boardId){
        return res.status(404).json({mssg: 'Not Found or unauthorized'})
    }
        //removing taskId from old column
        await Column.updateOne({_id:task.columnId._id},{$pull:{tasks: task._id}})

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