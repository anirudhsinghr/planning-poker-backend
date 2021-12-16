class VoterRepository {
  constructor() {
    this.voters = {};
  }

  save(voter) {
    this.voters[voter.id] = voter;
  }

  findById(id) {
    return this.voters[id];
  }

  remove(id) {
    delete this.voters[id];
  }

  removeAllWithRoomId(roomId) {
    for (const voterId in this.voters) {
      if (this.voters[voterId].roomId === roomId) {
        delete this.voters[voterId];
      }
    }
  }
}

module.exports = VoterRepository;