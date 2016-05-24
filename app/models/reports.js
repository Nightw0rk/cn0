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

var ClientUserDayli = db.Schema({
    day: Number,
    month: Number,
    year: Number,
    user: user.schema,
    count: 1
})
ClientUserDayli.static.incClient = (user) => {
    var current_date = new Date();
    db.model('user_client_dayli', ClientUserDayli).findOne(
        { day: current_date.getDate(), month: current_date.getMonth() + 1, year: current_date.getFullYear(), "user._id": user._id },
        (err, reportItem) => {
            if (err) {
                console.log("Ошибка сохранения дневного отчета", err);
            }
            if (!reportItem) {
                reportItem = new db.model('user_client_dayli', ClientUserDayli)({ day: current_date.getDate(), month: current_date.getMonth() + 1, year: current_date.getFullYear(), user: user });
            }
            reportItem.count += 1;
            reportItem.save();
        }
    )
}


module.exports = {
    default: db.model('default_report', defaultReport),
    clientUserDayli: db.model('user_client_dayli', ClientUserDayli)

}
