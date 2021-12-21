const { RoomNotFoundError, VoterNotFoundError, UserNotAdminError}  = require("../errors");

class ForceReveal {
  constructor({ roomRepository, voterRepository}) {
    this.voterRepository = voterRepository;
    this.roomRepository = roomRepository;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) return;
    
    const voter = this.voterRepository.findById(voterId);
    if (!voter) return;

    if (!room.contains(voter) || !voter.isAdminOf(room)) return;
    
    room.reveal();
  }
}

module.exports = ForceReveal;