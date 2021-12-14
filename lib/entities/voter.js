const InvalidArgumentError = require("../errors/invalid-argument");

class Voter {
  constructor(id, roomId, connection, admin = false) {
    if (!id || !connection || !roomId) throw new InvalidArgumentError();
    this.id = id;
    this.connection = connection;
    this.vote = null;
    this.admin = admin;
    this.roomId = roomId;
  }

  castVote(vote) {
    this.vote = vote;
  }

  uncastVote() {
    this.vote = null;
  }

  isAdminOf(roomId) {
    return this.admin && this.roomId == roomId;
  }

  resetVote() {
    this.vote = null;
  }
}

module.exports = Voter;