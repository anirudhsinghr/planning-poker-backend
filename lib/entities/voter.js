const InvalidArgumentError = require("../errors/invalid-argument");

class Voter {
  constructor(id, roomId, connection) {
    if (!id || !roomId || !connection) throw new InvalidArgumentError();
    this.id = id;
    this.roomId = roomId;
    this.connection = connection;

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

  disconnectFromRoom() {
    this.connection.disconnect();
  }

  changeConnection(connection) {
    this.connection = connection;
  }

  notify({ event, data }) {
    this.connection.emit(event, data);
  }
}

module.exports = Voter;