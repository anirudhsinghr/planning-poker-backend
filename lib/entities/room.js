const InvalidArgumentError = require("../errors/invalid-argument");
const Packs = require("./packs");
class Room {
  constructor(id, channel) {
    if (!id) throw new InvalidArgumentError();
    this.id = id;
    this.channel = channel;
    this.voters = [];
    this.pack = Packs.fibonacci;
  }

  addVoter(voter) {
    this.voters.push(voter);
    this.broadcastState();
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

  removeVoter(voter) {
    voter.disconnectFromRoom();
    this.voters = this.voters.filter(v => v.id != voter.id);
    this.broadcastState();
  }

  admin() {
    return this.voters.find(voter => voter.admin);
  }

  isEmpty() {
    return this.voters.length === 0;
  }

  broadcastState() {
    this.channel.broadcast("state.changed", this.currentState());
  }

  currentState() {
    return { roomId: this.id, voters: this.voterInfo(), pack: this.pack }
  }

  voterInfo() {
    return this.voters.map(v => ({ id: v.id, vote: v.vote, isAdmin: v.admin }));
  }
}

module.exports = Room;