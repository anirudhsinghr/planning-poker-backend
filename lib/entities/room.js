class Room {
  constructor(id) {
    this.id = id;
    this.voters = [];
  }

  addVoter(voter) {
    this.voters.push(voter);
  }

  removeVoterWithId(voterId) {
    this.voters = this.voters.filter(voter => voter.id != voterId);
  }

  voterCount() {
    return this.voters.length;
  }
}

module.exports = Room;