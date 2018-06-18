var express = require('express'),
	app = express(),
	mysql = require('mysql'),
	router = express.Router();

var conPass = 'rootpass',
	conDataBase = 'unboxakanban',
	conTable = 'users';

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
app.get('/authenticated',function(req,res){
	res.redirect('success');
});
app.get('/dashboard',function(req,res){
    res.sendFile('userDashboard.html',{'root': __dirname + mvcViews});
});
app.get('/sign-in',function(req,res){
    res.sendFile('userSignIn.html',{'root': __dirname + mvcViews});
});
app.get('/sign-up',function(req,res){
	res.sendFile('userSignUp.html',{'root':__dirname + mvcViews})
});

app.post('/user-create', function(req, res) {
	console.log(req.body);
	
	var results = '',
		record = {
			email: req.body.email, 
			pass: req.body.pass, 
			initials: req.body.initials
		};
		
	connection.query('INSERT INTO `'+conTable+'` SET ?', record, function(err, res){
	  	if(err) {
	  		throw err;
	  		results = err;
	  	} else {
			console.log('Last record insert id:', res.insertId);
	  		results = 'success';
	  	}
	});
	return results;
});


app.post('/user-verify', function(req, res){
	console.log('Verifying User');
	//console.log('email: '+req.body.email);
	//console.log('pass: '+req.body.pass);
	
	var results = '',
		selectString = 'SELECT COUNT(email) as found FROM `'+conTable+'` WHERE email="'+req.body.email+'" AND pass="'+req.body.pass+'";';
	
	connection.query(selectString, function(err, resu) {
	    var jsonResult = JSON.parse(JSON.stringify(resu)),
	    	_found = jsonResult[0].found;
	    
		//console.log(_found);
		if (_found === 1) {
			console.log('Login success');
	  		results = 'success';
			res.redirect('/dashboard');
		} else {
			console.log('Login error');
			results = err;
			res.redirect('/sign-in?l=user&m=failed');
		}
	});
	return results;
});