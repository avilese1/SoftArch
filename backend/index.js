import express from 'express';

var bodyParser = require('body-parser');
var path = require('path');

var app = express();

const cors = require('cors');

const { requireAuthHeader, generateUserToken, pseudoEncodeToken } = require('./api/userValidation');
const { authenticate } = require('./api/authenticate');
const { generateVirgilJwt, generateMyVirgilJwt } = require('./api/virgilToken');

app.use(cors({ origin: true, methods: 'OPTIONS,POST,GET', }));
app.use(express.json());

app.post('/authenticate', authenticate);

app.get('/virgil-jwt', requireAuthHeader, generateVirgilJwt);
app.use(express.static('./public/'));

module.exports = app;

/***********************************e3kit setup***********************************************/
import { EThree } from '@virgilsecurity/e3kit';


// This function returns a token that will be used to authenticate requests
// to your backend.
// This is a simplified solution without any real protection, so here you need use your
// application authentication mechanism.
function authenticateMe(identity){
    const token = generateUserToken();
    pseudoEncodeToken(identity, token);
    return token;
}
// Log in as `alice`
const eThreePromise = authenticateMe('server').then(authToken => {
    // E3kit will call this callback function and wait for the Promise resolve.
    // When it receives Virgil JWT it can do authorized requests to Virgil Cloud.
    // E3kit uses the identity encoded in the JWT as the current user's identity.
    return EThree.initialize(getVirgilToken);

    // This function makes authenticated request to GET /virgil-jwt endpoint
    // The token it returns serves to make authenticated requests to Virgil Cloud
    async function getVirgilToken() {
         return generateMyVirgilJwt(pseudoDecodeToken(authToken)).toString()
    }
});

eThreePromise.then(eThree => {
    /************************************registers users on cloud*********************************/
    // TODO: initialize
    eThree.register()
        .then(() => console.log('success'))
        .catch(e => console.error('error: ', e));
    /************************************registers users on cloud*********************************/
})

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

