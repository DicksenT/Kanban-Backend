require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')


app.use(express.json())
app.use(cors({
    origin: "https://kanban-task-management-web-app-86h6.onrender.com"
}))

//ROUTES
const boardRoute = require('./routes/boardRoutes')
const columnRoute = require('./routes/columnRoutes')
const taskRoutes = require('./routes/taskRoutes')
const userRoutes = require('./routes/userRoutes')
app.use('/board', boardRoute)
app.use('/column', columnRoute)
app.use('/task',taskRoutes)
app.use('/user', userRoutes)


mongoose.connect(process.env.DB_URI)
    .then(() =>{
        app.listen(process.env.PORT,() =>{
            console.log('Listening to port ' + process.env.PORT);
            
        })
    }).catch((error) =>{
        console.error(error);
        
    })