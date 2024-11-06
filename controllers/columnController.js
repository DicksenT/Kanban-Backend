const Column = require('../model/columnModel')
const Board = require('../model/boardModel')

const addColumn = async(req,res) =>{
    const userId = req.user.id
    const {boardId, name} = req.body

    try{
    const col = new Column({boardId, name})
    await col.save()

    const board = Board.updateOne({_id:boardId, userId: userId},{$push:{columns:col._id}})
    if(!board){
        return res.status(400).json({mssge: 'Board not found or unauthorized'})
    }
    return res.status(200).json(col)
    }catch(error){
        return res.status(400).json(error)
    }

}

const deleteColumn = async(req, res) =>{
    const userId = req.user.id
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({mssg: 'Id is not valid'})
    }

    try{
        const col = await Column.findById(id)
        if(!col){
            return res.status(400).json('col not found')
        }
        const board = await Board.findOne({_id: col.boardId, userId: userId})
        if(!board){
            return res.status(400).json({mssg: 'unauthorized access to this board'})
        }
        await col.remove()
        return res.status(200).json(col)
    }catch(error){
        return res.status(400).json(error)
    }
}

module.exports = {addColumn, deleteColumn}