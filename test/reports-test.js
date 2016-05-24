var sinon = require("sinon");
var sm = require('sinon-mongoose');
var test = require("supertest");
var should = require("should");
var app = require("../index");
var mongooseMock = require('mongoose-mock');
var proxyquire = require('proxyquire');
var Report = proxyquire("../app/models/reports", { 'mongoose': mongooseMock });

describe("Reports...", function() {
    it("create and save", (done) => {
        var callback = sinon.spy();
        var report = new Report.default({ fio: "asdasd" });
        report.save(callback);
        console.assert(!!report);
        done();
    });
})
