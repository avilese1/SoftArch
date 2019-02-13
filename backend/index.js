
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var app = express();

import { VirgilCrypto} from "virgil-crypto";
import { TextEncoder } from 'util';
import { Buffer } from 'buffer';

var clientkey = '';

//MySQL connection creation with the options needed. Replace the user and password as needed
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Digimon7645!',
    database: 'ddms'
});

//Connecting to the MySQL
connection.connect(function(err){
    if(err) throw err;
    console.log("Connected!")
});

//app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const virgilCrypto = new VirgilCrypto();

/**
 * This post request is made when the form from the frontend is submitted. It will log it into the DB tables. We may need to get the GET request too? Probably not but just
 * a thought
 */
app.post('/data/add', function(req, res) {
    var f = req.body.data;
    const buf = Buffer.from(f);
    var data = virgilCrypto.decrypt(buf, clientkey);
    console.log(data);
    console.log(data.toString('utf8'));
    /*let sql_data = "INSERT INTO patientdata(id, meal_id, glucose_level, activity_calories, activity_desc, symptoms) VALUES (";//The rest of the values go here from the front end
    let sql_meals = "INSERT INTO meal(id, fiber, calories, fats, carbs, dateRecorded) VALUES (";//The rest of the values will go here from front end
    connection.query(sql_data, function (err, result) {
        if (err) throw err;
        console.log("Patient data recorded");
    });
    connection.query(sql_meals, function (err, result) {
        if (err) throw err;
        console.log("Meal recorded");
    });*/

});

//saves the client's public key
//sends the servers public key
app.post('/publickey', (req, res) => {
    console.log("Recieved request!");
    var strings = req.body.privatekey.split(',');
    //let uint8Array = new TextEncoder("utf-8").encode(req.body.privatekey);
    //console.log(uint8Array);
    var ints = [];
    for(var i = 0; i < strings.length; i ++) {ints[i] = parseInt(strings[i]);}
    const buf = Buffer.from(ints);
    clientkey = virgilCrypto.importPrivateKey(buf);
    res.sendStatus(200);
});

//Server running
app.listen(3000, function () {
    console.log("Server listening on port 3000");
});

