const { expect } = require("chai")
const Room = require("../lib/entities/room")
const InvalidArgumentError = require("../lib/errors/invalid-argument")

describe("Room", function() {
  it("cannot be created with an invalid id", function() {
    expect(
      () => new Room()
    ).to.throw(InvalidArgumentError);

    expect(
      () => new Room(null)
    ).to.throw(InvalidArgumentError);

    expect(
      () => new Room(undefined)
    ).to.throw(InvalidArgumentError);

    expect(
      () => new Room("")
    ).to.throw(InvalidArgumentError);
  })
})