const jwt = require('jsonwebtoken')

const RequireAuth = async (req,res,next) =>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({mssg: 'Token is unavailable'})
    }
    const token= authorization.split(' ')[1]
    try{
        const decode = jwt.verify(token, process.env.SECRET)
        req.user = decode
        next()
    }catch(error){
        return res.status(401).json(error)
    }
}

module.exports = RequireAuth