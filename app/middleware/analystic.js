var request = require('request');
var data = {
    v: 1,
    tid: 'UA-41460017-5',
}

function sendData(query) {
    return new Promise((resolve, reject) => {
        request.post('https://ssl.google-analytics.com/collect', { form: query }, (err, response, body) => {
            if (err || response.statusCode != 200) {
                return reject(new Error('Не удачная поптыка занести данные в аналитику'));
            }
            return resolve(true);
        })
    })
}
module.exports = {
    newVisitor: (id, user) => {
        var localQuery = data;
        data.cid = id;
        data.t = 'event';
        data.ec = 'Клиенты';
        data.ds = 'crm';
        data.ea = 'Новый';
        data.el = user.Sotrud.Family;
        data.ev = user.Sotrud.Id;
        data.geoid = user.city || '2643';
        data.sc = 'start';
        data.dl = "http://crm.lorena-kuhni.ru/" + user.Sotrud.Deportament.Title;
        data.dt = 'Новый';
        return sendData(localQuery);
    },
    newAction: (id, action, user) => {
        var localQuery = data;
        data.cid = id;
        data.t = 'event';
        data.ec = 'Клиенты';
        data.ds = 'crm';
        data.ea = action.name;
        data.el = user.Sotrud.Family;
        data.ev = user.Sotrud.Id;
        data.geoid = user.city || '2643';
        data.dl = "http://crm.lorena-kuhni.ru/" + user.Sotrud.Deportament.Title;
        data.dt = action.name; 
        if (action.name == 'Оформление заказа')
            data.sc = 'end';
        if (action == 'Консультация')
            data.cn = action.payload
        return sendData(localQuery);
    }
}