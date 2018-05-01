/**
 * Assigment 2 - main server
 */
/*update comment
 * 
 */
const mongoose = require('mongoose')
const express = require('express')
var path = require('path')
var bodyParser = require('body-parser');
var session = require('express-session');

var serversession = require('./app/routes/server.routes');

const app = express();

/* variables here 
* 
* app.locacls.<variableName> = <VariableValue>;
* app.locacls.<variableName2> = <VariableValue>;
*
*/

// This is a method used to set environment variables that Express will use in its configuration
app.set('views', path.join(__dirname, 'app/views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// code to maintain a user session
app.use(session({secret: 'ssshhhh', cookie:{maxAge:600000}, resave: true, saveUninitialized: true}));
app.use('/', serversession);

// Start the server on port 3000
app.listen(3000, function () {
  console.log('survey app listening on port 3000!')
})
