require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
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


mongoose.connect(process.env.DB_URI)
    .then(() =>{
        app.listen(process.env.PORT,() =>{
            console.log('Listening to port ' + process.env.PORT);
            
        })
    }).catch((error) =>{
        console.error(error);
        
    })