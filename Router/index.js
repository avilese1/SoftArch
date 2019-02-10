import express from 'express'
import axios from 'axios'
var app = express();

import { VirgilCrypto, VirgilCardCrypto, VirgilPrivateKeyExporter } from 'virgil-crypto';
import { PrivateKeyStorage, CardManager, VirgilCardVerifier } from 'virgil-sdk';

/*******************************Specify JWT provider*******************************/
import { CachingJwtProvider } from 'virgil-sdk';

const fetchJwt = () => {
    const response = axios.get('localhost:3000/virgil-access-token')
        .then(response => {
            if (!response.ok) {
                console.log(response);
                throw new Error('Failed to get Virgil Access Token');
            }else{
                return response.text();
            }
        });

    //console.log("error")
    // response.text();
}

const jwtProvider = new CachingJwtProvider(fetchJwt);
/************************************end*******************************************/

/*******************************Setup keys storage*********************************/
// initialize Virgil Crypto library
const virgilCrypto = new VirgilCrypto();
const privateKeyExporter = new VirgilPrivateKeyExporter(
    virgilCrypto
    // if provided, will be used to encrypt the key bytes before exporting
    // and decrypt before importing.
    //'[OPTIONAL_PASSWORD_TO_ENCRYPT_THE_KEYS_WITH]'
);

// Generate a private key
const keyPair = virgilCrypto.generateKeys();

const privateKeyStorage = new PrivateKeyStorage(privateKeyExporter);

try {
// Store the private key with optional metadata (i.e. the PrivateKeyEntry)
    privateKeyStorage.store('testKey1', keyPair.privateKey, {optional: 'data'}).then(() => {


        // Load the private key entry
        privateKeyStorage.load('my private key').then(privateKeyEntry => {
            if (privateKeyEntry === null) {
                return;
            }

            console.log(privateKeyEntry.privateKey); // VirgilPrivateKey instance
            console.log(privateKeyEntry.meta); // { optional: 'data' }

            const privateKey = privateKeyEntry.privateKey;

            // Use the privateKey in virgilCrypto operations

            // Delete a private key
            privateKeyStorage.delete('testKey1')
                .then(() => {
                    console.log('Private key has been removed');
                });
        });

    })
}catch(error){
    console.log(error.message);
}
/***************************************end****************************************/

/********************************set up card manager*******************************/
// initialize Crypto library
const cardCrypto = new VirgilCardCrypto(virgilCrypto);
const cardVerifier = new VirgilCardVerifier(cardCrypto);

// initialize cardManager and specify accessTokenProvider, cardVerifier
const cardManager = new CardManager({
    cardCrypto: cardCrypto,
    accessTokenProvider: jwtProvider,
    cardVerifier: cardVerifier
});
/***************************************end***************************************/


app.get('/', function(req, res){

    try {
        var test2 = axios.post('http://localhost:3000/data/add',
            { data: signEncryptMessage('hello world')})
            .then(response => {
                if(response.data){
                    res.write(response.data)
                    res.end();
                }
            })
    }catch (error) {
        console.log(error);
    }
});


function signEncryptMessage(message){
    privateKeyStorage.load('testKey1').then(alicePrivateKeyEntry => {
        const alicePrivateKey = alicePrivateKeyEntry.privateKey;
        cardManager.searchCards('bob@example.com').then(bobCards => {
            if (bobCards.length > 0) {
                const message = message;
                const bobPublicKeys = bobCards.map(card => card.publicKey);
                const encryptedData = virgilCrypto.signThenEncrypt(
                    message,
                    alicePrivateKey,
                    bobPublicKeys
                );

                console.log(encryptedData.toString('base64'));
                return encryptedData;
            }
        });
    });
}

app.listen('8080');
console.log('working on 8080');