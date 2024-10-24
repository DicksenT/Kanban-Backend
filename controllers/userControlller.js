const User = require('../model/userModel')
const jwt = require('jsonwebtoken')


//to create jwt
const createToken = (id) =>{
    return jwt.sign({id}, process.env.SECRET, {expiresIn: '15m'})
}
const createRefreshToken = (id) =>{
    return jwt.sign({id}, process.env.REFRESH_SECRET,{expiresIn: '7d'})
}

const userSignUp = async(req,res) =>{
    
    const {email, password} = req.body
    try{
        const newuser = await User.signUp(email, password)
        const token = createToken(newuser._id)
        res.cookie('token', token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            maxAge:360000,
            sameSite:'strict'
        })
        const refreshToken = createRefreshToken(newuser._id)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        })
        return res.status(200).json(email)
    }catch(error){
        return res.status(400).json(error)
    }
}

const userLogin = async(req,res) =>{
    const {email, password} = req.body
    try{
        const user = User.userLogin(email,password)
        const token = createToken(user._id)
        res.cookie('token', token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            maxAge:360000,
            sameSite:'strict'
        })
        const refreshToken = createRefreshToken(user._id)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        })
        return res.status(200).json(email)
    }catch(error){
        return res.status(400).json(error)
    }
}

//Controller below need auth

//get data
const getData = async(req,res) =>{
    const userId = req.user.id
    try{
        const user = new User.findById(userId)
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
        return res.status(200).json(user)
    }catch(error){
        return res.status(400).json({error: 'Error fetch', error})
    }
}
//refresh token
const refreshToken = (req,res)=>{
    const checkToken = req.cookie.refreshToken
    if(!checkToken){
        return res.status(401).json({mssg: 'Token Expired'})
    }
    const verify = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
    if(!verify){
        return res.status(401).json({mssg:'Invalid Refresh Token'})
    }

    //aslong refresh token still active, generate newToken
    const newToken = createToken(verify)
    // replacing
    res.cookie('token', newToken, {
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
        sameSite: 'strict'
    })
}

const loginCheck = async(req,res) =>{
    const token = req.cookies.token
    if(!token){
        return res.status(400).json('Token Expired')
    }
    try{
        const decode = jwt.verify(token, process.env.SECRET)
        const user = await User.find({_id:decode.id})
        return res.status(200).json({email: user.email})
    }catch(error){
        return res.status(401).json(error)
    }
}

module.exports = {refreshToken, userSignUp, userLogin, loginCheck, getData}