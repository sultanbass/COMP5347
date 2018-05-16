var express = require('express');
var controller = require('../controllers/server.controller');
var router = express.Router();

// Get request routes
router.get('/', controller.landingpage);
router.get('/register', controller.register);
router.get('/logout', controller.logout);
router.get('/userdashboard', controller.mainpage);

// Ajax requests
router.get('/revByYearType', controller.distByType);
router.get('/distByType', controller.distByType);


// Post request routes
router.post('/login', controller.login);
router.post('/register', controller.signup);
router.post('/userdashboard', controller.mainpage)
// Allows other files to include the router
module.exports = router;
