const mongoose = require('mongoose');

const TimeSchema = new mongoose.Schema({
    startslot: {
        type: Date,
        unique: true,
    },
    endslot: {
        type: Date,
        unique: true,
    }
})

module.exports = mongoose.model('Timer',TimeSchema)
