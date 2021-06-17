const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    stream: String,
    question:[
        [
            {
                type: String,   
                description: String,
                option1: String,
                option2: String,
                option3: String,
                option4: String,
                answer: String
            }
        ]
    ]
})

module.exports = mongoose.model('Question', QuestionSchema)