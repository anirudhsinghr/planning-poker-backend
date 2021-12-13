const Voter = require("../entities/voter");
const RoomNotFoundError = require("../errors/room-not-found");

class JoinRoom {
  constructor({roomRepository, voterRepository, eventBroadcaster}) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId, connection }) {
    
    const room = this.roomRepository.findById(roomId);
    const voter = new Voter(voterId, connection);

    if (!room) {
      throw new RoomNotFoundError();
    }

    room.addVoter(voter);

    this.voterRepository.save(voter);
    this.eventBroadcaster.addParticipant(room, voter);
  }
}

module.exports = JoinRoom;