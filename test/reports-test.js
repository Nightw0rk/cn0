var sinon = require("sinon");
var test = require("supertest");
var should = require("should");
var app = require("../index");
var clients = require('../app/models/client');
var user = require("../app/models/user");
var config = require("../config");

describe("Clients...", function () {
    it("create and save empty", (done) => {
        // clients.client.prototype.save = (callback) => {
        //     console.log(1);
        //     callback();
        // };
        sinon.stub(user, 'getUserBySession', (session) => {
            return Promise.resolve({});
        });
        test(app)
            .post('/clients')
            .expect(200, {
                status: "ERROR",
                msg: "Номер телефона должен быть указан обязательно"
            }, done);
    });

    it("create and save with phone", (done) => {
        var client = {
            client: {
                phone: '+79080512268'
            }
        };
        var save = sinon.stub(clients.client.prototype, "save", (cb) => {
            client._id = "asfdasda2";
            return cb(null, client);
        })
        var saveIndex = sinon.stub(config.es.client, "create", (cb) => {
            return Promise.resolve(1);
        })
        sinon.stub(user, 'getUserBySession', (session) => {
            return Promise.resolve({
                name: 'test',
                passowrd: "test",
                NameType: 'TestUserType',
                Sotrud: {
                    Id: 1,
                    Family: 'Test',
                    ConntactionFaceZakaz: 'O',
                    Deportament: {
                        Title: "39-Миасс"
                    }
                }
            });
        });
        test(app)
            .post('/clients')
            .send(client)
            .expect(200, {
                status: "OK"
            }, done);
    });

    it('Пустое действие над пользователем', (done) => {
        sinon.stub(user, 'getUserBySession', (session) => {
            return Promise.resolve({});
        });
        test(app)
            .post('/clients/asdjkl/timeline')
            .expect(200, {
                msg: 'Пустой запрос',
                status: "ERROR"
            }, done);
    })    

    it('Консультация клиента', (done) => {
        var client = {
            phone: '+79080512268',
            timeline: [],
            save: (cb) => {
                return cb();
            }
        };
        sinon.stub(user, 'getUserBySession', (session) => {
            return Promise.resolve({
                name: 'test',
                passowrd: "test",
                NameType: 'TestUserType',
                Sotrud: {
                    Id: 1,
                    Family: 'Test',
                    ConntactionFaceZakaz: 'O',
                    Deportament: {
                        Title: "39-Миасс"
                    }
                }
            });
        });
        var save = sinon.stub(clients.client, "findOne", (params, cb) => {
            client._id = "asdjkl";
            return cb(null, client);
        })
        test(app)
            .post('/clients/asdjkl/timeline')
            .send({
                action: "Консультация",
                payload: {
                    source: 'Рекламный шит'
                }
            })
            .expect(200, {
                status: "OK"
            }, done);
    })

    it('Заказ клиента', (done) => {
        var client = {
            phone: '+79080512268',
            timeline: [],
            save: (cb) => {
                return cb();
            }
        };
        sinon.stub(user, 'getUserBySession', (session) => {
            return Promise.resolve({
                name: 'test',
                passowrd: "test",
                NameType: 'TestUserType',
                Sotrud: {
                    Id: 1,
                    Family: 'Test',
                    ConntactionFaceZakaz: 'O',
                    Deportament: {
                        Title: "39-Миасс"
                    }
                }
            });
        });
        var save = sinon.stub(clients.client, "findOne", (params, cb) => {
            client._id = "asdjkl";
            return cb(null, client);
        })
        test(app)
            .post('/clients/asdjkl/timeline')
            .send({
                action: "Оформление заказа"
            })
            .expect(200, {
                status: "OK"
            }, done);
    })

    afterEach(() => {
        if (user.getUserBySession.restore) {
            user.getUserBySession.restore();
        }
        if (clients.client.prototype.save.restore) {
            clients.client.prototype.save.restore();
        }
        if (config.es.client.create.restore) {
            config.es.client.create.restore()
        }
        if (clients.client.findOne.restore)
            clients.client.findOne.restore();
    })
})
