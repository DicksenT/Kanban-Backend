const mongoose = require('mongoose')
const schema = mongoose.Schema

const kanbanSchema = new schema({
    name:{
        type: String,
        required: true
    },
    columns:{
        type: Array,
        required:false
    }
})

module.exports = mongoose.model('kanbanModel', kanbanSchema)