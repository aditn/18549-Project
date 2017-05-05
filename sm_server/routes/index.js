var express = require('express');
var router = express.Router();
const dateformat = require('dateformat');

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
    if (err) console.log('Database connection error.');
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

// Constants for posture checking
const acceptable_range = 0.1; // acceptable deviation from expected proportions
const min_weight = 3; // minimum weight to be detected as seated
const std_back_weight_perc = 0.6725; // theoretical weight on butt and back of chair 
const std_front_weight_perc = 1 - std_back_weight_perc; // theoretical weight on front of chair
const data_array = ['seated', 'sb_l_perc', 'sb_r_perc', 'sf_l_perc', 'sf_r_perc', 'correct_posture', 'posture_score'];
/**
 * Returns JSON object with weight distribution percentages and posture correctness and score
 */
function checkPosture(sb_l, sb_r, sf_l, sf_r, st, bl, bu) {
    var json_data = {};

    var seated = 0;
    var correct_posture = 0;
    var posture_score = 0;

    var meas_back_weight_perc = 0;
    var mean_back_weight_perc = 0;
    
    if (sb_l < min_weight || sb_r < min_weight || sf_l < min_weight || sf_r < min_weight) {
        json_data['seated'] = 0;
        return json_data;
    } else {
        seated = 1;
        var meas_back_weight = sb_l + sb_r + st + bl + bu;
        var meas_front_weight = sf_l + sf_r;

        meas_back_weight_perc = meas_back_weight/(meas_back_weight+meas_front_weight);
        meas_front_weight_perc = meas_front_weight/(meas_back_weight+meas_front_weight);

        if (sb_l < sb_r * (1-acceptable_range) || sb_l > sb_r * (1+acceptable_range) 
                || meas_back_weight_perc < std_back_weight_perc - acceptable_range 
                || meas_back_weight_perc > meas_back_weight_perc + acceptable_range 
                || st < min_weight || bl < min_weight || bu < min_weight) {
            correct_posture = 0;
        } else {
            correct_posture = 1;
            posture_score = 1 - Math.abs(std_back_weight_perc - meas_back_weight_perc) 
                            - Math.abs(std_front_weight_perc - meas_front_weight_perc) 
                            - Math.abs(0.5 - sb_r/(sb_l + sb_r))*2;
        }

        var left_perc = (sb_l + sf_l) / (sb_l + sf_l + sb_r + sf_r);
        var right_perc = 1 - left_perc;

        var sb_l_perc = meas_back_weight_perc * left_perc;
        var sb_r_perc = meas_back_weight_perc * right_perc;
        var sf_l_perc = meas_front_weight_perc * left_perc;
        var sf_r_perc = meas_front_weight_perc * right_perc;

        for (i = 0; i < data_array.length; i++) {
            json_data[data_array[i]] = eval(data_array[i]);
        }

        return json_data;
    }
}

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

router.get('/data2', function(req, res){
    var num = req.query.number;
    if (isNaN(num) || parseInt(num) < 1) {
        console.log('here');
        num = null;;
    }
    console.log(num)
    if (typeof num === 'undefined' || num === null) {
        connection.query('SELECT * FROM sensor_data2', function(err, results) {
            if (err) res.end('GET request database query error.');
            var json_text = JSON.stringify(results);
            var data = JSON.parse(json_text);
            res.json(data);
        });
    } else {
        connection.query('SELECT * FROM (SELECT * FROM sensor_data2 ORDER BY id DESC LIMIT ' + num + ') sub ORDER BY id ASC', function(err, results) {
            if (err) res.end('GET request database query error.');
            var json_text = JSON.stringify(results);
            var data = JSON.parse(json_text);
            res.json(data);
        });
    }

    console.log('final_data');
});


router.get('/data', function(req, res){
    var num = req.query.number;
    if (isNaN(num) || parseInt(num) < 1) {
        console.log('here');
        num = null;;
    }
    console.log(num)
    if (typeof num === 'undefined' || num === null) {
        connection.query('SELECT * FROM sensor_data', function(err, results) {
            if (err) res.end('GET request database query error.');
            var json_text = JSON.stringify(results);
            var data = JSON.parse(json_text);
            res.json(data);
        });
    } else {
        connection.query('SELECT * FROM (SELECT * FROM sensor_data ORDER BY id DESC LIMIT ' + num + ') sub ORDER BY id ASC', function(err, results) {
            if (err) res.end('GET request database query error.');
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

    let timestamp = new Date();
    dateformat(timestamp, 'yyyymmddhhmmss');

    var user = "test";
    var sb_l = req.body.sensor1;
    var sb_r = req.body.sensor2;
    var sf_l = req.body.sensor4;
    var sf_r = req.body.sensor3;
    var st = req.body.fsr1;
    var bl = req.body.fsr2;
    var bu = req.body.fsr3;

    var posture_data = checkPosture(sb_l, sb_r, sf_l, sf_r, st, bl, bu);

    if (posture_data['seated'] == 0) {
        res.end('Not Seated');
    } else {
        if (posture_data['correct_posture'] == 0) {
            res.end("Incorrect Posture. Score: " + posture_data['posture_score']);
        } else {
            res.end("Correct Posture. Score: " + posture_data['posture_score']);
        }

        connection.query('INSERT INTO sensor_data2 (user, sb_l_weight, sb_r_weight, sf_l_weight, sf_r_weight, st, bl, bu, sb_l_perc, sb_r_perc, sf_l_perc, sf_r_perc, correct, score, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                         [user, sb_l, sb_r, sf_l, sf_r, st, bl, bu, posture_data['sb_l_perc'], posture_data['sb_r_perc'], posture_data['sf_l_perc'], posture_data['sf_r_perc'], posture_data['correct_posture'], posture_data['posture_score'], timestamp], function(err, result) {
            if (err) res.end('Post request database query error.');
        });
    }
});

module.exports = router;
