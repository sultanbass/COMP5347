var express = require('express');

module.exports.showForm = function(req, res){
	res.render('landingpage');
};

module.exports.register = function(req, res){
	res.render('signup');
};

module.exports.userdashboard = function(req, res){
	res.render('mainpage');
};




	//	res.render('<ejs or pug page>', {data in JSON format})
	//console.log("submit function");
