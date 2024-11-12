const mongoose = require('mongoose')
const scheme = mongoose.Schema

const taskScheme = new scheme({
    columnId:{type:mongoose.Schema.Types.ObjectId, required:true,ref:'Columns'},
    title:{type:String, required:true},
    description:{type:String},
    subtasks:[{type:mongoose.Schema.Types.ObjectId, ref:'Subtask'}]
})

const handleTaskDelete = async function(next){
    const Subtask = require('./subtaskModel')
    const Column = require('./columnModel')

    try{
        if(this instanceof mongoose.Query){
            const filter = this.getQuery()
            await Subtask.deleteMany({taskid:filter._id})
            await Column.updateOne(
                {_id: filter.columnId},
                {$pull:{tasks: filter._id}}
            )
        }
        else{
            await Subtask.deleteMany({taskId: this._id})
            await Column.updateOne(
                {_id: this.columnId},
                {$pull:{tasks:this._id}}
            )
        }
        next()
    }catch(error){
        next(error)
    }
}

taskScheme.pre('deleteMany', handleTaskDelete)
taskScheme.pre('remove', handleTaskDelete)
taskScheme.pre('findOneAndDelete', handleTaskDelete)

module.exports = mongoose.model('Task', taskScheme)
