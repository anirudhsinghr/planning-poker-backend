class VoterRepository {
  constructor() {
    this.voter = {};
  }

  save(voter) {
    this.voter[voter.id] = voter;
  }

  findById(id) {
    return this.voter[id];
  }

  remove(id) {
    delete this.voter[id];
  }
}

module.exports = VoterRepository;