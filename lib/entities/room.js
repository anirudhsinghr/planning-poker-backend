const Packs = require("./packs");
class Room {
  constructor(id) {
    this.id = id;
    this.voters = [];
    this.pack = Packs.fibonacci;
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

  changePack(packName) {
    this.pack = Packs[packName];
  }
}

module.exports = Room;