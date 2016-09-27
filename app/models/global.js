var db = require("../middleware/db");
var user = require('./user');

var comment = db.Schema({
    stamp: { type: Date, default: Date.now() },
    commentator: user.schema,
    message: String
});

module.exports = {
    commentModel: db.model('comment', comment),
    comment: comment
}