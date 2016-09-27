var user = require('./user');
var client = require('./client');
var global = require('./global');
var db = require("../middleware/db");

var task = db.Schema({
    responsible: user.schema,
    watching:user.schema,
    about:client.clientSchema,
    start: Date,
    end: Date,
    comments:[global.comment],
    title: String,
    result: String,
    closed: Boolean
})
module.exports = db.model('task',task);