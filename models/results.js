const mongoose = require('mongoose')

const ResultSchema = new mongoose.Schema({
    examcode:String,
    log:[
        {
            name: String,
            marks: Number
        }
    ] 
})

module.exports = mongoose.model('Result', ResultSchema)