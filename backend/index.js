import express from 'express';

var bodyParser = require('body-parser');
var path = require('path');

var app = express();

process.env.VIRGIL_API_KEY_BASE64 = "MC4CAQAwBQYDK2VwBCIEIJgSjyevCeo/IIPAMGGzP1Xq3qErs8iNpE+r09YaXGSf";
process.env.VIRGIL_API_KEY_ID = "c508d2945762d5de48a23eca3db72387";
process.env.VIRGIL_APP_ID = "3a907a538f1549aba4edcb801cfb1717";

/***************************************JWT Generator*********************************************/
import { VirgilCrypto, VirgilAccessTokenSigner } from 'virgil-crypto';
import { JwtGenerator } from 'virgil-sdk';

const virgilCrypto = new VirgilCrypto();
// initialize accessTokenSigner that signs users JWTs
const accessTokenSigner = new VirgilAccessTokenSigner(virgilCrypto);

// import your API Key that you got in Virgil Dashboard from string.
const apiKey = virgilCrypto.importPrivateKey(process.env.VIRGIL_API_KEY_BASE64);

// initialize JWT generator with your Application Id and API Key Id you got in
// Virgil Dashboard and the `apiKey` object you've just imported.
const jwtGenerator = new JwtGenerator({
    appId: process.env.VIRGIL_APP_ID,
    apiKey: apiKey,
    apiKeyId: process.env.VIRGIL_API_KEY_ID,
    accessTokenSigner: accessTokenSigner,
    millisecondsToLive:  20 * 60 * 1000 // JWT lifetime - 20 minutes (default)
});

const keyPair = virgilCrypto.generateKeys();
jwtGenerator.generateToken('serverToken')

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


//Whichever middleware we need is here. Not sure what that entails just yet
/**
var logger = function (req, res, next){
  console.log("Logging");
  next();
};

app.use(logger);
*/
/**
 * This is where the front end page will go
 */

/**
 * We'll probably need the body-parser for parsing whatever from the request we receive
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
    

app.get('/', function(req, res){
    console.log("received get request.");
    res.send('Hello World');
});

/**
 * whichever post request that we need to get to the server is here
 */
app.post('/data/add', function(req, res){
   console.log("Data grabbed: " + req.body);

});


app.listen(3000, function(){
   console.log("Server listening on port 3000");
});

function decrypt_message(myname, sendersName) {
    // prepare private key (will be used to decrypt the message)
    keyStorage.load(myname).then(privatKeyEntry => {
        const bobPrivateKey = privatKeyEntry.privateKey;
        cardManager.searchCards(sendersName).then(aliceCards => {
            if (aliceCards.length > 0) {
                const alicePublicKeys = aliceCards.map(card => card.publicKey);
                const decryptedData = virgilCrypto.decryptThenVerify(
                    encryptedData,
                    bobPrivateKey,
                    alicePublicKeys
                );

                console.log(decryptedData.toString('utf8'));
            }
        });
    });
}

