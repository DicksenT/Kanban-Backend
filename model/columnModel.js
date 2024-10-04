const mongoose = require('mongoose')
const scheme = mongoose.Schema

const columnScheme = new scheme({
    boardId:{type:mongoose.Schema.Types.ObjectId, required:true,ref:'Board'},
    name:{type:String, required:true},
    tasks:[{type:mongoose.Schema.Types.ObjectId, ref:'Tasks'}]
})

module.exports = mongoose.model('Columns', columnScheme)
