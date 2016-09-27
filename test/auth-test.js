var sinon = require("sinon");
var sm = require('sinon-mongoose');
var test = require("supertest");
var should = require("should");
var app = require("../index");
var user = require("../app/models/user");

describe("testing auth module ", function () {
  it("login with name and password", (done) => {
    var findOne = sinon.stub(user, 'findOne', function (qu, cb) {
      cb(null, new user({
        name: 'test',
        passowrd: "test",
        NameType: 'TestUserType',
        Sotrud: {
          ConntactionFaceZakaz: 'O'
        }
      }));
    });
    var save = sinon.stub(user.prototype, "save", (cb) => {
      cb()
    });
    test(app)
      .post("/auth/login")
      .send({ name: "test", password: "test" })
      .end(function (err, res, body) {
        findOne.restore();
        save.restore();
        should.not.exist(err);
        should.exist(res.body.status);
        res.body.status.should.equal("OK", res.body.msg);
        done();
      })
  })

  it("logout", (done) => {
    var findOne = sinon.stub(user, 'findOne', function (qu, cb) {
      cb(null, new user({ name: test, passowrd: "test" }));
    });
    var save = sinon.stub(user.prototype, "save", (cb) => { cb() });
    test(app)
      .post("/auth/logout")
      .send({ session: "ajklsdfm" })
      .end(function (err, res, body) {
        should.not.exist(err);
        res.body.status.should.equal("OK", res.body.msg);
        findOne.restore();
        save.restore();
        done();
      })
  })
})
