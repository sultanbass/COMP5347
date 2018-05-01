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
* server.locacls.<variableName> = <VariableValue>;
* server.locacls.<variableName2> = <VariableValue>;
*
*/

app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({secret: 'ssshhhh', cookie:{maxAge:600000}, resave: true, saveUninitialized: true}));
app.use('/', serversession);

//route methods moved to server.routes
//app.get('/', function(req,res){
//	res.render('survey.ejs',{products:products})
//});
//app.post('/survey', function(req,res){
//	console.log(req.body);
//
//	res.render('surveyresult.ejs', {products: products, surveyresults: surveyresults})
//});

app.listen(3000, function () {
  console.log('survey app listening on port 3000!')
})
