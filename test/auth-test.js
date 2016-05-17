var sinon = require("sinon");
var test = require("supertest");
var should = require("should");
var app = require("../index");

describe("testing auth module ", function () {
    it("login with name and password", (done) => {
        test(app)
            .post("/auth/login")
            .send({ name: "test", password: "test" })
            .end(function (err, res, body) {
                should.not.exist(err);
                res.body.status.should.equal("ERROR",res.body.msg);
                done();
            })
    })

    it("logout", (done) => {
        test(app)
            .post("/auth/logout")
            .send({ session: "ajklsdfm" })
            .end(function (err, res, body) {
                should.not.exist(err);
                res.body.status.should.equal("ERROR",res.body.msg);
                done();
            })
    })
})
