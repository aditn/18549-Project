var express = require('express');
var router = express.Router();

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
});

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

router.get('/sensor_data', function(req, res){
    var sensor1 = getRandomInt(simulat_data_min,simulat_data_max);
    var sensor2 = getRandomInt(simulat_data_min,simulat_data_max);
    var sensor3 = getRandomInt(simulat_data_min,simulat_data_max);
    var sensor4 = getRandomInt(simulat_data_min,simulat_data_max);

    var data = {
        'sensor1': sensor1,
        'sensor2': sensor2,
        'sensor3': sensor3,
        'sensor4': sensor4
    };
    console.log('sensor_data');
    res.json(data);
});

router.get('/data', function(req, res){
    console.log(req.query.number);

    var num = req.query.number;
    if (typeof num === 'undefined' || num === null) {
        connection.query('SELECT * FROM sensor_data', function(err, results) {
            if (err) throw err;
            var json_text = JSON.stringify(results);
            var data = JSON.parse(json_text);
            res.json(data);
        });
    } else {
        connection.query('SELECT * FROM (SELECT * FROM sensor_data ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC', function(err, results) {
            if (err) throw err;
            var json_text = JSON.stringify(results);
            var data = JSON.parse(json_text);
            res.json(data);
        });
    }

    console.log('real_data');
});

router.get('/', function(req, res, next) {
    console.log('Normal GET request');
    res.end('Hello Team');
    //res.render('index', { title: 'PSTR' });
});

// assuming there is already a table called 'people' created
// rows: int id, string name, int age
// post request = JSON object with string name, int age
router.post('/', function(req, res) {
    console.log(req.body);
    var sensor1 = req.body.sensor0;
    var sensor2 = req.body.sensor1;
    var sensor3 = req.body.sensor2;
    var sensor4 = req.body.sensor3;
    var text = req.body.text;
    connection.query('INSERT INTO sensor_data (sensor1, sensor2, sensor3, sensor4, text) VALUES (?, ?, ?, ?, ?)', [sensor1, sensor2, sensor3, sensor4, text], function(err, result) {
        if (err) throw err;
        });
        var data = {'sensor1':sensor1,
                    'sensor2':sensor2,
                    'sensor3':sensor3,
                    'sensor4':sensor4,
                    'text':'text'};
        res.end('Received a post request');
});

module.exports = router;
