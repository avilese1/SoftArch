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
    console.log("I'm here bitches!");
    if(req.body.valetkey === ''){
        axios.get('http://localhost:3030/' ).then( response => {
            res.status(200);
            res.send(response.data);
        })
    }else{
        console.log("I'm ready to party!");
        axios.post('http://localhost:3000/data/add',{data: req.body.data}).then( response => {
            res.sendStatus(response.status);
        })
    }
});

app.post('/publicKey', function(req, res){
    console.log(req + "\r\n" + req.body);
    console.log(req.body.privatekey);
    if(req.body.valetkey === ''){
        axios.get('http://localhost:3030/' ).then( response => {
            res.status(200);
            res.send(response.data);
        })
    }else{
        axios.post('http://localhost:3000/publicKey', {privatekey: req.body.privatekey}).then(response => {
            console.log(response.status);
            if(response.status === 200) {
                res.status(200);
                res.send({inquiry: "Can I get a snack, boo boo?"});
            }else{
                console.log("You shouldn't have come here");
            }
        });
    }
});

app.listen('8080');
console.log('working on 8080');