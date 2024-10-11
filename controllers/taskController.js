const Task = require('../model/taskModel')
const Subtask = require('../model/subtaskModel')

const addTask = async(req,res) =>{
    const {colId, newTask, subtasks} = req.body
    try{
        const task = new Task({
            columnId: colId,
            title:newTask.title,
            description:newTask.description,
            status:newTask.status
        })
        await task.save()
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


        const returnTask = await Task.findById(task._id).populate('subtasks')
        res.status(200).json(returnTask)
    }catch(error){
        res.status(400).json(error)
    }
}

const editTask = async(req,res) =>{
    const {id} = req.params
    const {task, subtasks} = req.body

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).jsoN({mssg: 'Id is not valid'})
    }
    try{
        const updatedTask = await Task.findByIdAndUpdate(id,
            {
                title:task.title,
                description:task.description,
                status: task.status,
            },
            {new:true}
        )

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
        res.status(200).json(returnTask)
    }catch(error){
        res.status(400).json(error)
    }
}


const delTask = async(req,res) =>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).jsoN({mssg: 'Id is not valid'})
    }
    try{
        await Task.findByIdAndDelete(id)
        res.status(200).json({mssg:'Task Successfully deleted'})
    }catch(error){
        res.status(400).json(error)
    }
}


module.exports = {addTask, editTask, delTask}