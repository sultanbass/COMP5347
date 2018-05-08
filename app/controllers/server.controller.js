var express = require('express');

module.exports.showForm = function(req, res){
	req.checkBody('first_name', 'First Name is required').notEmpty();
	req.checkBody('last_name', 'Last Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	
	// Get errors
	let errors= req.validationErrors();
	if (errors){
		res.render('signup', {
			errors:errors
		});
	} else {
		req.flash('Success', 'sign up succesful');
		res.render('landingpage');
	}
	
	
};

module.exports.register = function(req, res){
	res.render('signup');
};

module.exports.userdashboard = function(req, res){
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	
	// Get errors
	let errors= req.validationErrors();
	if (errors){
		res.render('landingpage', {
			errors:errors
		});
	} else {
		req.flash('Success', 'login succesful');
		res.render('mainpage');
	}
	
	
};




	//	res.render('<ejs or pug page>', {data in JSON format})
	//console.log("submit function");
