const RoomNotFoundError = require("../errors/room-not-found");

class LeaveRoom {
  constructor({roomRepository, eventBroadcaster}) {
    this.roomRepository = roomRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();
    room.removeVoterWithId(voterId);
    this.eventBroadcaster.broadcastVoterLeft({ roomId, voterId });
  }
}

module.exports = LeaveRoom;