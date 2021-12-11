const Voter = require("../entities/voter");
const RoomNotFoundError = require("../errors/room-not-found");

class JoinRoom {
  constructor(roomRepository, eventBroadcaster) {
    this.roomRepository = roomRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, userId, connection }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) {
      throw new RoomNotFoundError();
    }

    room.addVoter(new Voter(userId));

    this.eventBroadcaster.addParticipant({ roomId, userId, connection });
  }
}

module.exports = JoinRoom;