var express = require('express');
var controller = require('../controllers/server.controller');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring the user model and wiki articles model
var User = require('../models/users');
var Wiki = require('../models/wikiarticles');


// Get request routes
router.get('/', controller.showForm);
router.get('/register', controller.register);


// Post request routes
router.post('/userdashboard', controller.userdashboard);


//registration process
router.post('/register', function(req, res){
  var first_name = req.body.firstname;
  var last_name = req.body.lastname;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  //validate the fields
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  //check if there are any validation errors
  var errors = req.validationErrors();
  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      first_name:firstname,
      last_name:lastname,
      email:email,
      username:username,
      password:password
    });

    //encrypt the password with hash
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        //save new user
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success','Registration successful. You can now log in.');
            res.redirect('/');
          }
        });
      });
    });
  }
});

// Allows other files to include the router
module.exports = router;
