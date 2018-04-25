var express = require('express');
var controller = require('../controllers/server.controller');
var router = express.Router();

router.get('/', controller.showForm);
router.post('/submit', controller.submit);
module.exports = router;