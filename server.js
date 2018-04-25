/**
 * Assigment 2 - main server
 */

var express = require('express')
var path = require('path')
var bodyParser = require('body-parser');
var session = require('express-session');

var serversession = require('./app/routes/server.routes');

var server = express();

/* variables here 
* 
* server.locacls.<variableName> = <VariableValue>;
* server.locacls.<variableName2> = <VariableValue>;
*
*/

server.set('views', path.join(__dirname, 'app/views'));
server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(session({secret: 'ssshhhh', cookie:{maxAge:600000}, resave: true, saveUninitialized: true}));
server.use('/', serversession);

//route methods moved to server.routes
//app.get('/', function(req,res){
//	res.render('survey.ejs',{products:products})
//});
//app.post('/survey', function(req,res){
//	console.log(req.body);
//
//	res.render('surveyresult.ejs', {products: products, surveyresults: surveyresults})
//});

server.listen(3000, function () {
  console.log('survey app listening on port 3000!')
})