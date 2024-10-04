const User = require('../model/userModel')

const getData = async(req,res) =>{
    const {id} = req.params
    try{
        const user = new User.findById(id)
        .populate({
            path:'boards',
            populate:{
                path:'columns',
                populate:{
                    path:'tasks',
                    populate:{
                        path:'subtasks'
                    }
                }
            }
        })
        res.status(200).json(user)
    }catch(error){
        res.status(400).json({error: 'Error fetch', error})
    }
}

const newUser = async(req,res) =>{
    const {username, email, password} = req.body

    try{
        const newuser = await User.create({username, email, password})
        res.status(200).json(newuser)
    }catch(error){
        res.status(400).json(error)
    }
}

module.exports = {getData, newUser}