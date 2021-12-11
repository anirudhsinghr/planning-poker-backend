const Room = require("../entities/room")

class CreateRoom{
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  execute({ id } = { id: null }) {
    if (!id) throw new InvalidIdError();
    if (this.roomRepository.findById(id) != null ) {
      throw new RoomAlreadyExistsError();
    }
    const room = new Room(id);
    this.roomRepository.save(room);
    return room;
  }
}

class InvalidIdError extends Error {
  constructor() {
    super("Given id is invalid");
    this.name = "InvalidIdError";
  }
}

class RoomAlreadyExistsError extends Error {
  constructor() {
    super("Given room id is already in use");
    this.name = "RoomAlreadyExistsError";
  }
}

module.exports = { CreateRoom, InvalidIdError, RoomAlreadyExistsError }