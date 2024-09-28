const mongoose = require('mongoose')
const schema = mongoose.Schema

const kanbanSchema = new schema({
    boardName:{
        type: String,
        required: true
    },
    boardColumn:{
        type: Array,
        required:false
    }
})

module.exports = mongoose.model('kanbanModel', kanbanSchema)