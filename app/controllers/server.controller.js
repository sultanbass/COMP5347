var express = require('express');

module.exports.showForm = function(req, res){
	res.render('test.ejs');
};

module.exports.submit = function(req, res){
	res.render('test2.ejs');
	//	res.render('<ejs or pug page>', {data in JSON format})
	//console.log("submit function");
};