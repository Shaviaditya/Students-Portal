const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    name: String,
    answer:[
        {
            text: String
        }
    ]
})

module.exports = mongoose.model('Student', StudentSchema)