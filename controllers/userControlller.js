const User = require('../model/userModel')
const jwt = require('jsonwebtoken')


//to create jwt
const createToken = (id) =>{
    return jwt.sign({id}, process.env.SECRET, {expiresIn: '1d'})
}

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

const userSignUp = async(req,res) =>{
    const {email, password} = req.body

    try{
        const newuser = await User.signUp(email, password)
        const token = createToken(newuser._id)
        res.status(200).json({email, token})
    }catch(error){
        res.status(400).json(error)
    }
}

const userLogin = async(req,res) =>{
    const {email, password} = req.body

    try{
        const user = User.userLogin(email,password)
        const token = createToken(user._id)
        res.status(200).json(user, token)
    }catch(error){
        res.status(400).json(error)
    }
}

module.exports = {getData, userSignUp, userLogin}