const mongoose = require('mongoose')
const schema = mongoose.Schema


const subtaskSchema = new schema({
    taskid:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'Task'},
    title:{type:String, required:true},
    isCompleted:{type:Boolean, required:true}
})

const handleDelete = async function(next){
    const Task = require('./taskModel')
    try{
        if(this instanceof mongoose.Query){
            const filter = this.getQuery()
            await Task.updateOne(
                {_id: filter.taskid},
                {$pull:{subtasks:filter._id}}
            )
        }
        else{
            await Task.updateOne(
                {_id:this.taskid},
                {$pull:{subtasks:this._id}}
            )
        }
        next()
    }catch(error){
        next(error)
    }
}

subtaskSchema.pre('deleteMany', handleDelete)
subtaskSchema.pre('remove', handleDelete)
subtaskSchema.pre('findOneAndDelete', handleDelete)

module.exports = mongoose.model('Subtask', subtaskSchema)