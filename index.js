var express = require("express");
var app = express();
var json_parser = require("express-json");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use("/auth", require("./app/routes/auth"));
app.use("/reports", require("./app/routes/report"));
module.exports = app;