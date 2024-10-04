const mongoose = require('mongoose')
const scheme = mongoose.Schema

const userScheme = new scheme({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true, unique:true},
    boards:[{type:mongoose.Schema.Types.ObjectId}]
})


module.exports = mongoose.model('User', userScheme)