const Room = require("../entities/room");
const Voter = require("../entities/voter");
const RoomAlreadyExistsError = require("../errors/room-already-exists");
const InvalidArgumentError = require("../errors/invalid-argument");

class CreateRoom{
  constructor({roomRepository, eventBroadcaster}) {
    this.roomRepository = roomRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ id, userId, connection } = { id: null, userId: null, connection: null }) {
    if (!id || !userId || !connection) throw new InvalidArgumentError();
    if (this.roomRepository.findById(id) != null ) {
      throw new RoomAlreadyExistsError();
    }
    
    const room = new Room(id);
    const voter = new Voter(userId);
    room.addVoter(voter);

    this.roomRepository.save(room);
    this.eventBroadcaster.addParticipant({roomId: id, userId: userId, connection: connection});
    return room;
  }
}

module.exports = CreateRoom;