const mongoose = require('mongoose')
const scheme = mongoose.Schema

const subtaskSchema = new scheme({
    taskid:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'Tasks'},
    title:{type:String, required:true},
    isCompleted:{type:Boolean, required:true}
})

module.exports = mongoose.model('Subtasks', subtaskSchema)