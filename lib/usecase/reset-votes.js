const { RoomNotFoundError, UserNotAdminError, VoterNotFoundError } = require("../errors");

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
    
    if (!voter.isAdminOf(room)) throw new UserNotAdminError();
    room.resetVotes();
    this.eventBroadcaster.broadcastResetVotes({room});
  }
}

module.exports = ResetVotes;