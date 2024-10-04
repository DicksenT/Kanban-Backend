const mongoose = require('mongoose')
const scheme = mongoose.Schema

const taskScheme = new scheme({
    columnId:{type:mongoose.Schema.Types.ObjectId, required:true,ref:'Columns'},
    title:{type:String, required:true},
    description:{type:String},
    status:{type:String, required:true},
    subtasks:[{type:mongoose.Schema.Types.ObjectId, ref:'Subtasks'}]
})

module.exports = mongoose.model('Tasks', taskScheme)
