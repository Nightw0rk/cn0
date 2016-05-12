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

var zakazDayReportAuthor = db.schema({
    day: Number,
    month: Number,
    year: Number,
    count: Number,
    cost: Number,
    author: user.Schema

})

var zakazDayReportSalon = db.schema({
    day: Number,
    month: Number,
    year: Number,
    count: Number,
    cost: Number,
    code: Number

})

var zakazDayReportCity = db.schema({
    day: Number,
    month: Number,
    year: Number,
    count: Number,
    cost: Number,
    City: String

})
var zdrc = db.model('zakaz_dayli_city', zakazDayReportCity);
var zdra = db.model('zakaz_dayli_author', zakazDayReportAuthor);
var zdrs = db.model('zakaz_dayli_salon', zakazDayReportSalon);

function updateReportDayli(data) {
    if (data.zakaz) {
        var d = new Date();
        zdra.findOne({ day: d.getDay(), month: d.getMonth(), year: d.getFullYear, "author._id": data.author._id }, function (err, report) {
            if (!report) {
                report.count += 1;
                report.cost += data.cost;
                return report.save();
            }
            var a = new zdra({ day: d.getDay(), month: d.getMonth(), year: d.getFullYear, author: data.author, count: 1, cost: data.cost })
            return a.save();
        })
    }
}

module.export = {
    defualt: db.model('default', defaultReport),
    zakaz: {
        day: updateReportDayli(data)
    }
}