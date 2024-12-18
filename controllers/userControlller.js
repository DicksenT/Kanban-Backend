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
            secure:true,
            maxAge:15 * 60 * 1000,
            sameSite:'none'
        })
        const refreshToken = createRefreshToken(newuser._id)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'none'
        })
        return res.status(200).json({user: email})
    }catch(error){
        return res.status(400).json({message: error.message})
    }
}

const userLogin = async(req,res) =>{
    const {email, password} = req.body
    try{
        const user = await User.login(email,password)
        const token = createToken(user._id)
        res.cookie('token', token,{
            httpOnly:true,
            secure:true,
            maxAge:15 * 60 * 1000,
            sameSite:'none'
        })
        const refreshToken = createRefreshToken(user._id)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'none'
        })

        console.log(req.cookies);
        
        return res.status(200).json({user: email})
    }catch(error){
        return res.status(400).json({message: error.message})
    }
}

//Controller below need auth

//get data
const getData = async(req,res) =>{  
    const userId = req.user.id
    try{
        const user = await User.findById(userId)
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
    const checkToken = req.cookies.refreshToken
    if(!checkToken){
        return res.status(401).json({mssg: 'Token Expired'})
    }
    const verify = jwt.verify(checkToken, process.env.REFRESH_SECRET)
    if(!verify){
        return res.status(401).json({mssg:'Invalid Refresh Token'})
    }

    //aslong refresh token still active, generate newToken
    try{
        const newToken = createToken(verify.id)
        // replacing
        res.cookie('token', newToken, {
            httpOnly:true,
            secure:true,
            maxAge: 15 * 60 * 1000,
            sameSite: 'none'
        })
        return res.status(200).json({mssg: 'Success Refresh'})
    }catch(error){
        return res.status(400).json({mssg: error})
    }
}

const loginCheck = async(req,res) =>{
    const token = req.cookies.token
    if(!token){
        return res.status(400).json('Token Expired')
    }
    try{
        const decode = jwt.verify(token, process.env.SECRET)
        const user = await User.findById(decode.id)
        return res.status(200).json({user: user.email})
    }catch(error){
        return res.status(400).json(error)
    }
}

const logOut = async(req, res) =>{
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
    return res.status(200).json({mssg: 'cookie removed'})
}

module.exports = {refreshToken, userSignUp, userLogin, loginCheck, getData, logOut}