const expect = require("chai").expect;

const { Voter } = require("../lib/entities");
const { InvalidArgumentError } = require("../lib/errors");

describe("Voter", function() {
  it("cannot be creatd without valid id and connection", function() {
    expect(
      () => new Voter()
    ).to.throw(InvalidArgumentError);
  });
});