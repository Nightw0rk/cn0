var app = require("../index");
var config = require("../config");

app.listen(config.web.port, function () {
    console.log("start app at port " + config.web.port);
})