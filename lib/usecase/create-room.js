const Room = require("../entities/room");
const Voter = require("../entities/voter");


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

class InvalidArgumentError extends Error {
  constructor() {
    super("Given arguments are invalid");
    this.name = "InvalidArgumentError";
  }
}

class RoomAlreadyExistsError extends Error {
  constructor() {
    super("Given room id is already in use");
    this.name = "RoomAlreadyExistsError";
  }
}

module.exports = { CreateRoom, InvalidArgumentError, RoomAlreadyExistsError }