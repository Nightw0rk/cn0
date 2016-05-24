var db = require("../middleware/db");
var user = require("./user");
var q = require("bluebird");
var uuid = require("node-uuid");

var defaultReport = db.Schema({
    stamp: { type: Date, defualt: Date.now() },
    author: user.schema,
    fio: String,
    phone: String,
    birthdate: Date,
    city: String,
    address: String,
    follow: String, //  Откуда пришел
    zakaz: String, // order number zakaz
    demension: String, // order number demension
    modelZakaz: String,
    cost: String,
    example: Boolean, // Только прорисовка
    exampleNumber: String,
    recall: Boolean, // Повторное обращение
})


module.exports = {
    default: db.model('default_report', defaultReport)
}
