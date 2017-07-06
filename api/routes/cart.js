var express = require('express');
var router = express.Router();

var Book = require('../models/booksModel');

module.exports = router;

function isLoggedIn(req, res) {
    if(req.isAuthenticated() && req.user)
      return true;
    res.send();
    res.redirect('/');
    return false;
}

router
    .route('/')
    .get(function(req, res) {
        if(isLoggedIn(req, res)) {
            res.render('cart', {
                title: 'Tek|Book',
                user: req.user,
                books: req.session.cart
            })
        }
    })

router
    .route('/addcart/:id')
    .get(function(req, res) {
        if(isLoggedIn(req, res)) {
            Book.findOne({ _id: req.params.id }, function(err, book) {
                var cart = req.session.cart || {};
                var subtotal = req.session.subtotal || 0;
                var total = parseInt(book.price.slice(2));
                var quantity = 1;

                if(cart[req.params.id]) {
                    cart[req.params.id].quantity++;
                    cart[req.params.id].total += parseInt(book.price.slice(2));
                    subtotal += parseInt(book.price.slice(2));
                }
                else {
                    cart[req.params.id] = {
                        _id: req.params.id,
                        bookname: book.bookname,
                        author: book.author,
                        currency: book.price.slice(0,2),
                        description: book.description,
                        coverdetails: book.coverdetails,
                        quantity: quantity,
                        total: total
                    }
                    subtotal += total;
                }    
 
                req.session.cart = cart;
                req.session.subtotal = subtotal;
                
                res.redirect('/details/books/'+ req.params.id);
            })
        }
    })

router
    .route('/delete/:id')
    .get(function(req, res) {
        if(isLoggedIn(req, res)) {
            if(req.session.cart[req.params.id]) {
                delete req.session.cart[req.params.id];
                res.send()
                res.redirect('/cart');
            }   
        }
    })

router
    .route('/addbook/:id')
    .get(function(req, res) {
        if(isLoggedIn(req, res)) {
            Book.findOne({ _id: req.params.id }, function(err, book) {
                var cart = req.session.cart || {};
                var subtotal = req.session.subtotal || 0;
                var total = parseInt(book.price.slice(2));
                var quantity = 1;

                if(cart[req.params.id]) {
                    cart[req.params.id].quantity++;
                    cart[req.params.id].total += parseInt(book.price.slice(2));
                    subtotal += parseInt(book.price.slice(2));
                }
                else {
                    cart[req.params.id] = {
                        _id: req.params.id,
                        bookname: book.bookname,
                        author: book.author,
                        currency: book.price.slice(0,2),
                        description: book.description,
                        coverdetails: book.coverdetails,
                        quantity: quantity,
                        total: total
                    }
                    subtotal += total;
                }    
 
                req.session.cart = cart;
                req.session.subtotal = subtotal;
                
                res.redirect('/cart');
            })
        }
    })