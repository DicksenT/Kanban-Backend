const Task = require('../model/taskModel')
const Subtask = require('../model/subtaskModel')
const Column = require('../model/columnModel')
const Board = require('../model/boardModel')

const addTask = async(req,res) =>{
    const userId = req.user.id
    const {colId, newTask, subtasks} = req.body
    const col = await Column.find(colId)
    if(!col){
        return res.status(401).json({mssg:'column not available'})
    }
    const board = await Board.find({_id:col.boardId, userId:userId})
    if(!board){
        return res.state(401).json({mssg: 'Board is not found or unauthorized'})
    }
    try{
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
        const returnTask = await Task.findById(task._id).populate('subtasks')
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
        const updatedTask = await Task.find(id)
        if(!updatedTask){
            return res.status(400).json({mssg: 'Task not found'})
        }
        const col = await Column.find({_id: updatedTask.columnId})
        if(!col){
            return res.status(400).json({mssg: 'col is not found'})
        }
        const board = await Board.find({_id: col.boardId, userId:userId})
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

            const subtaskToDelete = updatedTask.subtasks.map(
                (subtask) => !updatedSubtask.includes(subtask.toString())
            )

            await Promise.all(subtaskToDelete.map(async(subtask) =>{
                await Subtask.findByIdAndDelete(subtask)
            }))

            await Task.findByIdAndUpdate(id,{
                subtasks:updatedSubtask
            })
        }

        const returnTask = await Task.findById(id).populate('subtasks')
        return res.status(200).json(returnTask)
    }catch(error){
        return res.status(400).json(error)
    }
}


const delTask = async(req,res) =>{
    const userId = req.user.id
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).jsoN({mssg: 'Id is not valid'})
    }
    try{
        const task = await Task.find({_id:id})
        if(!task){
            return res.status(400).json({mssg: 'Task not found'})
        }
        const col = await Column.find({_id:task.columnId})
        if(!col){
            return res.status(400).json({mssg: 'Column not  found'})
        }
        const board = await Board.find({_id: col.boardId, userId: userId})
        if(!board){
            return res.status(400).json({mssg: 'Board Not Found or User unauthorized'})
        }
        await task.remove()
        return res.status(200).json({mssg:'Task Successfully deleted'})
    }catch(error){
        return res.status(400).json(error)
    }
}


module.exports = {addTask, editTask, delTask}