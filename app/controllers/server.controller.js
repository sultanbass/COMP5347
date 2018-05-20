var express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const fs = require('fs');
//Bring the user model and wiki articles model
const User = require('../models/user');
const Revision = require('../models/revision');
var request = require('request');
var async = require('async');
var bot_path = "Bot.txt";
var admin_path = "Admin.txt";


// Check for new revisions and update DB
module.exports.checkWikiAPI = function(req, res){

	var title = req.query.title;
	var numUpdates = 0;

	// Check the latest revision date for the title
	function getLatestRevision(title){
		return new Promise(function(resolve, reject){
			Revision.latestRevDate(title, function(err, result) {
				if (err) {
					console.log("Cannot find latest Time");
				} else {
					resolve(result[0]["timestamp"]);
				}
			})
		})
	}

	// Check wikiAPI and update db if new records exist
	function checkAPI(date){
		return new Promise(function(resolve, reject){
			var wikiEndpoint = 'https://en.wikipedia.org/w/api.php';
			parameters = [ "action=query",
							"format=json",
							"prop=revisions",
							"titles=" + title,
							"rvstart=" + date,
							"rvdir=newer",
							"rvlimit=max",
							"rvprop=timestamp|size|user|ids|flags|sha1|parsedcomment"]
			var url = wikiEndpoint + "?" + parameters.join("&");
			//console.log("url:" + url)
			var options = {
				url:url,
				Accept: 'application/json',
				'Accept-Charset' : 'utf-8'
			}
			request(options, function(err, res, data){
				if(err){
					console.log('Error: ', err);
				} else if(res.statusCode !== 200){
					console.log('Status:', res.statusCode);
				} else {
					json = JSON.parse(data);
					pages = json.query.pages;
					revisions = pages[Object.keys(pages)[0]].revisions;
					
					// if there are new revisions
					if(revisions){
						numUpdates = revisions.length;
						
						// add title to each object
						revisions.map(function (obj){
							obj.title = title;
						});
						
						// add new revisions to database
						Revision.addRevisions(revisions, function(err, result){
							if(err){
								console.log("Error: " + err);
							}
							else{
								console.log("Successfully added " + numUpdates + " new revisions to database");
							}
						})
					}
					resolve(numUpdates);
				}
			});
		})
	}

async function runAsync(){
	var dateString = await getLatestRevision(title);
	var oldDate = new Date(dateString);
	var today = new Date();
	
	// if latest revision is more than a day old
	if((today.getTime() - oldDate.getTime()) >  86400000){
		// add 1 day to avoid duplicate records being fetched
		var newDate = new Date(oldDate);
		newDate.setDate(newDate.getDate() + 1);
		
		numUpdates = await checkAPI(newDate.toISOString());
	}
		res.send(numUpdates.toString());
}

runAsync();

}

module.exports.landingpage = function(req, res){
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

var title = req.query.title

async.series([

function(callback) {
	Revision.findHighNumRev(number, function(err, result) {
		if (err) {
			console.log("Error finding number of revisions");
			console.log(err);
			return (callback(err))
		} else {
			highestrevision = result;
			callback(null, highestrevision);
		}
	})
},

function(callback) {
	Revision.findLowNumRev(number, function(err, result) {
		if (err) {
			console.log("Error finding number of revisions");
			console.log(err);
			return (callback(err))
		} else {
		  lowestrevision = result;
			callback(null, lowestrevision);
		}
	})
},

function(callback) {

	fs.readFile(admin_path, function(err, data) {
		if (err) {
			console.log("Read admin.txt error!")
		} else {
			admins = data.toString().split("\n");
			callback(null, admins)
		}
	})
},

function(callback) {

	fs.readFile(bot_path, function(err, data) {

		if (err) {
			console.log("Read bot.txt error!")
		} else {
			bots = data.toString().split("\n");
			callback(null, bots)
		}
	})
},

function(callback) {
	Revision.findMostUserEdits(admins,bots, function(err, result) {
		if (err) {
			console.log("Error finding most user edits");
			return (callback(err))
		} else {
			mostUserEdits = result;
			callback(null, mostUserEdits);
		}
	})
},

function(callback) {
	Revision.findLeastUserEdits(admins, bots, function(err, result) {
		if (err) {
			console.log("Error finding most user edits");
			return (callback(err))
		} else {
			leastUserEdits = result;
			callback(null, leastUserEdits);
		}
	})
},

function(callback) {
	Revision.findLongRev(function(err, result) {
		if (err) {
			console.log("Error finding most user edits");
			return (callback(err))
		} else {
			longestRev = result;
			callback(null, longestRev);
		}
	})
},

function(callback) {
	Revision.findShortRev(function(err, result) {
		if (err) {
			console.log("Error finding most user edits");
			return (callback(err))
		} else {
			shortestRev = result;
			callback(null, shortestRev);
		}
	})
},

function(callback) {
	Revision.findTitle(function(err, result) {
		if (err) {
			console.log("Error finding title");
			return (callback(err))
		} else {
			titles = result;
			callback(null, titles);
		}
	})
},


function(callback) {
	Revision.findIndividual(title, function(err, result) {
		if (err) {
			console.log("Error finding individualquery");
			console.log(err);
			return (callback(err))
		} else {
		  individualarticle = result;
			callback(null, individualarticle);
		}
	})
},

function(callback) {
	Revision.findTop5Users(title, admins, bots, function(err, result) {
		if (err) {
			console.log("Error finding top 5 users");
			console.log(err);
			return (callback(err))
		} else {
		  top5users = result;
			callback(null, top5users);
		}
	})
},

],function(err) {
	res.render("mainpage.pug", {number:number})
})
};


module.exports.revByYearType = function(req, res){

		async.series([

		function(callback) {

			fs.readFile(admin_path, function(err, data) {
				if (err) {
					console.log("Read admin.txt error!")
				} else {
					admins = data.toString().split("\n");
					console.log("Reading admin")
					callback(null, admins)

				}
			})
		},

		function(callback) {

			fs.readFile(bot_path, function(err, data) {

				if (err) {
					console.log("Read bot.txt error!")
				} else {
					bots = data.toString().split("\n");
					console.log("Reading bots")
					callback(null, bots)

				}
			})
		},

		function(callback) {
			Revision.findRevByYearUser(bots, function(err, result) {
				if (err) {
					console.log("Cannot find year_bot");
					return (callback(err))
				} else {
					console.log("Year for bots")
					console.log(result)
					year_bot = result;
					callback(null, year_bot)
				}
			})
		},

		function(callback) {
			Revision.findRevByYearUser(admins, function(err, result) {
				if (err) {
					console.log("Cannot find year_admin");
					return (callback(err))
				} else {
					console.log("Year for admins")
					console.log(result)
					year_admin = result;
					callback(null, year_admin)
				}
			})
		},

		function(callback) {
				Revision.findRevByYearRegUser(bots.concat(admins), function(err, result) {
					if (err) {
						console.log("Cannot find Regular User");
						return (callback(err))
					} else {
						console.log("Year Regular users")
						console.log(result)
						regUser = result;
						callback(null, regUser)
					}
				})
		},

		function(callback) {
			Revision.findRevByYearAnon(function(err, result) {
				if (err) {
					console.log("Cannot find year_anon");
					return (callback(err))
				} else {
					console.log("Year anonymous")
					console.log(result)
					year_anon = result;
					callback(null, year_anon)
				}
			})
		},

		function(callback) {
			var datasets=[{
				label: 'Administrator',
				data: [12, 19, 3, 5, 2, 3]
			},
			{
				label: 'Anonymous',
				data: [4, 9, 3, 4, 4, 23]
			},
			{
				label: 'Bot',
				data: [1, 1, 7, 4, 9, 21]
			},
			{
				label: 'Regular User',
				data: [9, 2, 2, 9, 6, 16]
			}];
			console.log("hello")
			console.log(datasets);
			res.send({data:datasets});
			callback(null, datasets)
		}
	],)
}


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


// Overall analytics pie chart - number of revisions by user type
module.exports.distByType = function(req, res){

	async.series([

		function(callback) {

			fs.readFile(admin_path, function(err, data) {
				if (err) {
					console.log("Read admin.txt error!")
				} else {
					admins = data.toString().split("\n");
					callback(null, admins)
				}
			})
		},

		function(callback) {

			fs.readFile(bot_path, function(err, data) {

				if (err) {
					console.log("Read bot.txt error!")
				} else {
					bots = data.toString().split("\n");
					callback(null, bots)
				}
			})
		},

		function(callback) {
			Revision.findRevByUser("Bot",bots, function(err, result) {
				if (err) {
					console.log("Cannot find year_bot");
					return (callback(err))
				} else {
//					console.log("This is for bots")
//					console.log(result)
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
//					console.log("This is for admins")
//					console.log(result)
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
//						console.log("This is Regular users")
//						console.log(result)
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
//					console.log("This is for anonymous")
//					console.log(result)
					year_anon = result;
					callback(null, year_anon)
				}
			})
		},


		function(callback) {

			var sumAdmin = 0;
			for (var i = 0; i < year_admin.length; i++) {
				sumAdmin = sumAdmin + year_admin[i]["count"];
			}
			var sumBot = 0;
			for (var i = 0; i < year_bot.length; i++) {
				sumBot = sumBot + year_bot[i]["count"];
			}
			var sumAnon = 0;
			for (var i = 0; i < year_anon.length; i++) {
				sumAnon = sumAnon + year_anon[i]["count"];
			}
			var sumRegUser = 0;
			for (var i = 0; i < regUser.length; i++) {
				sumRegUser = sumRegUser + regUser[i]["count"];
			}

			var data = [{
    			user: 'Administrator',
    			revisions: sumAdmin
    		},
    		{
    			user: 'Bot',
    			revisions: sumBot
    		},
    		{
    			user: 'Regular User',
    			revisions: sumRegUser
    		},
    		{
    			user: 'Anonymous',
    			revisions: sumAnon
    		}];

			console.log(data);
			res.send({data:data});
			callback(null, data)
		}
	],)
}
