var express = require('express');
var axios = require('axios');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.post('/data/add', function(req, res) {
    if(req.body.valetkey === ''){
        axios.get('http://localhost:3030/' ).then( response => {
            res.status(200);
            res.send(response.data);
        })
    }else{
        axios.post('http://localhost:3000/data/add').then( response => {
            res.sendStatus(response.status);
        })
    }
});

app.post('/publicKey', function(req, res){
    console.log(req + "\r\n" + req.body);
    if(req.body.valetkey === ''){
        axios.get('http://localhost:3030/' ).then( response => {
            res.status(200);
            res.send(response.data);
        })
    }else{
        axios.post('http://localhost:3000/publicKey').then(response => {
            res.sendStatus(response.status);
        })
    }
});

app.listen('8080');
console.log('working on 8080');