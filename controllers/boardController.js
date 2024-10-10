const Board = require('../model/boardModel')
const Column = require('../model/columnModel')
const mongoose = require('mongoose')

const addBoard = async(req,res) =>{
    const {userId, name, columns} = req.body
    try{
        const newBoard = new Board({userId,name})
        await newBoard.save()

        if(columns){
            const newColumns = await Promise.all(columns.map(async (column) =>{
                const newCol = new Column({
                    boardId: newBoard._id,
                    name: column
                })
                await newCol.save()
                return newCol._id
            }))

            newBoard.columns = newColumns
            await newBoard.save()
        }
        res.status(200).json(newBoard)
    }catch(error){
        res.status(400).json(error)
    }
}


//
const editBoard = async(req,res) =>{
    const {id} = req.params
    const {name, columns} = req.body

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).jsoN({mssg: 'Id is not valid'})
    }

    try{
        const updatedBoard = await Board.findByIdAndUpdate(id,
            {name:name},
            {new: true}
        )
        if(!updatedBoard){
            res.status(400).json({mssg:'Board Not Found'})
        }
        if(columns){
            const oldCol = []
            const newCol = []

            columns.forEach((col) =>{
                if(col._id){
                    oldCol.push(col._id)
                }

                else{
                    newCol.push(col)
                }
            })

            const newCreatedColumn = await Promise.all(newCol.map(async(col) =>{
                const newColumn = new Column({
                    boardId: id,
                    name:col.name
                })
                await newColumn.save()
                return newColumn._id
            }))

            const updatedColumns = oldCol.concat(newCreatedColumn)


            const columnsToDelete = updatedBoard.columns.filter((col) => !updatedColumns.includes(col.toString()))

            await Promise.all(columnsToDelete.map(async(col) =>{
                await Column.findByIdAndDelete(col._id)
            }))
            await Board.findByIdAndUpdate(id,{
                columns:updatedColumns
            })
        }

        
    res.status(200).json({mssg: 'Board successfully updated'})
        
    }catch(error){
        res.status(400).json(error)
    }

}

const delBoard = async(req,res) =>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).jsoN({mssg: 'Id is not valid'})
    }
    try{
        await Board.findByIdAndDelete(id)
        res.status(200).json({mssg: 'Board deleted successfully'})
    }catch(error){
        res.status(400).json(error)
    }
}

module.exports = {addBoard, editBoard, delBoard}