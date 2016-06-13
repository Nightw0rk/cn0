var db = require("../middleware/db");
var user = require("./user");
var q = require("bluebird");
var uuid = require("node-uuid");
var reportUtils = require('../utils/reports')

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    return { year: d.getFullYear(), week: weekNo };
};

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
    social: String,
    example: Boolean, // Только прорисовка
    exampleNumber: String,
    recall: Boolean, // Повторное обращение
});

var ClientUserDayli = db.Schema({
    stamp: { type: Date, default: Date.now() },
    day: Number,
    month: Number,
    year: Number,
    user: user.schema,
    count: Number
});

var FollowingWeekReport = db.Schema({
    stamp: { type: Date, default: Date.now() },
    week: Number,
    year: Number,
    user: user.schema,
    type: String,
    count: Number
});
FollowingWeekReport.statics.getWeekStats = (user, cb) => {
    if (user.NameType == 'Консультант') {
        return cb("Ошибка досутпа");
    }
    var local_model = db.model('follow_client_week', FollowingWeekReport);
    var d = getWeekNumber(new Date());
    local_model.aggregate([
        {
            $match: {
                week: d.week,
                year: d.year,
                "user.Sotrud.Deportament.HeadId": user.Sotrud.Id
            }
        },
        {
            $group: {
                _id: { week: "$week", year: "$year", type: "$type" },
                count: { $sum: "$count" }
            }
        }
    ], (err, reportItem) => {
        if (err) {
            return cb(err);
        }
        if (!reportItem) {
            return cb(null, null);
        }
        return cb(null, reportItem);
    })
}

FollowingWeekReport.statics.incClient = (user, type, cb) => {
    console.log("update client dayli report");
    var local_model = db.model('follow_client_week', FollowingWeekReport);
    var d = getWeekNumber(new Date());
    local_model.findOne(
        {
            week: d.week,
            year: d.year,
            'user.Id': user.Id,
            type: type
        },
        (err, reportItem) => {
            if (err) {
                console.log("Ошибка сохранения дневного отчета", err);
            }
            if (!reportItem) {
                reportItem = new local_model(
                    {
                        week: d.week,
                        year: d.year,
                        type: type,
                        user: user
                    });
            }
            reportItem.count = (reportItem.count || 0) + 1;
            reportItem.save(cb);
        }
    )
};

ClientUserDayli.statics.incClient = (user, cb) => {
    var current_date = new Date();
    console.log("update client dayli report");
    var local_model = db.model('user_client_dayli', ClientUserDayli);
    local_model.findOne(
        { day: current_date.getDate(), month: current_date.getMonth() + 1, year: current_date.getFullYear(), "user.Id": user.Id },
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
};

FollowingWeekReport.statics.getByRange = params => {
    return new q((ressove, reject) => {
        if (!params.range.start || !params.range.end) {
            return reject(new Error('Не верно задан преиод'));
        }
        if (!params.user) {
            return reject(new Error('Не верно задан пользователь'));
        }
        params.model = db.model('follow_client_week', ClientUserDayli);        
        if (params.user.NameType == 'Рук. Салона') {
            return resolve(reportUtils.getFollowByRangeToHeadSalon(params));
        }
        if (params.user.NameType == 'Рук. Салона') {
            return resolve(reportUtils.getFollowByRangeToHeadBranch(params));
        }
        if (params.user.NameType == 'ОтделПродаж' || params.user.NameType == 'СуперАдминистратор') {
            return resolve(reportUtils.getFollowByRangeToMaster(params));
        }
    });
}

ClientUserDayli.statics.getByRange = params => {
    return new q((ressove, reject) => {
        if (!params.range.start || !params.range.end) {
            return reject(new Error('Не верно задан преиод'));
        }
        if (!params.user) {
            return reject(new Error('Не верно задан пользователь'));
        }
        params.model = db.model('user_client_dayli', ClientUserDayli);
        if (params.user.NameType == 'Консультант') {
            return resolve(reportUtils.getClientByRangeToConsultant(params));
        }
        if (params.user.NameType == 'Рук. Салона') {
            return resolve(reportUtils.getClientByRangeToHeadSalon(params));
        }
        if (params.user.NameType == 'Рук. Салона') {
            return resolve(reportUtils.getClientByRangeToHeadBranch(params));
        }
        if (params.user.NameType == 'ОтделПродаж' || params.user.NameType == 'СуперАдминистратор') {
            return resolve(reportUtils.getClientByRangeToMaster(params));
        }
    });
}

ClientUserDayli.statics.getToday = function (user) {
    return new q(function (resolve, reject) {
        console.log("update client dayli report");
        var local_model = db.model('user_client_dayli', FollowingWeekReport);
        var current_date = new Date();
        if (user.NameType == 'Консультант') {
            local_model.findOne(
                { day: current_date.getDate(), month: current_date.getMonth() + 1, year: current_date.getFullYear(), "user.Id": user.Id },
                (err, reportItem) => {
                    if (err) {
                        return reject(err);
                    }
                    if (!reportItem) {
                        return resolve(0);
                    }
                    resolve(reportItem.count);
                });
        } else {
            if (user.NameType == 'Рук. Салона') {
                local_model.aggregate([
                    {
                        $match: {
                            day: current_date.getDate,
                            month: current_date.getMonth() + 1,
                            year: current_date.getFullYear,
                            "user.Sotrud.Deportament.HeadId": user.Sotrud.Id
                        }
                    },
                    {
                        $group: {
                            _id: { day: "$day", month: "$month", year: "$year" },
                            count: { $sum: "$count" }
                        }
                    }
                ], (err, reportItem) => {
                    if (err) {
                        return reject(err);
                    }
                    if (!reportItem) {
                        return resolve(0);
                    }
                    if (!reportItem.length) {
                        return resolve(0);
                    }
                    return resolve(reportItem[0].count || 0);
                })
            } else {
                resolve(0);
            }
        }

    });
}


module.exports = {
    default: db.model('default_report', defaultReport),
    clientUserDayli: db.model('user_client_dayli', ClientUserDayli),
    followUserWeek: db.model('follow_client_week', FollowingWeekReport)

}
