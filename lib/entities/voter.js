const InvalidArgumentError = require("../errors/invalid-argument");

class Voter {
  constructor(id, connection) {
    if (!id || !connection) throw new InvalidArgumentError();
    this.id = id;
    this.connection = connection;
    this.vote = null;
  }

  castVote(vote) {
    this.vote = vote;
  }

  uncastVote() {
    this.vote = null;
  }
}

module.exports = Voter;