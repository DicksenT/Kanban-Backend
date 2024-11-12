const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./userModel')
const Column = require('./columnModel')

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
    try{
        if(this instanceof mongoose.Query){
            const filter = this.getQuery()
            await Column.deleteMany(filter._id)
            await User.updateOne(
                {_id: filter._id},
                {$pull: {boards: filter._id}}
            )
        }
        else{
            await Column.deleteMany(this._id)
            await User.updateOne(
                {_id: this.userId},
                {$pull:{boards: this._id}}
            )
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
