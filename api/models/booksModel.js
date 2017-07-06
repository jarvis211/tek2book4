var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    bookname: { type: String },
    description: { type: String },
    price: { type: String },
    author: { type: String },
    coverdetails: {
        fieldname: { type: String },
        originalname: { type: String },
        encoding: { type: String },
        destination: { type: String },
        mimetype: { type: String },
        filename: { type: String },
        path: { type: String },
        size: { type: Number }
    },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('book_details', bookSchema);