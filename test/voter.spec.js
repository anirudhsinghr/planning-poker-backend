const { expect } = require("chai");
const Voter = require("../lib/entities/voter");
const InvalidArgumentError = require("../lib/errors/invalid-argument");

describe("Voter", function() {
  it("cannot be creatd without valid id and connection", function() {
    expect(
      () => new Voter()
    ).to.throw(InvalidArgumentError);
  });
});