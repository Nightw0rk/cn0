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

function updateDayliReport(local_model, current_date, salon, user, cb) {
    local_model.findOne(
        {
            day: current_date.getDate(), month: current_date.getMonth() + 1,
            year: current_date.getFullYear(),
            salon: salon,
            "user.Title": user.Title
        },
        (err, reportItem) => {
            if (err) {
                console.log("Ошибка сохранения дневного отчета", err);
            }
            if (!reportItem) {
                reportItem = new local_model({
                    day: current_date.getDate(),
                    month: current_date.getMonth() + 1,
                    salon: salon,
                    year: current_date.getFullYear(),
                    user: user
                });
            }
            reportItem.count = (reportItem.count || 0) + 1;
            reportItem.save(cb);
        }
    )
}

function UpdateCostDayliReport(local_model, current_date, salon, pay, user, cb) {
    local_model.findOne(
        {
            day: current_date.getDate(),
            month: current_date.getMonth() + 1,
            year: current_date.getFullYear(),
            salon: salon,
            "user.Title": user.Title
        },
        (err, reportItem) => {
            if (err) {
                console.log("Ошибка сохранения дневного отчета", err);
            }
            if (!reportItem) {
                reportItem = new local_model({
                    day: current_date.getDate(),
                    month: current_date.getMonth() + 1,
                    year: current_date.getFullYear(),
                    salon: salon,
                    user: user
                });
            }
            reportItem.cost = (reportItem.cost || 0) + Number(pay || 0);
            reportItem.save(cb);
        }
    )
}

var defaultReport = db.Schema({
    stamp: { type: Date, defualt: Date.now() },
    author: user.schema,
    name: String,
    family: String,
    second_name: String,
    phone: String,
    birthdate: Date,
    city: String,
    salon: String,
    address: String,
    consult: Boolean,
    follow: String, //  Откуда пришел
    zakaz: Boolean,
    orderzakaz: String, // order number zakaz
    draw: Boolean,
    orderdraw: String, // order number zakaz
    demension: String, // order number demension
    modelZakaz: String,
    pay: Boolean,
    second_pay: Boolean,
    cost_pay: Number,
    cost_second_pay: Number,
    social: String,
    example: Boolean, // Только прорисовка
    exampleNumber: String,
    first: Boolean, // Повторное обращение
    houseifo: String,
    mark: String,
    offers: String
});
var salonModel = db.Schema({
    name: String
})
var ClientUserDayli = db.Schema({
    stamp: { type: Date, default: Date.now() },
    salon: String,
    day: Number,
    month: Number,
    year: Number,
    user: user.schema,
    count: Number
});

var DrawUserDayli = db.Schema({
    stamp: { type: Date, default: Date.now() },
    salon: String,
    day: Number,
    month: Number,
    year: Number,
    user: user.schema,
    count: Number
});

var ZakazUserDayli = db.Schema({
    stamp: { type: Date, default: Date.now() },
    salon: String,
    day: Number,
    month: Number,
    year: Number,
    user: user.schema,
    count: Number
});

var ConsultUserDayli = db.Schema({
    stamp: { type: Date, default: Date.now() },
    salon: String,
    day: Number,
    month: Number,
    year: Number,
    user: user.schema,
    count: Number
});

var PayUserDayli = db.Schema({
    stamp: { type: Date, default: Date.now() },
    salon: String,
    day: Number,
    month: Number,
    year: Number,
    user: user.schema,
    cost: Number
});

var SecondPayUserDayli = db.Schema({
    stamp: { type: Date, default: Date.now() },
    salon: String,
    day: Number,
    month: Number,
    year: Number,
    user: user.schema,
    cost: Number
});

var FollowingWeekReport = db.Schema({
    stamp: { type: Date, default: Date.now() },
    salon: String,
    week: Number,
    year: Number,
    user: user.schema,
    type: String,
    count: Number
});

FollowingWeekReport.statics.getWeekStats = user => {
    return new q((resolve, reject) => {
        var local_model = db.model('follow_client_week', FollowingWeekReport);
        var current_date = new Date();
        var start_date = new Date(current_date.setDate(current_date.getDate() - 7));
        current_date = new Date(current_date.setDate(current_date.getDate() + 7));
        var params = {};
        params.range = { start: start_date, end: current_date };
        params.user = user
        return resolve(local_model.getByRange(params));
    });
}

FollowingWeekReport.statics.incClient = (user, type, salon, cb) => {
    console.log("update client dayli report");
    var local_model = db.model('follow_client_week', FollowingWeekReport);
    var d = getWeekNumber(new Date());
    local_model.findOne(
        {
            week: d.week,
            year: d.year,
            salon: salon,
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
                        salon: salon,
                        user: user
                    });
            }
            reportItem.count = (reportItem.count || 0) + 1;
            reportItem.save(cb);
        }
    )
};

DrawUserDayli.statics.incClient = (user, flag, salon, cb) => {
    var current_date = new Date();
    if (!flag) return cb();
    console.log("update client dayli report");
    var local_model = db.model('draw_client_dayli', DrawUserDayli);
    /*local_model.findOne(
        { day: current_date.getDate(), month: current_date.getMonth() + 1, year: current_date.getFullYear(), "user.Title": user.Title },
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
    )*/
    updateDayliReport(local_model, current_date, salon, user, cb);
};

ZakazUserDayli.statics.incClient = (user, flag, salon, cb) => {
    var current_date = new Date();
    if (!flag) return cb();
    console.log("update client dayli report");
    var local_model = db.model('zakaz_client_dayli', ZakazUserDayli);
    updateDayliReport(local_model, current_date, salon, user, cb);
};

ConsultUserDayli.statics.incClient = (user, flag, salon, cb) => {
    var current_date = new Date();
    if (!flag) return cb();
    console.log("update client dayli report");
    var local_model = db.model('consult_client_dayli', ConsultUserDayli);
    updateDayliReport(local_model, current_date, salon, user, cb);
};

PayUserDayli.statics.incClient = (user, pay, salon, cb) => {
    var current_date = new Date();
    console.log("update client dayli report");
    var local_model = db.model('pay_client_dayli', PayUserDayli);
    UpdateCostDayliReport(local_model, current_date, salon, pay, user, cb);
};

SecondPayUserDayli.statics.incClient = (user, pay, salon, cb) => {
    var current_date = new Date();
    console.log("update client dayli report");
    var local_model = db.model('second_pay_client_dayli', SecondPayUserDayli);
    UpdateCostDayliReport(local_model, current_date, salon, pay, user, cb);
};

ClientUserDayli.statics.incClient = (user, salon, cb) => {
    var current_date = new Date();
    console.log("update client dayli report");
    var local_model = db.model('user_client_dayli', ClientUserDayli);
    updateDayliReport(local_model, current_date, salon, user, cb);
};

FollowingWeekReport.statics.getByRange = params => {
    return new q((resolve, reject) => {
        if (!params.range.start || !params.range.end) {
            return reject(new Error('Не верно задан преиод'));
        }
        if (!params.user) {
            return reject(new Error('Не верно задан пользователь'));
        }
        params.model = db.model('follow_client_week', FollowingWeekReport);
        if (params.user.NameType == 'Рук. Салона') {
            return resolve(reportUtils.getByRangeToHeadSalon(params));
        }
        if (params.user.NameType == 'Рук. Филиала') {
            return resolve(reportUtils.getByRangeToHeadBranch(params));
        }
        if (params.user.NameType == 'ОтделПродаж' || params.user.NameType == 'СуперАдминистратор' ||
            params.user.NameType == 'ПЭО') {
            return resolve(reportUtils.getByRangeToMaster(params));
        }
        if (params.user.NameType == 'Консультант') {
            reject('Ошибка доступа')
        }
    });
}

ClientUserDayli.statics.getByRange = params => {
    return new q((resolve, reject) => {
        if (!params.range.start || !params.range.end) {
            return reject(new Error('Не верно задан преиод'));
        }
        if (!params.user) {
            return reject(new Error('Не верно задан пользователь'));
        }
        params.model = db.model('user_client_dayli', ClientUserDayli);
        if (params.user.NameType == 'Консультант') {
            return resolve(reportUtils.getByRangeToConsultant(params));
        }
        if (params.user.NameType == 'Рук. Салона') {
            return resolve(reportUtils.getByRangeToHeadSalon(params));
        }
        if (params.user.NameType == 'Рук. Филиала') {
            return resolve(reportUtils.getByRangeToHeadBranch(params));
        }
        if (params.user.NameType == 'ОтделПродаж' || params.user.NameType == 'СуперАдминистратор' ||
            params.user.NameType == 'ПЭО') {
            return resolve(reportUtils.getByRangeToMaster(params));
        }
        return resolve({ cost: 0, result: 0 });
    });
}

DrawUserDayli.statics.getByRange = function (params) {
    return new q(function (resolve, reject) {
        if (!params.range.start || !params.range.end) {
            return reject(new Error('Не верно задан преиод'));
        }
        if (!params.user) {
            return reject(new Error('Не верно задан пользователь'));
        }
        params.model = db.model('draw_client_dayli', DrawUserDayli);
        if (params.user.NameType == 'Консультант') {
            return resolve(reportUtils.getByRangeToConsultant(params));
        }
        if (params.user.NameType == 'Рук. Салона') {
            return resolve(reportUtils.getByRangeToHeadSalon(params));
        }
        if (params.user.NameType == 'Рук. Филиала') {
            return resolve(reportUtils.getByRangeToHeadBranch(params));
        }
        if (params.user.NameType == 'ОтделПродаж' || params.user.NameType == 'СуперАдминистратор' ||
            params.user.NameType == 'ПЭО') {
            return resolve(reportUtils.getByRangeToMaster(params));
        }
        return resolve({ cost: 0, result: 0 });

    });
}

ZakazUserDayli.statics.getByRange = function (params) {
    return new q(function (resolve, reject) {
        if (!params.range.start || !params.range.end) {
            return reject(new Error('Не верно задан преиод'));
        }
        if (!params.user) {
            return reject(new Error('Не верно задан пользователь'));
        }
        params.model = db.model('zakaz_client_dayli', ZakazUserDayli);
        if (params.user.NameType == 'Консультант') {
            return resolve(reportUtils.getByRangeToConsultant(params));
        }
        if (params.user.NameType == 'Рук. Салона') {
            return resolve(reportUtils.getByRangeToHeadSalon(params));
        }
        if (params.user.NameType == 'Рук. Филиала') {
            return resolve(reportUtils.getByRangeToHeadBranch(params));
        }
        if (params.user.NameType == 'ОтделПродаж' || params.user.NameType == 'СуперАдминистратор' ||
            params.user.NameType == 'ПЭО') {
            return resolve(reportUtils.getByRangeToMaster(params));
        }
        return resolve({ cost: 0, result: 0 });

    });
};
PayUserDayli.statics.getByRange = function (params) {
    return new q(function (resolve, reject) {
        if (!params.range.start || !params.range.end) {
            return reject(new Error('Не верно задан преиод'));
        }
        if (!params.user) {
            return reject(new Error('Не верно задан пользователь'));
        }
        params.model = db.model('pay_client_dayli', PayUserDayli);
        if (params.user.NameType == 'Консультант') {
            return resolve(reportUtils.getByRangeCostToConsultant(params));
        }
        if (params.user.NameType == 'Рук. Салона') {
            return resolve(reportUtils.getByRangeCostToHeadSalon(params));
        }
        if (params.user.NameType == 'Рук. Филиала') {
            return resolve(reportUtils.getByRangeCostToHeadBranch(params));
        }
        if (params.user.NameType == 'ОтделПродаж' || params.user.NameType == 'СуперАдминистратор' ||
            params.user.NameType == 'ПЭО') {
            return resolve(reportUtils.getByRangeCostToMaster(params));
        }
        return resolve({ cost: 0, result: 0 });
    });
};

SecondPayUserDayli.statics.getByRange = function (params) {
    return new q(function (resolve, reject) {
        if (!params.range.start || !params.range.end) {
            return reject(new Error('Не верно задан преиод'));
        }
        if (!params.user) {
            return reject(new Error('Не верно задан пользователь'));
        }
        params.model = db.model('second_pay_client_dayli', SecondPayUserDayli);
        if (params.user.NameType == 'Консультант') {
            return resolve(reportUtils.getByRangeCostToConsultant(params));
        }
        if (params.user.NameType == 'Рук. Салона') {
            return resolve(reportUtils.getByRangeCostToHeadSalon(params));
        }
        if (params.user.NameType == 'Рук. Филиала') {
            return resolve(reportUtils.getByRangeCostToHeadBranch(params));
        }
        if (params.user.NameType == 'ОтделПродаж' ||
            params.user.NameType == 'СуперАдминистратор' ||
            params.user.NameType == 'ПЭО') {
            return resolve(reportUtils.getByRangeCostToMaster(params));
        }
        return resolve({ cost: 0, result: 0 });

    });
};

ClientUserDayli.statics.getToday = function (user) {
    return new q(function (resolve, reject) {
        console.log("update client dayli report");
        var local_model = db.model('user_client_dayli', ClientUserDayli);
        var current_date = new Date();
        var start_date = new Date(current_date.setDate(current_date.getDate() - 1));
        current_date = new Date(current_date.setDate(current_date.getDate() + 1));
        var params = {};
        params.model = local_model;
        params.user = user;
        params.range = { start: start_date, end: current_date }
        return resolve(local_model.getByRange(params));
    });
}


module.exports = {
    default: db.model('default_report', defaultReport),
    clientUserDayli: db.model('user_client_dayli', ClientUserDayli),
    followUserWeek: db.model('follow_client_week', FollowingWeekReport),
    ZakazUserDayli: db.model('zakaz_client_dayli', ZakazUserDayli),
    DrawUserDayli: db.model('draw_client_dayli', DrawUserDayli),
    ConsultUserDayli: db.model('consult_client_dayli', ConsultUserDayli),
    PayUserDayli: db.model('pay_client_dayli', PayUserDayli),
    SecondPayUserDayli: db.model('second_pay_client_dayli', SecondPayUserDayli),
    Salon: db.model('salon', salonModel)
}
