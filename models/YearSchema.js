const mongoose = require('mongoose');

const YearSchema = new mongoose.Schema({
    year : Number,
})

module.exports = mongoose.model('Year',YearSchema);
