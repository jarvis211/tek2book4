var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer = require('multer');
var Books = require('../models/booksModel');
var Category = require('../models/categoryModel');
// var User = require('../models/adminModel');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})
var uploads = multer({ storage: storage });

/* GET home page. */

var user = 'admin';

// Checks if the user is already logged in or not.
function isLoggedIn(req, res) {
    if(req.isAuthenticated() && req.user.local.username === user)
      return true;
    res.end();
    res.redirect('/manage/admin');
    return false;
}

router
  .route('/dashboard')
  .get(function(req, res) {
      if(isLoggedIn(req, res) && req.user.local.username === user)
        res.render('manage', {
            title: 'Tek|Book',
            errors: null
        });
  })

router
  .route('/dashboard/addbooks')
  .post(uploads.any(), function(req, res) {
      var bookName = req.body.book_name;
      var author = req.body.author;
      var currency = req.body.currency;
      var price = req.body.price;
      var description = req.body.description;
      
      if(req.files.length) {
          var mainImageFieldname = req.files[0].fieldname;
          var mainImageOriginalName = req.files[0].originalname;
          var mainImageEncoding = req.files[0].encoding;
          var mainImageMimetype = req.files[0].mimetype;
          var mainImageDestination = req.files[0].destination;
          var mainImageName = req.files[0].filename;
          var mainImagePath = req.files[0].path;
          var mainImageSize = req.files[0].size;
      }
      else {
          var mainImageName = 'noimage.jpg'
      }

      // Express form validation methods
      req.checkBody('book_name', 'Book Name is Required').notEmpty();
      req.checkBody('author', 'Author Name is Required').notEmpty();
      req.checkBody('price', 'It Should Be in Numeric Value').notEmpty();
      req.checkBody('description', 'Description Field Should Not Be Empty').notEmpty();

      var errors = req.validationErrors();
      
      if(errors.length) {
          // Render the errors if input is empty
          res.render('manage', {
              title: 'Tek|Book',
              errors: errors
          })
      }
      else {
          // Insert the data inti the database
          var newBook = new Books();
          newBook.bookname = bookName;
          newBook.author = author;
          newBook.price = currency + ' ' + price;
          newBook.description = description;
          newBook.coverdetails.fieldname = mainImageFieldname;
          newBook.coverdetails.originalname = mainImageOriginalName;
          newBook.coverdetails.encoding = mainImageEncoding;
          newBook.coverdetails.destination = mainImageDestination;
          newBook.coverdetails.mimetype = mainImageMimetype;
          newBook.coverdetails.filename = mainImageName;
          newBook.coverdetails.path = mainImagePath;
          newBook.coverdetails.size = mainImageSize;

          newBook.save(function(err, data) {
              if(err)
                throw err;
              console.log('data saved to database..');
              res.redirect('/manage/dashboard');
          })

      }

  })

router
  .route('/admin')
  .get(function(req, res) {
    if(req.user) {
        if(req.user.local.username === user) {
            res.end();
            res.redirect('/manage/dashboard');
        }   
    }
    res.render('adminlogin', {
        title: 'admin | login',
        usernameErrorMsg: req.flash('usernameError'),
        passwordErrorMsg: req.flash('passwordError'),
        user: req.user
    })
  })
  .post(passport.authenticate('admin-login', {
      successRedirect: '/manage/dashboard',
      failureRedirect: '/manage/admin',
      faliurFlash: true
  }))

router
    .route('/showbooks')
    .get(function(req, res) {
        if(isLoggedIn(req, res) && req.user.local.username === user) {
            Books.find({}, function(err, data) {
                res.render('showbooks', {
                    title: 'Tek|Book',
                    books: data
                })
            })         
        }
    })

router
    .route('/edit/:id')
    .get(function(req, res) {
        if(isLoggedIn(req, res) && req.user.local.username === user) {
            Books.findOne({ _id: req.params.id }, function(err, data) {
                if(data === undefined) {
                    res.end();
                    res.redirect('/manage/showbooks');
                }
                res.render('editBooks', {
                    title: 'Tek|Books',
                    errors: null,
                    books: data
                })
            })     
        }      
    })
    .post(uploads.any(), function(req, res) {
        if(isLoggedIn(req, res) && req.user.local.username === user) {
            Books.findOneAndUpdate({ _id: req.params.id }, { 
                $set: { 
                    bookname: req.body.book_name,
                    author: req.body.author,
                    price: req.body.currency + ' ' + req.body.price,
                    description: req.body.description,
                    coverdetails: {
                        fieldname: req.files[0].fieldname,
                        originalname: req.files[0].originalname,
                        encoding: req.files[0].encoding,
                        mimetype: req.files[0].mimetype,
                        destination: req.files[0].destination,
                        filename: req.files[0].filename,
                        path: req.files[0].path,
                        size: req.files[0].size
                    }
                } 
            }, function(err, data) {
                if(err)
                    throw err;
                res.end();
                res.redirect('/manage/showbooks');
            })
        }
    })

router
    .route('/delete/:id')
    .get(function(req, res) {
        if(isLoggedIn(req, res) && req.user.local.username === user) {
            var delBook = Books.findOne({ _id: req.params.id }, function(err, data) {
                // The below statement is causing casttype error which is mongoose error.
                // if(err)
                //     throw err;
                if(data === undefined) {
                    res.end();
                    res.redirect('/manage/showbooks');
                }
                else {
                    delBook.remove(function(err) {
                        if (err)
                            throw err;
                        if(isLoggedIn(req, res) && req.user) {
                            res.end();
                            res.redirect('/manage/showbooks');
                        }
                    })
                }
                
            })      
            
        }
    })

router
    .route('/showcategory')
    .get(function(req, res) {
        if(isLoggedIn(req, res) && req.user.local.username === user) {
            Category.find({}, function(err, data) {
                res.render('showcategory', {
                    title: 'Tek|Book',
                    categories: data
                })
            })    
        }
    })

router
    .route('/addcategory')
    .get(function(req, res) {
        if(isLoggedIn(req, res) && req.user.local.username === user) {
            res.render('addcategory', {
                title: 'Tek|Book',
                errors: []
            })
        }
    })
    .post(function(req, res) {
        if(isLoggedIn(req, res) && req.user.local.username === user) {
            var newCategory = new Category();
            newCategory.cno = req.body.CategoryNo;
            newCategory.name = req.body.CategoryName;

            req.checkBody('CategoryNo', 'Category Number Should Be Of Type Number').isNumeric();
            req.checkBody('CategoryName', 'Category Name Should Be a String').notEmpty().isAlpha();
            

            var errors = req.validationErrors();

            if(errors.length) {
                res.render('addcategory', {
                    title: 'Tek|Book',
                    errors: errors
                })
            }
            else {
                Category.findOne({ cno: req.body.CategoryNo }, function(err, data) {
                    if(err)
                        throw err;
                    if(data === null) {
                        newCategory.save(function(err, data) {
                            if(err)
                                throw err;
                            res.end();
                            res.redirect('/manage/showcategory');
                        })
                    }
                    else {
                        res.end();
                        res.redirect('/manage/addcategory');
                    }
                })
                
            }
        }
    })

router
    .route('/editcategory/:id')
    .get(function(req, res) {
        if(isLoggedIn(req, res) && req.user.local.username === user) {
            Category.findOne({ cno: req.params.id }, function(err, data) {
                if(err)
                    throw err;
                if(data === null) {
                    res.end();
                    res.redirect('/manage/showcategory');
                }
                else {
                    res.render('editcategory', {
                        title: 'Tek|Book',
                        errors: [],
                        category: data
                    })
                } 
            })
        }
    })
    .post(function(req, res) {
        if(isLoggedIn(req, res) && req.user.local.username === user) {
            Category.findOneAndUpdate({ cno: req.params.id }, { 
                $set: { 
                    cno: req.body.CategoryNo, 
                    name: req.body.CategoryName 
                }
            }, 
            function(err, data) {
                if(err)
                    throw err;
                res.end();
                res.redirect('/manage/showcategory');
            })
        }
    })

router
    .route('/deletecategory/:id')
    .get(function(req, res) {
        if(isLoggedIn(req, res) && req.user.local.username === user) {
            var category = Category.findOne({ cno: req.params.id }, function(err, data) {
                if(err)
                    throw err;
                if(data === null) {
                    res.end();
                    res.redirect('/manage/showcategory');
                }
                else {
                    category.remove(function(err) {
                        if(err)
                            throw err;
                        res.end();
                        res.redirect('/manage/showcategory');
                    })
                }
            })
        }
    })


router
  .route('/logout')
  .get(function(req, res) {
      if(isLoggedIn(req, res) && req.user.local.username === user) {
        req.logOut();
        res.redirect('/manage/admin');
      }
  })

module.exports = router;
