const { RoomNotFoundError, VoterNotFoundError, UserNotAdminError}  = require("../errors");

class ForceReveal {
  constructor({ roomRepository, voterRepository, eventBroadcaster }) {
    this.eventBroadcaster = eventBroadcaster;
    this.voterRepository = voterRepository;
    this.roomRepository = roomRepository;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();
    
    const voter = this.voterRepository.findById(voterId);
    if (!voter) throw new VoterNotFoundError();
    if (!room.contains(voter) || !voter.isAdminOf(room)) throw new UserNotAdminError();
    this.eventBroadcaster.broadcastReveal({ room });
  }
}

module.exports = ForceReveal;