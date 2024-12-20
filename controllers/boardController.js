const Board = require('../model/boardModel')
const Column = require('../model/columnModel')
const User = require('../model/userModel')
const mongoose = require('mongoose')

const addBoard = async(req,res) =>{
    const userId = req.user.id
    const {name, columns} = req.body
    try{
        const newBoard = new Board({userId, name, totalTask:0})
        if(columns){
            const newColumns = await Promise.all(columns.map(async (column) =>{
                const newCol = new Column({
                    boardId: newBoard._id,
                    name: column.name
                })
                await newCol.save()
                return newCol._id
            }))

            newBoard.columns = newColumns
        }
        await newBoard.save()
        await User.updateOne({_id:userId}, {$push:{boards:newBoard._id}})
        const returnBoard = await newBoard.populate('columns')
        return res.status(200).json(returnBoard)
    }catch(error){
        console.log(error);
        
        return res.status(400).json(error)
    }
}


//
const editBoard = async(req,res) =>{
    const userId = req.user.id
    const {id} = req.params
    const {name, columns} = req.body

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({mssg: 'Id is not valid'})
    }

    try{
        const updatedBoard = await Board.findOne({_id: id, userId:userId})
        if(!updatedBoard){
           return res.status(400).json({mssg:'Board Not Found'})
        }
        updatedBoard.name = name
        //check if columns available
        if(columns){
            const oldCol = []
            const newCol = []


            //separate old column and new column
            columns.forEach((col) =>{
                if(col._id){
                    oldCol.push(col._id)
                }

                else{
                    newCol.push(col)
                }
            })

            //create new Column for newCol array
            const newCreatedColumn = await Promise.all(newCol.map(async(col) =>{
                const newColumn = new Column({
                    boardId: id,
                    name:col.name
                })
                await newColumn.save()
                return newColumn._id
            }))

            //combine old and newly created columns
            const updatedColumns = oldCol.concat(newCreatedColumn)

            //filter out to find which column to deleted
            const columnsToDelete = updatedBoard.columns.filter((col) => !updatedColumns.includes(col.toString()))

            await Promise.all(columnsToDelete.map(async(col) =>{
                await Column.findByIdAndDelete(col._id)
            }))

            //replace all boardcolumn with updated one
            updatedBoard.columns = updatedColumns
        }
    
    await updatedBoard.save()
    //return the board, make sure to populate since it going to replace data in reducer
    const returnBoard = await updatedBoard.populate({
        path:'columns',
        populate:{
            path:'tasks',
            populate: {
                path:'subtasks'
            }
        }
    })
    return res.status(200).json(returnBoard)
        
    }catch(error){
        return res.status(400).json(error)
    }

}

const delBoard = async(req,res) =>{
    const userId = req.user.id
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({mssg: 'Id is not valid'})
    }
    try{
        const deletedBoard =await Board.findOneAndDelete({_id:id, userId:userId})
        if(!deletedBoard){
            return res.status(400).json({mssg:'Board is not found or not authorized'})
        }
        return res.status(200).json({mssg: 'Board deleted successfully'})
    }catch(error){
        return res.status(400).json(error)
    }
}

module.exports = {addBoard, editBoard, delBoard}