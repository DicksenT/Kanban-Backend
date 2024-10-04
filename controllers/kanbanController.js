const model = require('../model/boardModel')


const getData = async(req,res) =>{
    const kanban = await model.find({})
    if(kanban){
        return res.status(200).json(kanban)
    }
    res.status(400).json({error: 'error'})
}

const createData = async(req,res) =>{
    console.log('past here');
    
    const {name, columns} = req.body
    try{
        const workout = await model.create({name, columns})
        res.status(200).json(workout)
    }catch(error){
        res.status(400).json({mssg: 'here'})
        
    }
    
}

const deleteData = async(req,res)=>{
    const {id} = req.params

    const workout = await model.findByIdAndDelete({_id:id})
    if(!workout){
        return res.status(400).json('None')
    }
    res.status(200).json(workout)
}

module.exports = {createData, deleteData, getData}