const mongoose = require('mongoose');

const TimeSchema = new mongoose.Schema({
    starttime: {
        type: Date,
        unique: true,
    },
    endtime: {
        type: Date,
        unique: true,
    }
})

module.exports = mongoose.model('Timer',TimeSchema)
