class CastVote {
  constructor({ roomRepository, voterRepository, eventBroadcaster }) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId, vote }) {
    const room = this.roomRepository.findById(roomId);
    const voter = this.voterRepository.findById(voterId);
    voter.castVote(vote);
    this.eventBroadcaster.broadcastVoteCasted({ room, voterId, vote });
  }
}

module.exports = CastVote;