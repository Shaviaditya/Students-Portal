const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    name: String,
    set: Number,
    examcode:String,
    answer:[
        {
            text: String
        }
    ]
})

module.exports = mongoose.model('Student', StudentSchema)