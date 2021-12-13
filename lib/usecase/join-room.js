const Voter = require("../entities/voter");
const RoomNotFoundError = require("../errors/room-not-found");

class JoinRoom {
  constructor(roomRepository, eventBroadcaster) {
    this.roomRepository = roomRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId, connection }) {
    const room = this.roomRepository.findById(roomId);
    const voter = new Voter(voterId, connection);
    if (!room) {
      throw new RoomNotFoundError();
    }

    room.addVoter(voter);

    this.eventBroadcaster.addParticipant(room, voter);
  }
}

module.exports = JoinRoom;