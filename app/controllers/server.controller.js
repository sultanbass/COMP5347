var express = require('express');

module.exports.showForm = function(req, res){
	res.render('test.ejs');
};

module.exports.userdasboard = function(req, res){
	res.render('test2.ejs');
};

module.exports.register = function(req, res){
	res.render('test2.ejs');

};
	//	res.render('<ejs or pug page>', {data in JSON format})
	//console.log("submit function");
