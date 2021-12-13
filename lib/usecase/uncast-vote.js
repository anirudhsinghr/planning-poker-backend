const RoomNotFoundError = require("../errors/room-not-found");
const VoterNotFoundError = require("../errors/voter-not-found");

class UncastVote {
  constructor({ roomRepository, voterRepository, eventBroadcaster }) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  excute({voterId, roomId}) {
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();
    
    const voter = this.voterRepository.findById(voterId);
    if (!voter) throw new VoterNotFoundError();
    
    voter.uncastVote();
    this.eventBroadcaster.broadcastUncastVote({ room, voterId });
  }
}

module.exports = UncastVote;