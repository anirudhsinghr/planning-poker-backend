const Room = require("./room");
const Voter = require("./voter");

class Admin extends Voter {
  constructor(id, roomId, connection) {
    super(id, roomId, connection);
    this.admin = true;
  }

  createRoom(roomId) {
    const room = new Room(roomId);
    room.addVoter(this);
    return room;
  }
}

module.exports = Admin;