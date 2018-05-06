var express = require('express');
var controller = require('../controllers/server.controller');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');



// Get request routes
router.get('/', controller.showForm);
router.get('/register', controller.register);
router.get('/charts', controller.charts);

// Post request routes
router.post('/userdashboard', controller.userdashboard);
router.post('/register',controller.signup);

// Allows other files to include the router
module.exports = router;
