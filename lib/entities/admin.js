const Room = require("./room");
const Voter = require("./voter");

class Admin extends Voter {
  constructor(id, roomId, connection) {
    super(id, roomId, connection);
    this.admin = true;
  }
}

module.exports = Admin;