// Set up
var express = require('express');
var app = express();
var mysql = require('mysql');
// connect to SQL database
/*
 * connection.connect( func(err){} ) to connect to the database
 * connecttion.end( func(err){} ) to end the connection
 * connection.query('SQL COMMAND', func(err, results, fields){}) to write/read
 *
 * for more details of mysql connection:
 *  https://github.com/mysqljs/mysql
 */
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dev',
  password : 'wearethebest',
  database : 'my_db'
});

// for filereader
var fs = require("fs");
// for reading post requests
var bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({extended:true}));
// Set up port
var port = 3000;

// A sample of getting list of users api
app.get('/listUsers', function(req, res) {
    fs.readFile(__dirname + "/" + "data.json", 'utf8', function(err, data) {
        if(err){ console.log(err);}
        res.end(data);
        console.log('Send list of users');
    });
});

// other general requests
app.get('/',function(req,res){
    // console.log(req.route);
    console.log('Normal get request');
    console.log(req.query);
    res.end('Hello Team');
});

// sample post request, does not do anything yet
app.post('/', function(req, res) {
    console.log(req.body);
    res.end('Received a post request');
});


// start the server
app.listen(port, 'localhost', function(err) {

    if (err) {
        console.log(err);
        return;
    }

    console.log("Listening at http://localhost:%s", port)

});
