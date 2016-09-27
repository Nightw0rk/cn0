var express = require("express");
var user = require("../models/user")
var task = require("../models/tasks")
var session = require("../middleware/session");
var route = express.Router();

route.get("/notification", session(), function (req, res) {
    user.notifications.find({ 'user._id': req.user._id, closed: false }, (err, notification) => {
        return res.send({ status: "OK", notifications: notification });
    })
})

route.delete("/notification/:id", session(), function (req, res) {
    user.notifications.findOne({ 'user.id': req.user.id, id: req.params.id }, (err, notification) => {
        if (err || !notification)
            return res.send({ status: "OK" });
        notification.closed = true;
        notification.save(() => {
            return res.send({ status: "OK", message: "Closed" });
        })
    })
})

route.get("/events/:start/:end", session(), (req, res) => {
    task.find({ 'responsible._id': req.user._id, closed: false }, (err, events) => {
        var ev = [];
        events.forEach(function (element) {
            delete element._doc.user;
            ev.push(element);
        }, this);
        return res.send({ status: "OK", events: ev });
    })
});

route.delete("/event/:id", session(), (req, res) => {
    task.findOne({ 'responsible._id': req.user._id, _id: req.params.id }, (err, event) => {
        if (err || !event)
            return res.send({ status: "OK" });
        event.result = req.body.result;
        event.closed = true;
        event.save(() => {
            return res.send({ status: "OK", message: "Closed" });
        })
    })
});

route.patch("/event/:id", session(), (req, res) => {
    task.findOne({ 'responsibleuser._id': req.user._id, _id: req.params.id }, (err, event) => {
        if (err || !event)
            return res.send({ status: "OK" });
        event.start = new Date(req.body.start);
        event.end = new Date(req.body.end);
        event.save(() => {
            return res.send({ status: "OK", message: "Saved" });
        })
    })
})

route.post("/event", session(), (req, res) => {
    if (!req.body.start)
        return res.send({ status: "ERROR", message: "Нет времени старта" });
    if (!req.body.title)
        return res.send({ status: "ERROR", message: "Нет название события" });
    var event = new task({
        responsible: req.user,
        start: new Date(req.body.start),
        closed: false,
        end: req.body.end ? new Date(req.body.end) : new Date(new Date(req.body.start).getTime() + 60 * 30 * 1000),
        title: req.body.title
    });
    event.save(err => {
        var notification = new user.notifications({
            message: event.title,
            closed: false,
            action: "call",
            user: req.user
        })
        notification.save();
        return res.send({ status: "OK", id: event._id });
    })

})

module.exports = route;