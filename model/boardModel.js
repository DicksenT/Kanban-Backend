const mongoose = require('mongoose')
const schema = mongoose.Schema
const User = require('./userModel')
const Column = require('./columnModel')

const boardScheme = new schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    name:{
        type:String,
        required:true
    },
    columns:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Column'
    }]
})

//if board got remove, this function make sure to also delete column collection
//run before the hooks run
boardScheme.pre('remove', async function(next){
    try{
        await Column.deleteMany({boardId:  this._id})
        //make sure pull out the reference of board on User when board deleted
        await User.updateOne(
            {_id: this.userId},
            {$pull: {boards:this._id}}
        )
        next()
    }catch(error){
        next(error)
    }
})

module.exports = mongoose.model('Board', boardScheme)
