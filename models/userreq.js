const mongoose = require('mongoose');

const ReqSchema = new mongoose.Schema({
    response : String,
})

module.exports = mongoose.model('Response',ReqSchema);
