var express = require('express');
var passport = require('passport');

var router = express.Router();

module.exports = router;

function isLoggedIn(req, res) {
    if(req.isAuthenticated())
        return true;
    else {
        res.send();
        res.redirect('');
    }
}

router
    .route('/signup')
    .get(function(req, res) {
        res.render('signup', {
            title: 'Tek|Book'
        })
    })
    .post(passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/user/signup',
        failureFlash: true
    }))

router
    .route('/login')
    .get(function(req, res) {
        res.render('login', {
            title: 'Tek|Book'
        })
    })
    .post(passport.authenticate('user-login', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    }))

router
    .route('/logout')
    .get(function(req, res) {
        if(isLoggedIn(req, res) && req.user) {
            req.logOut();
            res.redirect('/');
        }
    })