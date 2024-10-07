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
    const {boardId, name, columns} = req.body
    try{
        const editBoard = await Board.findByIdAndUpdate(id,{
            name:name
        })
        const editColumns = await Promise.all(columns.map(async(column) =>{
            const col = await Column.findById(column._id)
            if(col){
                return col._id
            }
            const newCol = new Column({
                boardId: boardId,
                name:column.name
            })
            await newCol.save()
            return newCol._id
        }))
        editBoard.columns.map(async(col) =>{
            if(!editColumns.includes(col._id)){
                const delCol = await Column.findById(col._id)
            }
        })
    }catch(error){
        res.status(400).json(error)
    }

}