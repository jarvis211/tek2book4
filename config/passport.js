var LocalStratergy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var Admin = require('../api/models/adminModel');
var User = require('../api/models/userModel');

module.exports = function(passport) { 

    passport.serializeUser(function(user, done) {
        if(user.constructor === Array)
            done(null, user[0]._id);
        else
            done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Admin.findById(id, function (err, user) {
            if(user === null) {
                User.findById(id, function (err, user) {
                    done(err, user);
                });
            }
            else
                done(err, user);
        });
        
    });

    passport.use('admin-login', new LocalStratergy ({
            passReqToCallback: true
        },
        function(req, username, password, done) { 
            process.nextTick(function() {
                Admin.findOne({ 'local.username': username }, function(err, user) {
                    if(err)
                        throw err;
                    if(user === null)
                        return done(null, false, req.flash('usernameError', 'Invalid Username Or Password'));
                    if(!bcrypt.compareSync(password, user.local.password))
                        return done(null, false, req.flash('passwordError', 'Please Enter Valid Password'));
                    return done(null, user);
                })
            }) 
        }
    ))

    passport.use('user-login', new LocalStratergy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            process.nextTick(function() {
                User.findOne({ 'local.username': username }, function(err, user) {
                    if(err)
                        throw err;
                    if(user === null) {
                        return done(null, false, req.flash('usernameError', 'Invalid Username Or Password'));
                    }
                    if(!bcrypt.compareSync(password, user.local.password)) {
                        return done(null, false, req.flash('passwordError', 'Please Enter Valid Password'));
                    }
                    return done(null, user);    
                })
            })
        }
    ))

    passport.use('local-signup', new LocalStratergy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            User.findOne({ username: username}, function(err, data) {
                if(err)
                    throw err;
                if(data !== null) {
                    return done(null, false, req.flash('userExist', 'The Username Already exists...'));
                }
                else {
                    var name = req.body.name;
                    var email = req.body.email;
                    var confirmPassword = req.body.confirmPassword;

                    req.checkBody('name', 'The Name Field Should Not Be Empty').notEmpty();
                    req.checkBody('email', 'Provide The Valid Email Id').isEmail();

                    var errors = req.validationErrors();

                    if(errors) {
                        return done(null, false, req.flash('validationError', 'Provide Valid Details'));
                    }
                    else {
                        var newUser = new User();
                        newUser.local.name = name;
                        newUser.local.username = username;
                        newUser.local.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                        newUser.local.email = email;

                        if(bcrypt.compareSync(confirmPassword, newUser.local.password)) {
                            newUser.save(function(err, user) {
                                if(err)
                                    throw err;
                                else {
                                    return done(null, user, req.flash('signupSuccess', 'Signup Succesfully'));
                                }
                            })
                        }
                        else
                            return done(null, false, req.flash('conPasswordError', 'Please confirm The Valid Password'));
                    }
                }
            })
        }
    ))

}

