var express = require("express");
var app = express();
var dns = require('dns');
var json_parser = require("express-json");
var bodyParser = require("body-parser");
var config = require('./config');
var cors =require("cors");
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())

dns.resolve4(process.env.MONGO_HOST||'127.0.0.1',function(err,address){
  if(address){
    config.db.connection_string = "mongodb://"+address.join()+"/crm"+(process.env.MONGO_REPLICA||'')
  }
  app.use("/auth", require("./app/routes/auth"));
  app.use("/reports", require("./app/routes/reports"));
})
module.exports = app;
