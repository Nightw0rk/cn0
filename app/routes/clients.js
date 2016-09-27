var express = require("express");
const assert = require('assert');
var user = require("../models/user")
var db = require("../models/client")
var session = require("../middleware/session");
var analystic = require("../middleware/analystic");
var config = require("../../config");
var route = express.Router();

route.get("/suggestion", session(), (req, res) => {
    config.es.client.search({ q: req.query.q })
        .then(body => {
            return res.send({ status: "OK", data: body });
        }, error => {
            return res.send({ status: "ERROR", msg: error });
        });
})
/**
 * Добавляем клиента в базу
 */
route.post("/", session(), (req, res) => {
    if (!req.body || !req.body.client || !req.body.client.phone) {
        return res.send({ status: "ERROR", msg: "Номер телефона должен быть указан обязательно" });
    }
    var body = {
        name: req.body.client.name || '',
        family: req.body.client.family || '',
        second_name: req.body.client.second_name || '',
        phone: req.body.client.phone || '', // Телефон
        birthdate: req.body.client.birthdate || new Date(1970, 5, 5), // Дата рождения
        sex: req.body.client.sex || 'Мужской', // Пол 
        city: req.body.client.city || '', // Город
        address: req.body.client.address || '', //Адрес
    }
    var client =
        new db.client(body).save((errSave, item) => {
            return config.es.client.create({
                index: 'crm',
                type: 'client',
                id: item._id.toString(),
                body: body
            })
                .then(_ => {
                    return analystic.newVisitor(item._id, req.user)
                })
                .then(_ => {
                    return res.send({ status: "OK" })
                })
                .catch(err => {
                    if (body._id) {
                        db.client.remove({ _id: body._id });
                        config.es.client.delete({
                            index: 'crm',
                            type: 'client',
                            id: body._id.toString(),
                        })
                    }
                    var mmsg = err;
                    if (err.code == 11000 && /phone_1/.test(err.errmsg)) {
                        mmsg = "Такой номер телефона уже зарегистрирован";
                    }
                    if (err.code == 11000 && /city_1_address_1/.test(err.errmsg)) {
                        mmsg = "Такой адрес уже зарегистрирован";
                    }
                    return res.send({ status: "ERROR", msg: mmsg });
                });
        })
});
/**
 * Добавить запись в Timeline
 * 
 */
route.post('/:client/timeline', session(), (req, res) => {       
    if (!req.body || !req.body.action)
        return res.send({ status: "ERROR", msg: 'Пустой запрос' });
    db.client.findOne({ _id: req.params.client }, (err, client) => {
        if (err)
            return res.send({ status: "ERROR", msg: err.message, err: err });
        client.timeline.push({
            stamp: new Date(),
            agent: req.user,
            salon: req.user.Deportament,
            action: req.body.action,
            payload: req.body.payload
        });
        var action = {
            name: req.body.action,
        }
        switch (action.name) {
            case 'Консультация':
                action.payload = req.body.payload.source
                break;
        }
        client.save((err, item) => {
            analystic.newAction(
                client._id,
                action,
                req.user
            ).then(_ => {
                res.send({
                    status: "OK"
                })
            })
        })

    })
})

module.exports = route;