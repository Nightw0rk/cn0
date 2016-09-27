var express = require("express");
var session = require("../middleware/session");
var reports = require('../models/reports');
var users = require('../models/user');
var async = require("async");
var route = express.Router();

// route.post("/add", session(), (req, res) => {
//     var data = req.body;
//     data.author = req.user
//     var seqArray = [
//         (callback) => { return reports.clientUserDayli.incClient(req.user, data.salon, callback) },
//         (callback) => { return reports.followUserWeek.incClient(req.user, data.follow, data.salon, callback) },
//         (callback) => { return reports.DrawUserDayli.incClient(req.user, data.draw, data.salon, callback) },
//         (callback) => { return reports.ZakazUserDayli.incClient(req.user, data.zakaz, data.salon, callback) },
//         (callback) => { return reports.ConsultUserDayli.incClient(req.user, data.consult, data.salon, callback) },
//         (callback) => { return reports.PayUserDayli.incClient(req.user, data.cost_pay, data.salon, callback) },
//         (callback) => { return reports.SecondPayUserDayli.incClient(req.user, data.cost_second_pay, data.salon, callback) },
//     ];
//     delete data.author.session;
//     var item = new reports.default(data);
//     item.stamp = new Date();
//     item.save((err) => {
//         if (err) {
//             return res.send({ status: "ERROR", msg: err });
//         }
//         var sequnce = async.series(seqArray, () => {
//             return res.send({ status: "OK", msg: "Отчет сохранен" });
//         })
//     });
// });

// route.get("/", session(), (req, res) => {
//     reports.default.find({}, (err, reports_) => {
//         res.send({ status: "OK", msg: "", data: reports_ });
//     })
// });

// route.get("/{id}", session(), (req, res) => {
//     reports.default.findOne({ _id: req.params._id }, (err, reports_) => {
//         res.send({ status: "OK", msg: "", data: reports_ });
//     })
// });

// route.put("/{id}", session(), (req, res) => {
//     var data = req.body;
//     reports.default.find({ _id: req.params.id }, (err, report) => {
//         if (err || !report) {
//             return res.send({ status: "ERROR", msg: err });
//         }
//         //TODO need foreach;
//         report = data;
//         report.save((err) => {
//             if (err) {
//                 return res.send({ status: "ERROR", msg: err });
//             }
//             return res.send({ status: "OK", msg: "Отчет сохранен" });
//         });
//     });
// });


// route.delete("/{id}", session, (req, res) => {
//     reports.default.findOne({ _id: req.params.id }, (err, report) => {
//         if (err) {
//             return res.send({ status: "ERROR", msg: err });
//         }
//         if (report.author._id == req.user._id) {
//             report.delete((err) => {
//                 if (err) {
//                     return res.send({ status: "ERROR", msg: err });
//                 }
//                 return res.send({ status: "OK" });
//             })
//         } else {
//             req.user.isInferior(report.author)
//                 .then(() => {
//                     report.delete((err) => {
//                         if (err) {
//                             return res.send({ status: "ERROR", msg: err });
//                         }
//                         return res.send({ status: "OK" });
//                     })
//                 })
//                 .catch((err) => {
//                     return res.send({ status: "ERROR", msg: err });
//                 })
//         }
//     })
// })

// route.get("/default/today/clients", session(), (req, res) => {
//     reports.clientUserDayli.getToday(req.user)
//         .then((data) => {
//             return res.send({ status: "OK", data: data.count, items: data.result });
//         })
//         .catch((err) => {
//             return res.send({ status: "ERROR", msg: err });
//         })
// })

// route.get("/default/today/follows", session(), (req, res) => {
//     reports.followUserWeek.getWeekStats(req.user)
//         .then((data) => {
//             return res.send({ status: "OK", follow: data });
//         }).catch((err) => {
//             return res.send({ status: "ERROR", msg: err });
//         });
// })
// route.get("/default/range/follows/:start/:end", session(), (req, res) => {
//     reports.followUserWeek.getByRange({
//         range: {
//             start: new Date(Number(req.params.start)),
//             end: new Date(Number(req.params.end)),
//         },
//         user: req.user
//     })
//         .then((data) => {
//             return res.send({ status: "OK", follow: data });
//         }).catch((err) => {
//             return res.send({ status: "ERROR", msg: err });
//         });
// })
// route.get('/default/range/clients/:start/:end', session(), (req, res) => {
//     reports.clientUserDayli.getByRange({
//         range: {
//             start: new Date(Number(req.params.start)),
//             end: new Date(Number(req.params.end)),
//         },
//         user: req.user
//     }).then((data) => {
//         return res.send({ status: "OK", data: data, });
//     }).catch((err) => {
//         return res.send({ status: "ERROR", msg: err });
//     });
// });

// route.get('/default/range/draw/:start/:end', session(), (req, res) => {
//     reports.DrawUserDayli.getByRange({
//         range: {
//             start: new Date(Number(req.params.start)),
//             end: new Date(Number(req.params.end)),
//         },
//         user: req.user
//     }).then((data) => {
//         return res.send({ status: "OK", data: data.count });
//     }).catch((err) => {
//         return res.send({ status: "ERROR", msg: err });
//     });
// });

// route.get('/default/range/zakaz/:start/:end', session(), (req, res) => {
//     reports.ZakazUserDayli.getByRange({
//         range: {
//             start: new Date(Number(req.params.start)),
//             end: new Date(Number(req.params.end)),
//         },
//         user: req.user
//     }).then((data) => {
//         return res.send({ status: "OK", data: data.count });
//     }).catch((err) => {
//         return res.send({ status: "ERROR", msg: err });
//     });
// });
// route.get('/default/range/pay/:start/:end', session(), (req, res) => {
//     reports.PayUserDayli.getByRange({
//         range: {
//             start: new Date(Number(req.params.start)),
//             end: new Date(Number(req.params.end)),
//         },
//         user: req.user
//     }).then((data) => {
//         return res.send({ status: "OK", data: data.cost });
//     }).catch((err) => {
//         return res.send({ status: "ERROR", msg: err });
//     });
// });

// route.get('/default/range/secondpay/:start/:end', session(), (req, res) => {
//     reports.SecondPayUserDayli.getByRange({
//         range: {
//             start: new Date(Number(req.params.start)),
//             end: new Date(Number(req.params.end)),
//         },
//         user: req.user
//     }).then((data) => {
//         return res.send({
//             status: "OK", data: data.cost
//         });
//     }).catch((err) => {
//         return res.send({
//             status: "ERROR", msg: err
//         });
//     });
// });

// route.get('/default/range/follow/:start/:end', session(), (req, res) => {
//     reports.followUserWeek.getByRange({
//         range: {
//             start: new Date(req.params.start),
//             end: new Date(req.params.end),
//         },
//         user: req.user
//     }).then((data) => {
//         return res.send({ status: "OK", data: data });
//     }).catch((err) => {
//         return res.send({ status: "ERROR", msg: err });
//     });
// })

// route.get('/salons/all', (req, res) => {
//     reports.Salon.findAll({}, (err, result) => {
//         if (err)
//             return res.send({ status: "ERROR", msg: err });
//         return res.send({ status: "OK", msg: null, salons: result });
//     })
// })

// route.get('/salons/stats/:start/:end', session(), (req, res) => {
//     reports.Salon.find({}, (err, result) => {
//         if (err)
//             return res.send({ status: "ERROR", msg: err });
//         result.map((item) => {
//             item._doc.stats = Math.random();
//         })
//         return res.send({ status: "OK", msg: null, salons: result });
//     })
// })

// route.get('/salon/:name/staff/stats/:start/:end', session(), (req, res) => {
//     users.find({ 'Sotrud.Deportament.Title': req.params.name }, (err, result) => {
//         if (err)
//             return res.send({ status: "ERROR", msg: err });
//         var reMap = result.reduce((result, item) => {
//             //item._doc.stats = Math.random() * 100;
//             result.push({
//                 stats: Math.random(),
//                 Title: item.Title
//             });
//             return result;
//         }, [])
//         return res.send({ status: "OK", msg: null, staff: reMap });
//     })
// })

// route.get('/salon/:name/staff/:staff', session(), (req, res) => {
//     return res.send({
//         status: "OK", msg: null, staff: {
//             stats: Math.random(),
//             name: req.params.name,
//             salon: req.params.staff
//         }
//     });
// })

module.exports = route;
