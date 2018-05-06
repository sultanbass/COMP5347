var express = require('express');
var controller = require('../controllers/server.controller');
var router = express.Router();

//declare the varaible to hold the user model
var User = require('../models/users');

// Get request routes
router.get('/', controller.showForm);
router.get('/register', controller.register);
router.get('/charts', controller.charts);

// Post request routes
router.post('/userdashboard', controller.userdashboard);


// Allows other files to include the router
module.exports = router;
