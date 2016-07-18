var mongoose = require("mongoose");
var config = require("../../config");
if(process.env.NODE_ENV!='TEST')
  mongoose.connect(config.db.connection_string);
mongoose.Promise = require('bluebird');
module.exports = mongoose;
