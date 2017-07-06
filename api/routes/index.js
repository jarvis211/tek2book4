var express = require('express');
var router = express.Router();
var Books = require('../models/booksModel');
/* GET home page. */
router
  .get('/', function(req, res) {
      Books.find({}, function(err, data) {
          console.log(data);
          if(err)
            throw err;
          if(data === null) {
              res.send();
              res.render('error404', {
                  title: 'error'
              })
          }
          else {
              res.render('index', {
                  title: 'Tek|Book',
                  books: data,
                  user: req.user
              })
          }
      })  
  });

module.exports = router;
