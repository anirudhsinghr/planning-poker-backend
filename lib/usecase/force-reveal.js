const RoomNotFoundError = require("../errors/room-not-found");
const VoterNotFoundError = require("../errors/voter-not-found");
const UserNotAdminError = require("../errors/user-not-admin");

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
    
    if (!room.contains(voter) || !voter.isAdmin()) throw new UserNotAdminError();
    this.eventBroadcaster.broadcastReveal({ room });
  }
}

module.exports = ForceReveal;