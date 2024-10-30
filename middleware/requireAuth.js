const jwt = require('jsonwebtoken')

const RequireAuth = (req,res,next) =>{
    console.log(req.cookies);
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({mssg: 'Token is unavailable'})
    }
    try{
        const decode = jwt.verify(token, process.env.SECRET)
        req.user = decode
        next()
    }catch(error){
        return res.status(401).json(error)
    }
}

module.exports = RequireAuth