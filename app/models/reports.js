var db = require("../middleware/db");
var user = require("./user");
var q = require("bluebird");
var uuid = require("node-uuid");

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return {year:d.getFullYear(),week: weekNo};
}

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
    count: Number
})

var FollowingWeekReport = db.Schema({
  week: Number,
  year: Number,
  user: user.schema,
  type: String,
  count: Number
})

ClientUserDayli.statics.incClient = (user,type, cb) => {
    console.log("update client dayli report");
    var local_model = db.model('follow_client_week', FollowingWeekReport);
    var d= getWeekNumber(new Date());
    local_model.findOne(
        {
          week: d.week,
          year: d.year
          "user._id": user._id,
          type:type
        },
        (err, reportItem) => {
            if (err) {
                console.log("Ошибка сохранения дневного отчета", err);
            }
            if (!reportItem) {
                reportItem = new local_model(
                  {
                    week: d.week,
                    year: d.year
                    type:type
                  });
            }
            reportItem.count = (reportItem.count || 0) + 1;
            reportItem.save(cb);
        }
    )
}

ClientUserDayli.statics.incClient = (user, cb) => {
    var current_date = new Date();
    console.log("update client dayli report");
    var local_model = db.model('user_client_dayli', ClientUserDayli);
    local_model.findOne(
        { day: current_date.getDate(), month: current_date.getMonth() + 1, year: current_date.getFullYear(), "user._id": user._id },
        (err, reportItem) => {
            if (err) {
                console.log("Ошибка сохранения дневного отчета", err);
            }
            if (!reportItem) {
                reportItem = new local_model({ day: current_date.getDate(), month: current_date.getMonth() + 1, year: current_date.getFullYear(), user: user });
            }
            reportItem.count = (reportItem.count || 0) + 1;
            reportItem.save(cb);
        }
    )
}
ClientUserDayli.statics.getToday = function(user) {
    return new q(function(resolve, reject) {
        console.log("update client dayli report");
        var local_model = db.model('user_client_dayli', ClientUserDayli);
        var current_date = new Date();
        local_model.findOne(
            { day: current_date.getDate(), month: current_date.getMonth() + 1, year: current_date.getFullYear(), "user._id": user._id },
            (err, reportItem) => {
                if (err) {
                    return reject(err);
                }
                if (!reportItem) {
                    return resolve(0);
                }
                return resolve(reportItem.count);
            });
    });
}


module.exports = {
    default: db.model('default_report', defaultReport),
    clientUserDayli: db.model('user_client_dayli', ClientUserDayli)
    followUserWeek: db.model('follow_client_week', FollowingWeekReport)

}
