var express = require('express');
var Books = require('../models/booksModel');

var router = express.Router();

module.exports = router;

function isLoggedIn(req, res) {
    if(req.isAuthenticated())
      return true;
    else {
        res.send();
        res.redirect('/');
    }   
}

router
    .route('/books/:id')
    .get(function(req, res) {
        if(isLoggedIn(req, res) && req.user) {
            Books.findOne({ _id: req.params.id }, function(err, data) {
                res.render('bookdetails', {
                    title: 'Tek|Book',
                    book: data,
                    user: req.user
                })
            })
        }
    })