const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    subjectcode: {
        type: String
    },
    year:{
        type: Number
    },
    filepath: [
        {
            type: String
        }
    ]
})
const fileModel = mongoose.model('filesave',fileSchema)

module.exports = fileModel;