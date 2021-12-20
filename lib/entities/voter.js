const InvalidArgumentError = require("../errors/invalid-argument");

class Voter {
  constructor(id, roomId) {
    if (!id || !roomId) throw new InvalidArgumentError();
    this.id = id;
    this.roomId = roomId;
    
    this.vote = null;
    this.admin = false;
  }

  castVote(vote) {
    this.vote = vote;
  }

  uncastVote() {
    this.vote = null;
  }

  isAdminOf(room) {
    return this.admin && this.roomId == room.id;
  }

  resetVote() {
    this.vote = null;
  }
}

module.exports = Voter;