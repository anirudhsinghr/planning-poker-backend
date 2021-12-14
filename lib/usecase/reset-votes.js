const RoomNotFoundError = require("../errors/room-not-found");
const UserNotAdminError = require("../errors/user-not-admin");
const VoterNotFoundError = require("../errors/voter-not-found");

class ResetVotes {
  constructor({ roomRepository, voterRepository, eventBroadcaster }) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();
    
    const voter = this.voterRepository.findById(voterId);
    if (!voter) throw new VoterNotFoundError();
    
    if (!voter.isAdminOf(roomId)) throw new UserNotAdminError();
    room.resetVotes();
    this.eventBroadcaster.broadcastResetVotes({room});
  }
}

module.exports = ResetVotes;