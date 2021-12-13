const RoomNotFoundError = require("../errors/room-not-found");

class LeaveRoom {
  constructor({roomRepository, voterRepository, eventBroadcaster}) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();
    room.removeVoterWithId(voterId);
    this.voterRepository.remove(voterId);
    this.eventBroadcaster.broadcastVoterLeft({ roomId, voterId });
  }
}

module.exports = LeaveRoom;