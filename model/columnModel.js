const mongoose = require('mongoose')
const scheme = mongoose.Schema
const Board = require('./boardModel')
const Task = require('./taskModel')

const columnScheme = new scheme({
    boardId:{type:mongoose.Schema.Types.ObjectId, required:true,ref:'Board'},
    name:{type:String, required:true},
    tasks:[{type:mongoose.Schema.Types.ObjectId, ref:'Task'}]
})


const handleColumnDelete = async function(next) {
    try{
        //need to make sure the "this" since deleteMany is interact with database
        if(this instanceof mongoose.Query){
            const filter = this.getQuery()
            await Task.deleteMany({columnId:filter._id})
            await Board.updateOne(
                {_id: filter.boardId},
                {$pull:{columns: filter._id}}
            )
        }
        else{
            await Task.deleteMany({columnId:this._id})

            //to remove the reference in board
            await Board.updateOne(
                {_id: this.boardId},
                {$pull:{columns:this._id}}

            )
        }

        next()
    }
    catch(error){
        next(error)
    }
}

columnScheme.pre('deleteMany', handleColumnDelete)

columnScheme.pre('remove', handleColumnDelete)

module.exports = mongoose.model('Column', columnScheme)
