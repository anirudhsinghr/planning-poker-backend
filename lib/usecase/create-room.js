const { Room, Admin } = require("../entities");
const { RoomAlreadyExistsError, InvalidArgumentError } = require("../errors");

class CreateRoom {
  constructor({roomRepository, voterRepository}) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
  }

  execute({ roomId, channel }) {
    if (!roomId) throw new InvalidArgumentError();
    if (this.roomRepository.findById(roomId) != null ) {
      throw new RoomAlreadyExistsError();
    }
    
    const room = new Room(roomId, channel);

    this.roomRepository.save(room);
    return { roomId: room.id };
  }
}

module.exports = CreateRoom;