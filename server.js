/**
 * Assignment 2 - main server
 */
const mongoose = require('mongoose');
const express = require('express');
const passport = require("passport");
var path = require('path')
var bodyParser = require('body-parser');
var session = require('express-session');
var serversession = require('./app/routes/server.routes');
var register = require('./app/routes/users');
const app = express();

// This is a method used to set environment variables that Express will use in its configuration
app.set('views', path.join(__dirname, 'app/views'));

//This is the path for the static folder
app.use(express.static(path.join(__dirname, 'public')));

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Register passport middleware
app.use(passport.initialize());
app.use(passport.session());

// code to maintain a user session
app.use(session({secret: 'ssshhhh', cookie:{maxAge:600000}, resave: true, saveUninitialized: true}));

//routing
app.use('/', serversession);


//Connect to mongodb
mongoose.connect('mongodb://localhost/wikipedia');
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
