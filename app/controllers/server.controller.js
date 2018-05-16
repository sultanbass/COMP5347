var express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const fs = require('fs');
//Bring the user model and wiki articles model
const User = require('../models/user');
const Revision = require('../models/revision');
var async = require('async');
var bots = fs.readFileSync("Bot.txt").toString().split("\n");
var admins = fs.readFileSync("Admin.txt").toString().split("\n");


module.exports.landingpage = function(req, res){
	/*
	 * TODO
	 * TESTING PURPOSES ONLY - REMOVE FOR FINAL
	 * Check and log number of records in DB
	 */
	Revision.count({}, function( err, count){
	    console.log( "Number of DB records:", count );
	})
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
	
	var username = req.body.username;
	var password = req.body.password;
	
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	
	var errors = req.validationErrors();
	if(errors){
		res.render('landingpage', {
			errors:errors
		});
	}
	else{
			passport.authenticate('local', {
				successRedirect:'/userdashboard',
				failureRedirect:'/',
				failureFlash: true
			})(req, res, next);
		}
};
//Logout Process
module.exports.logout = function(req, res) {
  req.logout();
  req.flash('success', 'You are logged out.');
  res.redirect('/');
};

module.exports.mainpage = function(req, res) {
var number = parseInt(req.query.number);
if (number <0) {
	alert("Number has to be greater than 0");
}
if (isNaN(number)) {
	number = 3
}
	Revision.findNumRev(number, function(err, result) {
		if (err) {
			console.log("Error finding number of revisions");
			console.log(err);
		} else {
			// three articles with highest number of revisions
			revision = result;
			res.render('mainpage', {number:number, revision:revision});
		}
	})

}


module.exports.revByYearType = function(req, res){
/*
 * All queries in revision are ready.
 *  functions are :
 *  	findRevByYearUser(<array of bots OR admins>, callback)	
 * 		findRevByYearRegUser(bots.concat(admins), callback)
 * 	 	findRevByYearRegAnon(callback)
 * 
 */
	
//	TESTING CODE
//
//	function readDB(callback){
//
//		var dataset = [];
//		
//		// bot edits
//		Revision.findRevByYearUser(bots, function(err, result){
//			newData.push(result);
//	        if (err) return callback(err)
//	        callback(null, content)
//		});
//		
//		// admin edits
//		Revision.findRevByYearUser(admins, function(err, result){
//	        if (err) return callback(err)
//	        dataset.push(result);
//		});
//
//		callback(null, dataset);
//	}
//	readDB(function(err, content){
//		console.log("test");
//		console.log(content);
//	});
//	
}

// Overall analytics pie chart - number of revisions by user type
module.exports.distByType = function(req, res){
/*
 * TODO
*/
	
	async.series([ 		
		function(callback) {
			Revision.findRevByUser("Bot",bots, function(err, result) {
				if (err) {
					console.log("Cannot find year_bot");
					return (callback(err))
				} else {
					console.log("This is for bots")
					console.log(result)
					year_bot = result;
					callback(null, year_bot)
				}
			})
		},
		
		function(callback) {
			Revision.findRevByUser("Administrator",admins, function(err, result) {
				if (err) {
					console.log("Cannot find year_admin");
					return (callback(err))
				} else {
					console.log("This is for admins")
					console.log(result)
					year_admin = result;
					callback(null, year_admin)
				}
			})
		},
		
		function(callback) {
				Revision.findRevByRegUser(bots.concat(admins), function(err, result) {
					if (err) {
						console.log("Cannot find Regular User");
						return (callback(err))
					} else {
						console.log("This is Regular users")
						console.log(result)
						regUser = result;
						callback(null, regUser)
					}
				})
		},
		
		function(callback) {
			Revision.findRevByAnon(function(err, result) {
				if (err) {
					console.log("Cannot find year_anon");
					return (callback(err))
				} else {
					console.log("This is for anonymous")
					console.log(result)
					year_anon = result;
					callback(null, year_anon)
				}
			})
		},
		
	
		function(callback) {

			var sumAdmin = 0;
			for (var i = 0; i < year_admin.length; i++) {
				sumAdmin = sumAdmin + year_admin[i]["count"];
				console.log("Admin");
				console.log(sumAdmin);
			}
			var sumBot = 0;
			for (var i = 0; i < year_bot.length; i++) {
				sumBot = sumBot + year_bot[i]["count"];
				console.log("Bot");
				console.log(sumBot);
			}
			var sumAnon = 0;
			for (var i = 0; i < year_anon.length; i++) {
				sumAnon = sumAnon + year_anon[i]["count"];
				console.log("Anonymous");
				console.log(sumAnon);
			}
			var sumRegUser = 0;
			for (var i = 0; i < regUser.length; i++) {
				sumRegUser = sumRegUser + regUser[i]["count"];
				console.log("Regular User");
				console.log(sumRegUser);
			}
			
			var data = [{
    			user: 'Administrator',
    			revisions: sumAdmin
    		},
    		{
    			user: 'Anonymous',
    			revisions: sumAnon
    		},
    		{
    			user: 'Bot',
    			revisions: sumBot
    		},
    		{
    			user: 'Regular User',
    			revisions: sumRegUser
    		}];
			
			console.log(data);
			res.send({data:data});
			callback(null, data)
		}
	],)
}
