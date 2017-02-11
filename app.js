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
    console.log('Node server running @ http://localhost:3000')
});

// ROUTING
var mvcViews =  '/views/dist';

app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/resources/style',  express.static(__dirname + '/resources/style'));
app.use('/resources/script',  express.static(__dirname + '/resources/script'));

app.get('/',function(req,res){
    res.sendFile('home.html',{'root': __dirname + mvcViews});
});
app.get('/user',function(req,res){
    res.sendFile('user.html',{'root': __dirname + mvcViews});
});
app.get('/sign-in',function(req,res){
    res.sendFile('userSignIn.html',{'root': __dirname + mvcViews});
});
app.get('/sign-in-retry',function(req,res){
    res.sendFile('userSignInRetry.html',{'root': __dirname + mvcViews});
});
app.get('/signed-in',function(req,res){
    res.sendFile('userSignedIn.html',{'root': __dirname + mvcViews});
});
app.get('/sign-up',function(req,res){
	res.sendFile('userSignUp.html',{'root':__dirname + mvcViews})
});
app.get('/signed-up',function(req,res){
    res.sendFile('userSignedUp.html',{'root': __dirname + mvcViews});
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
	res.redirect('/signed-up');
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
			res.redirect('/signed-in');
	    } else {
	    	console.log('Login Error: '+err);
	    	res.redirect('/sign-in-retry');
	    }
		res.end();
	});
});