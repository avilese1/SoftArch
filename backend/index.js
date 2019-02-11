var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');

var app = express();

const cors = require('cors');

const keyPair = virgilCrypto.generateKeys();
jwtGenerator.generateToken('serverToken');

app.get('/virgil-access-token', (req, res) => {
    // Get the identity of the user making the request (this assumes the request
    // is authenticated and there is middleware in place that populates the
    // `req.user` property with the user record).
    // Identity can be anything as long as it's unique for each user (e.g. email,
    // name, etc.). You can even obfuscate the identity of your users so that
    // Virgil Security doesn't know your actual user identities.
    const jwt = jwtGenerator.generateToken('1234');
    console.log('generated token')
    req.send(jwt.toString());
    //req.send("hello world!");
});
/***************************************end*****************************************************/

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Digimon7645!',
    database: 'ddms'
});

connection.connect(function(err){
    if(err) throw err;
    console.log("Connected!")
});

//Whichever middleware we need is here. Not sure what that entails just yet

/***********************************e3kit setup***********************************************/
import { EThree } from '@virgilsecurity/e3kit';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//This GET request is just to see if the server is up and running when called from localhost.
app.get('/', function(req, res){
    console.log("received get request.");
    res.send('Hello World');
});

/**
 * This post request is made when the form from the frontend is submitted. It will log it into the DB tables. We may need to get the GET request too? Probably not but just
 * a thought
 */
app.post('/data/add', function(req, res){
   console.log("Data grabbed: " + req.body);
   let sql_data = "INSERT INTO patientdata(id, meal_id, glucose_level, activity_calories, activity_desc, symptoms) VALUES (";//The rest of the values go here from the front end
   let sql_meals = "INSERT INTO meal(id, fiber, calories, fats, carbs, dateRecorded) VALUES (";//The rest of the values will go here from front end
   connection.query(sql_data, function (err, result) {
        if (err) throw err;
        console.log("Patient data recorded");
    });
   connection.query(sql_meals, function(err,result){
      if (err) throw err;
      console.log("Meal recorded");
   });

function signAndEncryptData(message) {
    eThreePromise.then(eThree => {
        /************************************sign and encrypt data************************************/
            // TODO: initialize and register user (see EThree.initialize and EThree.register)

            // aliceUID and bobUID - strings with identities of users that receive message

        // Lookup user public keys
        //const publicKeys = eThree.lookupPublicKeys(usersToEncryptTo);
        const publicKeys = eThree.lookup('client');

        // Encrypt data using target user public keys
        const encryptedData = eThree.encrypt(new ArrayBuffer(), publicKeys);

        // Encrypt text using target user public keys
        const encryptedText = eThree.encrypt( message, publicKeys);

        return {encryptedData, encryptedText};
        /************************************sign and encrypt data************************************/
    })
}

function decryptAndVerifySigniture(sender, encryptedData, encryptedText){
    eThreePromise.then(async (eThree) => {
        // TODO: initialize SDK and register users - see EThree.initialize and EThree.register

        // bobUID - string with sender identity
        // Lookup origin user public keys
        const publicKey = await eThree.lookup(sender);

        // Decrypt data and verify if it was really written by Bob
        const decryptedData = await eThree.decrypt(encryptedData, publicKey);

        // Decrypt text and verify if it was really written by Bob
        const decryptedText = await eThree.decrypt(encryptedText, publicKey);

        return {decryptedData, decryptedText};
    })
}

/***********************************e3kit setup******************************************************/

app.get('/hello-world', (req, res) => {
    var data = signAndEncryptData("Hello World!");
    res.send(data[1])
});

app.listen(3000, function(){
   console.log("Server listening on port 3000");
});

