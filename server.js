/**
 * Assignment 2 - main server
 */
const mongoose = require('mongoose');
const express = require('express');
const passport = require("passport");
//const chartjs = require("chartjs");
const path = require('path')
const bodyParser = require('body-parser');
const session = require('express-session');
const serversession = require('./app/routes/server.routes');
const register = require('./app/routes/users');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const config = require('./config/database');

//intilialize the express app
const app = express();

// This is a method used to set environment variables that Express will use in its configuration
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');
//This is the path for the static folder
app.use(express.static(path.join(__dirname, 'public')));

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Register passport middleware
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// code to maintain a user session
app.use(session({secret: 'ssshhhh', cookie:{maxAge:600000}, resave: true, saveUninitialized: true}));

//routing
app.use('/', serversession);


//Connect to mongodb
mongoose.connect('mongodb://localhost:27017/wikipedia');
var db = mongoose.connection;
//check DB connection
db.once('open', function (){
  console.log('Connected to MongoDB');
});

// Start the server on port 3000
app.listen(3000, function () {
  console.log('Wikilatic app listening on port 3000!')
})

module.exports = app;
