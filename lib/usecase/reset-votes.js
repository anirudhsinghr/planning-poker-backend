const { RoomNotFoundError, UserNotAdminError, VoterNotFoundError } = require("../errors");

class ResetVotes {
  constructor({ roomRepository, voterRepository }) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) return;
    
    const voter = this.voterRepository.findById(voterId);
    if (!voter) return;
    
    if (!voter.isAdminOf(room)) return;
    room.reset();
  }
}

module.exports = ResetVotes;