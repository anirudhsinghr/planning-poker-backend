class CastVote {
  constructor({ roomRepository }) {
    this.roomRepository = roomRepository;
  }

  execute({ roomId, voterId, vote }) {
    const room = this.roomRepository.findById(roomId);
    room.castVote({ voterId, vote });
  }
}

module.exports = CastVote;