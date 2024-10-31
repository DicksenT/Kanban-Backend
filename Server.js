require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())


const allowOrigin = [
    'http://localhost:5173',
    'https://kanband.vercel.app/',
    'https://kanbandicksen.netlify.app/'
]
app.use(cors({
    origin: (origin, callback)=>{
        if(allowOrigin.includes(origin) || !origin){
            callback(null, true)
        }
        else{
            callback(new Error("Link not allowed"))
        }
    },
    credentials:true
}))

//ROUTES
const boardRoute = require('./routes/boardRoutes')
const columnRoute = require('./routes/columnRoutes')
const taskRoutes = require('./routes/taskRoutes')
const userRoutes = require('./routes/userRoutes')
const userAuth = require('./routes/userAuthRoutes')
app.use('/board', boardRoute)
app.use('/column', columnRoute)
app.use('/task',taskRoutes)
app.use('/user', userRoutes)
app.use('/userAuth', userAuth)
app.get('/server/ping', (req,res)=>{
    return res.status(200).json('k')
    
})


mongoose.connect(process.env.DB_URI)
    .then(() =>{
        app.listen(process.env.PORT,() =>{
            console.log('Listening to port ' + process.env.PORT);
            
        })
    }).catch((error) =>{
        console.error(error);
        
    })