const Room = require("../entities/room");
const Voter = require("../entities/voter");
const RoomAlreadyExistsError = require("../errors/room-already-exists");
const InvalidArgumentError = require("../errors/invalid-argument");

class CreateRoom{
  constructor({roomRepository, eventBroadcaster}) {
    this.roomRepository = roomRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, userId, connection } = { roomId: null, userId: null, connection: null }) {
    if (!roomId || !userId || !connection) throw new InvalidArgumentError();
    if (this.roomRepository.findById(roomId) != null ) {
      throw new RoomAlreadyExistsError();
    }
    
    const room = new Room(roomId);
    const voter = new Voter(userId);
    room.addVoter(voter);

    this.roomRepository.save(room);
    this.eventBroadcaster.addParticipant({roomId, userId, connection});
    return room;
  }
}

module.exports = CreateRoom;