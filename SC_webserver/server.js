// Use math.random to generate random numbers for demo
import math;
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
  host     : 'pstr-mysql-east.cypjbwgldgpk.us-east-2.rds.amazonaws.com',
  port     : '3306',
  user     : 'pstr',
  password : 'smartchair15',
  database : 'test_sensor'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('You are now connected...');
})
// Got this from stackoverflow:
// http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Define the min and max of our simulated data
const simulat_data_min = 0;
const simulat_data_max = 100;

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
    var sensor1 = req.body.sensor1;
    var sensor2 = req.body.sensor2;
    var sensor3 = req.body.sensor3;
    var sensor4 = req.body.sensor4;
    var text = req.body.text;
    connection.query('INSERT INTO sensor_data (sensor1, sensor2, sensor3, sensor4, text) VALUES (?, ?, ?, ?, ?)', [sensor1, sensor2, sensor3, sensor4, text], function(err, result) {
        if (err) throw err;
        connection.query('SELECT * FROM sensor_data', function(err, results) {
            if (err) throw err;
            for(i = 0; i < results.length; i++) {
                console.log(results[i].id);
                console.log(results[i].sensor1);
                console.log(results[i].sensor2);
                console.log(results[i].sensor3);
                console.log(results[i].sensor4);
                console.log(results[i].text);
            })
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
