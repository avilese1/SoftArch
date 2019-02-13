import express from 'express'
import axios from 'axios'
var app = express();

app.post('/data/add', function(req, res) {
    if(req.body.valetKey == ''){
        axios.get('localhost:3030/' ).then( response => {
            res.status(307);
            res.send(response.data);
        })
    }else{
        axios.post('localhost:3000/data/add').then( response => {
            res.sendStatus(response.status);
        })
    }
});

app.post('/publicKey', function(req, res){
    if(req.body.valetKey == ''){
        axios.get('localhost:3030/' ).then( response => {
            res.status(307);
            res.send(response.data);
        })
    }else{
        axios.post('localhost:3000/publicKey').then(response => {
            res.sendStatus(response.status);
        })
    }
});

app.listen('8080');
console.log('working on 8080');