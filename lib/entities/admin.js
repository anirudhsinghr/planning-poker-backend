const Room = require("./room");
const Voter = require("./voter");

class Admin extends Voter {
  constructor(id, roomId) {
    super(id, roomId);
    this.admin = true;
  }
}

module.exports = Admin;