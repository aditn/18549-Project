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
    else console.log('You are now connected...');
});

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Current user
var cur_user = 'test';

// Define the min and max of our simulated data
const simulat_data_min = 0;
const simulat_data_max = 100;

// Constants for posture checking
const acceptable_range = 0.15; // acceptable deviation from expected proportions
const min_weight = 10; // minimum weight (kg) to be detected as seated
const std_back_weight_perc = 0.8; // theoretical weight on butt and back of chair 
const std_front_weight_perc = 1 - std_back_weight_perc; // theoretical weight on front of chair
const data_array = ['seated', 'sb_l_perc', 'sb_r_perc', 'sf_l_perc', 'sf_r_perc', 'correct_posture', 'posture_score', 'posture_status'];
/**
 * Returns JSON object with weight distribution percentages and posture correctness and score
 */
function checkPosture(sb_l, sb_r, sf_l, sf_r, st, bl, bu) {
    var json_data = {};

    var seated = 0; // whether there is someone sitting on the chair
    var correct_posture = 0; // whether the user's posture is good enough
    var posture_score = 0; // score from 0 to 1

    // measured weight percentages
    var meas_back_weight_perc = 0;
    var meas_front_weight_perc = 0;
    
    if (sb_l + sb_r + sf_l + sf_r < min_weight) {
        // if not seated, set all percentages and scores to 0
        for (i = 0; i < data_array.length; i++) {
            json_data[data_array[i]] = 0;
        }
        return json_data;
    } else {
        // seated
        seated = 1;
        var meas_back_weight = sb_l + sb_r;
        var meas_front_weight = sf_l + sf_r;

        // calculate back and front weight percentages
        meas_back_weight_perc = meas_back_weight/(meas_back_weight+meas_front_weight);
        meas_front_weight_perc = meas_front_weight/(meas_back_weight+meas_front_weight);
        
        // binary posture check
        if (sb_l < sb_r * (1-acceptable_range) || sb_l > sb_r * (1+acceptable_range) 
                || meas_back_weight_perc < std_back_weight_perc - acceptable_range 
                || meas_back_weight_perc > std_back_weight_perc + acceptable_range 
                || st <= 0 || bl <= 0 || bu <= 0) {
            correct_posture = 0;
        } else {
            correct_posture = 1;
        }

        // calculate posture score
        posture_score = Math.max(0,
                        1 - Math.abs(std_back_weight_perc - meas_back_weight_perc) 
                        - Math.abs(std_front_weight_perc - meas_front_weight_perc) 
                        - Math.abs(0.5 - sb_r/(sb_l + sb_r))*2);
        if (st <= 0) posture_score -= 0.05;
        if (bl <= 0) posture_score -= 0.05;
        if (bu <= 0) posture_score -= 0.05;

        // seat left and right weight percentages
        var left_perc = (sb_l + sf_l) / (sb_l + sf_l + sb_r + sf_r);
        var right_perc = 1 - left_perc;

        // calculate weight percentages on each portion of the seat cushion
        var sb_l_perc_raw = (meas_back_weight_perc*left_perc); 
        var sb_r_perc_raw = (meas_back_weight_perc*right_perc); 
        var sf_l_perc_raw = (meas_front_weight_perc*left_perc); 
        var sf_r_perc_raw = (meas_front_weight_perc*right_perc); 
        
        var sb_l_perc = sb_l_perc_raw - (std_back_weight_perc/2) + 0.25;
        var sb_r_perc = sb_r_perc_raw - (std_back_weight_perc/2) + 0.25;
        var sf_l_perc = sf_l_perc_raw - (std_front_weight_perc/2) + 0.25;
        var sf_r_perc = sf_r_perc_raw - (std_front_weight_perc/2) + 0.25;

        console.log(sb_l_perc_raw);

        var posture_status = postureStatus(sb_l_perc_raw, sb_r_perc_raw, 
                sf_l_perc_raw, sf_r_perc_raw, 
                st, bl, bu,
                left_perc, right_perc,
                meas_back_weight_perc, meas_front_weight_perc);

        // put values into JSON
        for (i = 0; i < data_array.length; i++) {
            json_data[data_array[i]] = eval(data_array[i]);
        }
        return json_data;
    }
}

// Posture status strings
const status_strings = ['Good posture',
                        'You are sitting too far forward in your seat',
                        'You are slouching down too much',
                        'You are leaning too far forward',
                        'Your shoulders are too slouched',
                        'Your weight is too much to the left',
                        'Your weight is too much to the right']
// Examines weight percentages and determines status of current posture
function postureStatus(sb_l_perc, sb_r_perc, sf_l_perc, sf_r_perc, st, bl, bu, 
        left_perc, right_perc, meas_back_weight_perc, meas_front_weight_perc) {
    var posture_status = null;

    // Determine vertical posture
    if (left_perc < 0.5+ acceptable_range 
            && left_perc > 0.5 - acceptable_range
            //&& meas_back_weight_perc > std_back_weight_perc - acceptable_range 
            && meas_back_weight_perc < std_back_weight_perc + acceptable_range 
            && st > min_weight && bl > min_weight && bu > min_weight) {
        // Good
        posture_status = status_strings[0];
    } else if (st <= 0 && bl <= 0 && bu <= 0) {
        // sitting too far forward
        posture_status = status_strings[1];
    } else if (st <= 0 && (bl > 0 || bu > 0)) {
        // butt too forward
        posture_status = status_strings[2];
    } else if (st > 0 && (sf_l_perc+sf_r_perc > std_front_weight_perc+acceptable_range)) {
        // leaning forward
        posture_status = status_strings[3];
    } else if (st <= 0) {
        // slouched shoulders
        posture_status = status_strings[4];
    } 

    // Determine horizontal posture
    if (left_perc > 0.5+acceptable_range) {
        // leaning too left
        if (posture_status !== null) {
            posture_status = posture_status + ', and ' + toLowerCase(status_strings[5]);
        } else {
            posture_status = status_strings[5];
        }
    } else if (right_perc > 0.5+acceptable_range) {
        // leaning too right
        if (posture_status !== null) {
            posture_status = posture_status + ', and ' + toLowerCase(status_strings[6]);
        } else {
            posture_status = status_strings[6];
        }
    }

    // Add period to end, else send error message if status is null
    if (posture_status !== null) {
        posture_status = posture_status + '.';
    } else {
        posture_status = '';
        /*posture_status = 'ERROR NO STATUS. sb_l: ' + sb_l_perc
                            + ' sb_r: ' + sb_r_perc
                            + ' sf_l: ' + sf_l_perc
                            + ' sf_r: ' + sf_r_perc;*/
    }

    return posture_status;
}

// Get random sensor data for testing
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
    console.log('random_data');
    res.json(data);
});

// Get data from real database
router.get('/data2', function(req, res){
    var num = req.query.number;
    var user = req.query.user;
    // check if valid number in param
    if (isNaN(num) || parseInt(num) < 1) {
        num = null;
    }

    // check if valid user in param
    if (typeof user === 'undefined' || user === null || user.length == 0) {
        user = 'test';
    }

    // If number specified, get N rows from database, else get all rows
    if (typeof num === 'undefined' || num === null) {
        console.log(user);
        connection.query('SELECT * FROM sensor_data3 WHERE user=\'' + user + '\'', function(err, results) {
            if (err) res.end('GET request database query error.');
            var json_text = JSON.stringify(results);
            var data = JSON.parse(json_text);
            res.json(data);
        });
    } else {
        connection.query('SELECT * FROM (SELECT * FROM sensor_data3 WHERE user=\'' + user + '\' ORDER BY id DESC LIMIT ' + num + ') sub ORDER BY id ASC', function(err, results) {
            if (err) res.end('GET request database query error.');
            var json_text = JSON.stringify(results);
            var data = JSON.parse(json_text);
            res.json(data);
        });
    }

    console.log('final_data');
});

// Get data from testing database
router.get('/data', function(req, res){
    var num = req.query.number;
    if (isNaN(num) || parseInt(num) < 1) {
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

router.get('/', function(req, res) {
    console.log('Normal GET request');
    res.end('Hello Team');
    //res.render('index', { title: 'PSTR' });
});

// On POST request, perform posture checking and add weights and proportions to database
router.post('/', function(req, res) {
    let timestamp = new Date();
    dateformat(timestamp, 'yyyymmddhhmmss');

    // Get values from POST data
    var user = cur_user;
    var sb_l = req.body.sensor1;
    var sb_r = req.body.sensor2;
    var sf_l = req.body.sensor4;
    var sf_r = req.body.sensor3;
    var st = Math.min(req.body.fsr1, 0.25);
    var bl = Math.min(req.body.fsr2, 0.25);
    var bu = Math.min(req.body.fsr3, 0.25);

    // Check posture
    var posture_data = checkPosture(sb_l, sb_r, sf_l, sf_r, st, bl, bu);

    if (posture_data['seated'] == 0) {
        res.end('Not Seated');
        // Insert data to database
        connection.query('INSERT INTO sensor_data3 (user, sb_l_weight, \
                          sb_r_weight, sf_l_weight, sf_r_weight, st, bl, bu, \
                          sb_l_perc, sb_r_perc, sf_l_perc, sf_r_perc, \
                          seated, correct, score, status_msg, timestamp) \
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                         [user, sb_l, sb_r, sf_l, sf_r, st, bl, bu, 
                          posture_data['sb_l_perc'], posture_data['sb_r_perc'], 
                          posture_data['sf_l_perc'], posture_data['sf_r_perc'], 
                          posture_data['seated'], posture_data['correct_posture'], 
                          posture_data['posture_score'], posture_data['posture_status'], 
                          timestamp], function(err, result) {
            if (err) res.end('Post request database query error.');
        });
    } else {
        if (posture_data['correct_posture'] == 0) {
            res.end("Incorrect Posture. " + posture_data['posture_status'] + " Score: " + posture_data['posture_score']);
        } else {
            res.end("Correct Posture. " + posture_data['posture_status'] + " Score: " + posture_data['posture_score']);
        }

        // Insert data to database
        connection.query('INSERT INTO sensor_data3 (user, sb_l_weight, \
                          sb_r_weight, sf_l_weight, sf_r_weight, st, bl, bu, \
                          sb_l_perc, sb_r_perc, sf_l_perc, sf_r_perc, \
                          seated, correct, score, status_msg, timestamp) \
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                         [user, sb_l, sb_r, sf_l, sf_r, st, bl, bu, 
                          posture_data['sb_l_perc'], posture_data['sb_r_perc'], 
                          posture_data['sf_l_perc'], posture_data['sf_r_perc'], 
                          posture_data['seated'], posture_data['correct_posture'], 
                          posture_data['posture_score'], posture_data['posture_status'], 
                          timestamp], function(err, result) {
            if (err) res.end('Post request database query error.');
        });
    }
});

router.post('/user', function(req, res) {
    var user = req.body.user;

    if (user === 'undefined' || user === null || !user) {
        res.end('User not defined.');
    } else {
        cur_user = user;
        res.end('Current user is ' + user);
    }
});

module.exports = router;
