const InvalidArgumentError = require("../errors/invalid-argument");
const Packs = require("./packs");
class Room {
  constructor(id) {
    if (!id) throw new InvalidArgumentError();
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

  contains(voter) {
    return this.voters.find(v => v.id == voter.id) !== undefined;
  }

  votes() {
    return this.voters.map(v => v.vote);
  }

  resetVotes() {
    this.voters.forEach(voter => voter.resetVote());
  }

  removeVoter(voterId) {
    this.voters = this.voters.filter(voter => voter.id != voterId);
  }

  admin() {
    return this.voters.find(voter => voter.admin);
  }
}

module.exports = Room;