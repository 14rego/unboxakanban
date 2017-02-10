var express = require('express');
var app = express();
var mysql = require('mysql');

var conPass = 'rootpass';
var conDataBase = 'unboxakanban';
var conTable = 'users';

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : conPass,
	database : conDataBase
});
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//node-mysql creates connection pool that need not be connected nor ended!
//connection.connect(); 
connection.query('SELECT * from users', function(err, rows, fields) {
	if (!err) {
		console.log('Database connection successful.');
	} else {
		//console.log('Database: ' + rows);
		console.log('Error while performing database connection test. Solution needs Host: localhost; User: root; Password: '+conPass+'; Database: '+conDataBase+'; Table: '+conTable+';');
	}
});
//connection.end();

// Binding express app to port 3000
app.listen(3000,function(){
    console.log('Node ssoerver running @ http://localhost:3000')
});

app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/style',  express.static(__dirname + '/style'));
app.use('/script',  express.static(__dirname + '/script'));

app.get('/',function(req,res){
    res.sendFile('home.html',{'root': __dirname + '/templates'});
});
app.get('/showSignInPage',function(req,res){
    res.sendFile('signin.html',{'root': __dirname + '/templates'});
});
app.get('/showSignInPageRetry',function(req,res){
    res.sendFile('signinretry.html',{'root': __dirname + '/templates'});
});
app.get('/showSignUpPage',function(req,res){
	res.sendFile('signup.html',{'root':__dirname + '/templates'})
});
app.get('/message',function(req,res){
    res.sendFile('message.html',{'root': __dirname + '/templates'});
});
app.get('/loggedin',function(req,res){
    res.sendFile('loggedin.html',{'root': __dirname + '/templates'});
});


app.post('/createuser', function(req, res) {
	//console.log(req.body);

	var record = {email: req.body.email, pass: req.body.pass};
	connection.query('INSERT INTO `'+conTable+'` SET ?', record, function(err,res){
	  	if(err) {
	  		throw err;
	  	} else {
			//console.log('Last record insert id:', res.insertId);
	  	}
	});
	res.redirect('/message');
	res.end();
});


app.post('/verifyuser', function(req,res){
	//console.log('checking user in database');
	//console.log(req.body.email);
	//console.log(req.body.pass);
	
	var selectString = 'SELECT COUNT(email) FROM `'+conTable+'` WHERE email="'+req.body.email+'" AND pass="'+req.body.pass+'";';	
	
	connection.query(selectString, function(err, results) {
	    var string=JSON.stringify(results);
	    //console.log(string);

	    if (string === '[{"COUNT(email)":1}]') {
			res.redirect('/loggedin');
	    } else {
	    	console.log('Login Error: '+err);
	    	res.redirect('/showSignInPageRetry');
	    }
		res.end();
	});
});