import express from 'express'
import axios from 'axios'
var app = express();

var testResponse = "failed";


app.get('/', function(req, res){
    try {
        var test2 = axios.get('http://localhost:3000/')
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

app.listen('8080');
console.log('working on 8080');