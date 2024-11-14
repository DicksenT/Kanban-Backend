const mongoose = require('mongoose')
const scheme = mongoose.Schema

const columnScheme = new scheme({
    boardId:{type:mongoose.Schema.Types.ObjectId, required:true,ref:'Board'},
    name:{type:String, required:true},
    tasks:[{type:mongoose.Schema.Types.ObjectId, ref:'Task'}]
})


const handleColumnDelete = async function(next) {
    const Board = require('./boardModel')
    const Task = require('./taskModel')
    const Subtask = require('./subtaskModel')

    try{
        //need to make sure the "this" since deleteMany is interact with database
        if(this instanceof mongoose.Query){
            const filter = this.getQuery()
            const tasks = await Task.find({columnId: filter._id})
            const taskId = tasks.map((task) => task._id) 
            await Promise.all([
                Task.deleteMany({columnId:filter._id}),
                Subtask.deleteMany({taskid: {$in: taskId}}),
                Board.updateOne(
                    {_id: filter.boardId},
                    {$pull:{columns: filter._id}}
                )
            ])
      
        }
        else{
            const tasks = await Task.find({columnId: this._id})
            const taskId = tasks.map((task) => task._id)
            
            await Promise.all([
                Task.deleteMany({columnId:this._id}),
                Subtask.deleteMany({taskid: {$in: taskId}}),
                Board.updateOne(
                    {_id: this.boardId},
                    {$pull:{columns: this._id}}
                )
            ])
        }

        next()
    }
    catch(error){
        next(error)
    }
}

columnScheme.pre('deleteMany', handleColumnDelete)
columnScheme.pre('remove', handleColumnDelete)
columnScheme.pre('findOneAndDelete', handleColumnDelete)
module.exports = mongoose.model('Column', columnScheme)
