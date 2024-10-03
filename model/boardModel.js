const mongoose = require('mongoose')
const schema = mongoose.Schema

const boardScheme = new schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    name:{
        type:String,
        required:true
    },
    columns:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Column'
    }
})

module.exports = mongoose.model('Board', boardScheme)
