const mongoose = require('mongoose')
const Schema = mongoose.Schema


const boardScheme = new Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    name:{
        type:String,
        required:true
    },
    columns:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Column'
    }],
    totalTask:{
        type:Number
    }
})

//if board got remove, this function make sure to also delete column collection
//run before the hooks run
const handleDelete = async function(next){
    const User = require('./userModel')
    const Column = require('./columnModel')
    const Task = require('./taskModel')
    const Subtask = require('./subtaskModel')

    try{
        if(this instanceof mongoose.Query){
            const filter = this.getQuery()
            const columns = await Column.find({boardId: filter._id})
            //extract only the _id since $in only accept array of _id
            const columnId = columns.map((col) => col._id)

            const tasks = await Task.find({columnId: {$in: columnId}})
            const taskId = tasks.map((task) => task._id)


            
            await Promise.all([
                Column.deleteMany({boardId: filter._id}),
                Task.deleteMany({columnId: {$in: columnId}}),
                Subtask.deleteMany({taskid: {$in: taskId}}),
                User.updateOne(
                    {_id: filter.userId},
                    {$pull: {boards: filter._id}}
                )
            ])
   
        }
        else{
            const columns = await Column.find({boardId: this._id})
            const columnId = columns.map((column) => column._id)
    
            const tasks = await Task.find({columnId: {$in: columnId}})
            const taskId = tasks.map((task) =>task._id)
            
            await Promise.all([
                Column.deleteMany({boardId: this._id}),
                Task.deleteMany({columnId: {$in: columnId}}),
                Subtask.deleteMany({taskid: {$in: taskId}}),
                User.updateOne(
                    {_id: this.userId},
                    {$pull: {boards: this._id}}
                )
            ])
        }
        next()
    }catch(error){
        next(error)
    }

}

boardScheme.pre('deleteMany', handleDelete)
boardScheme.pre('remove', handleDelete)
boardScheme.pre('findOneAndDelete', handleDelete)

module.exports = mongoose.model('Board', boardScheme)
