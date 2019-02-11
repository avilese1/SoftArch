import express from 'express'
import axios from 'axios'
var app = express();

/***********************************e3kit setup***********************************************/
import { EThree } from '@virgilsecurity/e3kit';


// This function returns a token that will be used to authenticate requests
// to your backend.
// This is a simplified solution without any real protection, so here you need use your
// application authentication mechanism.
function authenticate(identity) {
    const response = fetch('http://localhost:3000/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identity: identity
        })
    });
    if (!response.ok) {
        throw new Error(`Error code: ${response.status} \nMessage: ${response.statusText}`);
    }

    return response.json().then(data => data.authToken);
}

// Log in as `alice`
const eThreePromise = authenticate('client').then(authToken => {
    // E3kit will call this callback function and wait for the Promise resolve.
    // When it receives Virgil JWT it can do authorized requests to Virgil Cloud.
    // E3kit uses the identity encoded in the JWT as the current user's identity.
    return EThree.initialize(getVirgilToken);

    // This function makes authenticated request to GET /virgil-jwt endpoint
    // The token it returns serves to make authenticated requests to Virgil Cloud
    async function getVirgilToken() {
        const response = await fetch('http://localhost:3000/virgil-jwt', {
            headers: {
                // We use bearer authorization, but you can use any other mechanism.
                // The point is only, this endpoint should be protected.
                Authorization: `Bearer ${authToken}`,
            }
        })
        if (!response.ok) {
            throw new Error(`Error code: ${response.status} \nMessage: ${response.statusText}`);
        }

        // If request was successful we return Promise which will resolve with token string.
        return response.json().then(data => data.virgilToken);
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
        const publicKeys = eThree.lookup('server');

        // Encrypt data using target user public keys
        const encryptedData = eThree.encrypt(new ArrayBuffer(), publicKeys);

        // Encrypt text using target user public keys
        const encryptedText = eThree.encrypt(message, publicKeys);

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

app.get('/', function(req, res){
    axios.get('').then( response => {
        res.send(decryptAndVerifySigniture('server', null, response.data)[1]);
    })
});

app.listen('8080');
console.log('working on 8080');