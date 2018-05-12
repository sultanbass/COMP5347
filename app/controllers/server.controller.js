var express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const fs = require('fs');
//Bring the user model and wiki articles model
const User = require('../models/user');
const Revision = require('../models/revision');
module.exports.landingpage = function(req, res){
	/*
	 * TODO
	 * TESTING PURPOSES ONLY - REMOVE FOR FINAL
	 * Check and log number of records in DB
	 */
	Revision.count({}, function( err, count){
	    console.log( "Number of DB records:", count );
	})
	/*Revision.find({}, function(err, revisions) {
		if (err) {
			console.log("Error finding db records");
		}
		else {
			console.log(revisions);
		}
	})*/
	res.render('landingpage');
};

module.exports.register = function(req, res){
	res.render('signup');
};


//Registration process
module.exports.signup = function(req, res){
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;

	//validate the fields
	req.checkBody('first_name', 'First Name is required').notEmpty();
	req.checkBody('last_name', 'Last Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	//check if there are any validation errors
	var errors = req.validationErrors();
	if(errors){
		res.render('signup', {
			errors:errors
		});
	} else {
		var newUser = new User({
			first_name:first_name,
			last_name:last_name,
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
};


// Login Process
module.exports.login = function(req, res, next){
  	passport.authenticate('local', {
    	successRedirect:'/userdashboard',
    	failureRedirect:'/',
    	failureFlash: true
  	})(req, res, next);
	};

//Logout Process
module.exports.logout = function(req, res) {
  req.logout();
  req.flash('success', 'You are logged out.');
  res.redirect('/');
};

module.exports.mainpage = function(req, res) {
	res.render('mainpage');
}