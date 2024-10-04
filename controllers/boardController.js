const Board = require('../model/boardModel')
const Column = require('../model/columnModel')
const mongoose = require('mongoose')

const addBoard = async(req,res) =>{
    const {userId, name, columns} = req.body
    const newBoard = new Board({userId,name})
    await newBoard.save()

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