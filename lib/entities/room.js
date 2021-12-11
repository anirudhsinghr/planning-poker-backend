class Room {
  constructor(id) {
    this.id = id;
    this.voters = [];
  }

  addVoter(voter) {
    this.voters.push(voter);
  }

  voterCount() {
    return this.voters.length;
  }
}

module.exports = Room;