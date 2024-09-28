const model = require('../model/kanbanModel')


const createData = async(req,res) =>{
    console.log('past here');
    
    const {boardName, boardColumn} = req.body
    try{
        const workout = await model.create({boardName, boardColumn})
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

module.exports = {createData, deleteData}