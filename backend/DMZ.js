var express = require('express');
var mysql = require('mysql');
var app = express();

/**
 * Change the password for your mysql client when testinng
 * @type {Connection}
 */
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Digimon7645!',
    database: 'ddms'
});

connection.connect(function(err){
   if(err) throw err;
   console.log("Connected!")
});

function generateKey(){
    let key = Math.floor(Math.random() * 10000);
    return key;
}

app.get("/", function(req,res){
    //generate key and store it in DB as well as in variable
    //Send that key back to the router
    let key = generateKey();
    console.log(key);
    let sql = "INSERT INTO ValetKeys(id,state) VALUES ('" + key +"', '1')";
    console.log(sql);
    connection.query(sql, function(err, result){
        if(err) throw err;
        console.log("1 record inserted");
    });
    res.status(200);
    res.send({valetKey:key});
});



app.listen(3030, function () {
    console.log("DMZ running on port 3030");
});