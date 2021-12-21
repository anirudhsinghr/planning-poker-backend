const InvalidArgumentError = require("../errors/invalid-argument");
const Packs = require("./packs");
class Room {
  constructor(id, channel) {
    if (!id) throw new InvalidArgumentError();
    this.id = id;
    this.channel = channel;
    this.voters = [];
    this.pack = {name: "fibonacci", data: Packs.fibonacci};
    this.revealed = false;
  }

  addVoter(voter) {
    if (this.contains(voter)) this.removeVoter(voter);
    this.voters.push(voter);

    this.broadcastState();
  }

  voterCount() {
    return this.voters.length;
  }

  changePack(packName) {
    this.pack = { name: packName, data: Packs[packName] };
    this.broadcastState();
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

  contains(voter) {
    return !!this.voters.find(v => v.id === voter.id);
  }

  currentState() {
    return { 
      roomId: this.id, 
      pack: this.pack,
      revealed: this.revealed,
      voters: this.voterInfo(), 
      availablePacks: ["fibonacci", "sequential"],
    }
  }

  voterInfo() {
    return this.voters.map(v => ({ id: v.id, vote: v.vote, isAdmin: v.admin }));
  }

  castVote({voterId, vote}) {
    const voter = this.voters.find(v => v.id == voterId);
    if (!voter) return;
    voter.castVote(vote); 
    console.log(this.voters);
    this.broadcastState();
  }
}

module.exports = Room;