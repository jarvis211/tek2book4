var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    cno: { type: Number, unique: true},
    name: { type: String }
})

module.exports = mongoose.model('categories', categorySchema);