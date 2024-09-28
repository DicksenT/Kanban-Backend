require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const kanbanRoute = require('./routes/kanbanRoute')

app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.use('/kanban', kanbanRoute)


mongoose.connect(process.env.DB_URI)
    .then(() =>{
        app.listen(process.env.PORT,() =>{
            console.log('Listening to port ' + process.env.PORT);
            
        })
    }).catch((error) =>{
        console.error(error);
        
    })