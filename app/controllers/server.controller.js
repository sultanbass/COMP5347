var express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Bring the user model and wiki articles model
const User = require('../models/user');
const Wiki = require('../models/wikiarticles');

module.exports.showForm = function(req, res){
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


module.exports.charts = function(req, res){
	var labels = ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008"];
	var datasets=[{
		label: 'Administrator',
		data: [12, 19, 3, 5, 2, 3]
	},
	{
		label: 'Anonymous',
        data: [4, 9, 2, 4, 6, 23]
	},
	{
        label: 'Bot',
        data: [4, 9, 2, 4, 6, 23]
	},
	{
        label: 'Regular User',
        data: [4, 9, 2, 4, 6, 23]
	}];

	// send data as objects for render
	res.render('charts.ejs', {labels:labels, datasets:datasets});

};

module.exports.userdashboard = function(req, res){
// Login Process
	router.post('/userdashboard', function(req, res, next){
  	passport.authenticate('local', {
    	successRedirect:'/userdashboard',
    	failureRedirect:'/',
    	failureFlash: true
  	})(req, res, next);
	});
};

//Logout Process
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/');
});
