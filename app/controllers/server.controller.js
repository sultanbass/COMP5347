var express = require('express');

module.exports.showForm = function(req, res){
	res.render('landingpage');
};

module.exports.register = function(req, res){
	res.render('signup');
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
	res.render('mainpage');
};

	//	res.render('<ejs or pug page>', {data in JSON format})
	//console.log("submit function");
