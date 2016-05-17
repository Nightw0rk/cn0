var express = require("express");
var user = require("../models/user")
var session = require("../middleware/session");
var route = express.Router();

/**
 * Войти
 */
route.post("/login", function (req, res) {
    user.createNewSession(req.body.name, req.body.password)
        .then((session) => {
            res.send({ status: "OK", msg: "Авторизация успешна", session: session });
        })
        .catch((err, v, d) => {
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
