const InvalidArgumentError = require("../errors/invalid-argument");

class Voter {
  constructor(id, connection, admin = false) {
    if (!id || !connection) throw new InvalidArgumentError();
    this.id = id;
    this.connection = connection;
    this.vote = null;
    this.admin = admin;
  }

  castVote(vote) {
    this.vote = vote;
  }

  uncastVote() {
    this.vote = null;
  }

  isAdmin() {
    return this.admin;
  }
}

module.exports = Voter;