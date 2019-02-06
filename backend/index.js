var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();


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

