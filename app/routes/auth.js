var express = require("express");
var user = require("../models/user")
var session = require("../middleware/session");
var route = express.Router();

/**
 * Войти
 */
route.post("/login", function (req, res) {
    user.createNewSession(req.body.name, req.body.password)
        .then(function (user) {
            res.send({
                status: "OK", msg: "Авторизация успешна",
                result: {
                    session: user.session,
                    type: user.NameType,
                    salons: user.Sotrud.ConntactionFaceZakaz
                }
            });
        })
        .catch(function (err, v, d) {
            res.send(err);
        });
})

/**
 * Выйти
 */
route.post("/logout", session(), function (req, res) {
    req.user.session = null
    req.user.save(() => {
        res.send({ status: "OK", msg: "Сессия закончена" });
    })
})
module.exports = route;
