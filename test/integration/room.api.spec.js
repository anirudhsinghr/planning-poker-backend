const { expect } = require("chai");
const request = require("supertest");
const { app } = require("../../lib/api");

describe("Room Api", function () {
  it("A room can be created", function (done) {
    request(app)
      .post("/room")
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        expect(res.body).to.not.be.undefined;
        expect(res.body.roomId).to.not.be.undefined;
        expect(res.body.adminId).to.not.be.undefined;
        done();
      });
  })
})