const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    description: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    answer: String
})

module.exports = mongoose.model('Question', QuestionSchema)