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

  reset() {
    this.voters.forEach(voter => voter.resetVote());
    this.revealed = false;
    this.broadcastState();
  }
  
  reveal() {
    this.revealed = true;
    this.broadcastState();
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
      reveal: this.revealed,
      voters: this.voterInfo(), 
      availablePacks: ["fibonacci", "sequential"],
      reveal: this.revealed
    }
  }

  voterInfo() {
    return this.voters.map(v => ({ id: v.id, vote: v.vote, isAdmin: v.admin }));
  }

  castVote({voterId, vote}) {
    const voter = this.voters.find(v => v.id == voterId);
    if (!voter) return;
    voter.castVote(vote); 
    if (this.allHaveVoted()) {
      this.revealed = true;
    }
    this.broadcastState();
  }

  allHaveVoted() {
    return this.voters.find(v => v.vote == null) === undefined;
  }
}

module.exports = Room;