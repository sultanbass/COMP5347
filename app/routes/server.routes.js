var express = require('express');
var controller = require('../controllers/server.controller');
var router = express.Router();

// Get request routes
router.get('/', controller.showForm);
router.get('/login', controller.submit);

// Post request routes
router.post('/submit', controller.submit);

// Allows other files to include the router
module.exports = router;