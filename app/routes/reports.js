var express = require("express");
var session = require("../middleware/session");
var reports = require('../models/reports');
var async = require("async");
var route = express.Router();

route.post("/add", session(), (req, res) => {
    var data = req.body;
    data.author = req.user
    var seqArray = [
        (callback) => { return reports.clientUserDayli.incClient(req.user, callback) }
    ]
    delete data.author.session;
    var item = new reports.default(data);
    item.save((err) => {
        if (err) {
            return res.send({ status: "ERROR", msg: err });
        }
        var sequnce = async.series(seqArray, () => {
            return res.send({ status: "OK", msg: "Отчет сохранен" });
        })
    });
});

route.get("/", session(), (req, res) => {
    reports.default.find({}, (err, reports_) => {
        res.send({ status: "OK", msg: "", data: reports_ });
    })
});

route.get("/{id}", session(), (req, res) => {
    reports.default.findOne({ _id: req.params._id }, (err, reports_) => {
        res.send({ status: "OK", msg: "", data: reports_ });
    })
});

route.put("/{id}", session(), (req, res) => {
    var data = req.body;
    reports.default.find({ _id: req.params.id }, (err, report) => {
        if (err || !report) {
            return res.send({ status: "ERROR", msg: err });
        }
        //TODO need foreach;
        report = data;
        report.save((err) => {
            if (err) {
                return res.send({ status: "ERROR", msg: err });
            }
            return res.send({ status: "OK", msg: "Отчет сохранен" });
        });
    });
});


route.delete("/{id}", session, (req, res) => {
    reports.default.findOne({ _id: req.params.id }, (err, report) => {
        if (err) {
            return res.send({ status: "ERROR", msg: err });
        }
        if (report.author._id == req.user._id) {
            report.delete((err) => {
                if (err) {
                    return res.send({ status: "ERROR", msg: err });
                }
                return res.send({ status: "OK" });
            })
        } else {
            req.user.isInferior(report.author)
                .then(() => {
                    report.delete((err) => {
                        if (err) {
                            return res.send({ status: "ERROR", msg: err });
                        }
                        return res.send({ status: "OK" });
                    })
                })
                .catch((err) => {
                    return res.send({ status: "ERROR", msg: err });
                })
        }
    })
})

route.get("/default/today/clients", session(), (req, res) => {
    reports.clientUserDayli.getToday(req.user)
        .then((data) => {
            return res.send({ status: "OK", data: data });
        })
        .catch((err) => {
            return res.send({ status: "ERROR", msg: err });
        })
})

module.exports = route;
