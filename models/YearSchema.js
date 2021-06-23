const mongoose = require('mongoose');

const YearSchema = new mongoose.Schema({
    year : Number,
    set: Number,
})

module.exports = mongoose.model('Year',YearSchema);
