var express = require("express");
var app = express();
var dns = require('dns');
var json_parser = require("express-json");
var bodyParser = require("body-parser");
var config = require('./config');
var cors = require("cors");
var es = require('elasticsearch')
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())

dns.resolve4(process.env.MONGO_HOST || '192.168.0.176', function (err, address) {
  if (address) {
    config.db.connection_string = "mongodb://" + address.join() + "/crm" + (process.env.MONGO_REPLICA || '')
  }
  dns.resolve4(process.env.ES_HOST || '192.168.0.176:9200', function (err, address) {
    config.es.client = new es.Client({
      host: address ? address.join : '192.168.0.176:9200',
      log: 'trace'
    })
    app.use("/auth", require("./app/routes/auth"));
    app.use("/reports", require("./app/routes/reports"));
    app.use("/clients",require("./app/routes/clients"))
  })
})
module.exports = app;
