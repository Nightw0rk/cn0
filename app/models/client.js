var db = require("../middleware/db");
var user = require("./user");
var uuid = require("node-uuid");
var user = require('./user');

var clientActionModel = db.Schema({
    stamp: { type: Date, default: Date.now() },
    agent: user.schema,
    salon: user.deportament,
    action: {
        type: String, enum:
        [
            'Консультация',
            'Прорисовка',
            'Замер',
            'Оформление заказа',
            'Оформление заказа коммерческого заказа',
            'Оформление кредита',
            'Предоплата',
            'Доплата'
        ]
    },
    payload: db.Schema.Types.Mixed
});

var socileModel = db.Schema({
    name: String,
    link: String
})

var clientModel = db.Schema({
    name: String, // Имя 
    family: String, // Фамилия
    second_name: String, // Отчество
    phone: { type: String, index: { unique: true } }, // Телефон
    birthdate: Date, // Дата рождения
    sex: { type: String, enum: ['Мужской', 'Женский'], default: 'Мужской' },// Пол 
    city: String, // Город
    address: String, //Адрес
    social: [socileModel],
    timeline: [clientActionModel]
});


module.exports = {
    client: db.model('client', clientModel),
    clientSchema: clientModel
    /*default: db.model('default_report', defaultReport),
    clientUserDayli: db.model('user_client_dayli', ClientUserDayli),
    followUserWeek: db.model('follow_client_week', FollowingWeekReport),
    ZakazUserDayli: db.model('zakaz_client_dayli', ZakazUserDayli),
    DrawUserDayli: db.model('draw_client_dayli', DrawUserDayli),
    ConsultUserDayli: db.model('consult_client_dayli', ConsultUserDayli),
    PayUserDayli: db.model('pay_client_dayli', PayUserDayli),
    SecondPayUserDayli: db.model('second_pay_client_dayli', SecondPayUserDayli),
    Salon: db.model('salon', salonModel),
    client:db.model('client',clientModel)*/
}
