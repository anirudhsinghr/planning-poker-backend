class CastVote {
  constructor({ roomRepository, voterRepository }) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
  }

  execute({ roomId, voterId, vote }) {
    const room = this.roomRepository.findById(roomId);
    const voter = this.voterRepository.findById(voterId);
    if (!room || !voter || !room.contains(voter)) return;
    
    room.castVote({ voterId, vote });
  }
}

module.exports = CastVote;