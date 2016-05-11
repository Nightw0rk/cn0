var mongoose = require("mongoose");
var config = require("../../config");
mongoose.connect(config.db.connection_string);

module.exports = mongoose;