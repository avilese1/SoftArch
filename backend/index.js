var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var app = express();

import { VirgilCrypto, VirgilCardCrypto, VirgilPrivateKeyExporter} from "virgil-crypto";
import { CachingJwtProvider, CardManager, PrivateKeyStorage, VirgilCardVerifier} from "virgil-sdk";

var clientkey = '';
var myKey = '';

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

/**
 * This post request is made when the form from the frontend is submitted. It will log it into the DB tables. We may need to get the GET request too? Probably not but just
 * a thought
 */
app.post('/data/add', function(req, res) {
    console.log("Data grabbed: " + req.body);
    let sql_data = "INSERT INTO patientdata(id, meal_id, glucose_level, activity_calories, activity_desc, symptoms) VALUES (";//The rest of the values go here from the front end
    let sql_meals = "INSERT INTO meal(id, fiber, calories, fats, carbs, dateRecorded) VALUES (";//The rest of the values will go here from front end
    connection.query(sql_data, function (err, result) {
        if (err) throw err;
        console.log("Patient data recorded");
    });
    connection.query(sql_meals, function (err, result) {
        if (err) throw err;
        console.log("Meal recorded");
    });

});

(async function() {
    const virgilCrypto = new VirgilCrypto();
    const cardCrypto = new VirgilCardCrypto(virgilCrypto);

    const jwtProvider = new CachingJwtProvider(fetchVirgilJwt);
    const cardVerifier = new VirgilCardVerifier(cardCrypto);
    const cardManager = new CardManager({
        cardCrypto: cardCrypto,
        accessTokenProvider: jwtProvider,
        cardVerifier: cardVerifier
    });
    const privateKeyStorage = new PrivateKeyStorage(
        new VirgilPrivateKeyExporter(
            virgilCrypto,
            '[OPTIONAL_PASSWORD_TO_ENCRYPT_THE_KEYS_WITH]'
        )
    );

    // Generate a key pair
    const keyPair = virgilCrypto.generateKeys();
    myKey = keyPair.publicKey;

    // Store the private key
    await privateKeyStorage.save('alice_private_key', keyPair.privateKey);

    // Publish user's card on the Cards Service
    const card = await cardManager.publishCard({
        privateKey: keyPair.privateKey,
        publicKey: keyPair.publicKey,
        identity: 'alice@example.com'
    });
})();

async function fetchVirgilJwt (context) {
    // assuming your backend server is serving Virgil JWT tokens in plaintext
    // at /virgil-access-token endpoint
    const response = await fetch('/virgil-access-token');
    if (!response.ok) {
        throw new Error('Failed to get Virgil Access Token');
    }

    return await response.text();
}

//saves the client's public key
//sends the servers public key
app.post('/publickey', (req, res) => {
    clientkey = req.body.publicKey;
    res.body.publicKey = myKey;
    res.sendStatus(200);
});

//Server running
app.listen(3000, function () {
    console.log("Server listening on port 3000");
});

