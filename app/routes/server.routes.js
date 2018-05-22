var express = require('express');
var controller = require('../controllers/server.controller');
var router = express.Router();

// Get request routes
router.get('/', controller.landingpage);
router.get('/register', controller.register);
router.get('/logout', controller.logout);
router.get('/userdashboard', /*ensureAuthenticated,*/ controller.mainpage);
router.get('/updateRevisions', controller.checkWikiAPI);

// Ajax requests
router.get('/revByYearType', controller.revByYearType);
router.get('/distByType', controller.distByType);


// Post request routes
router.post('/login', controller.login);
router.post('/register', controller.signup);
router.post('/userdashboard', controller.mainpage)

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/');
  }
}

// Allows other files to include the router
module.exports = router;