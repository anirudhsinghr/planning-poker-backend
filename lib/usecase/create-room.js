const { Room, Admin } = require("../entities");
const { RoomAlreadyExistsError, InvalidArgumentError } = require("../errors");

class CreateRoom {
  constructor({roomRepository, voterRepository}) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
  }

  execute({ roomId, voterId, connection }) {
    if (!roomId || !voterId || !connection) throw new InvalidArgumentError();
    if (this.roomRepository.findById(roomId) != null ) {
      throw new RoomAlreadyExistsError();
    }
    
    const admin = new Admin(voterId, roomId, connection);
    const room = new Room(roomId);

    room.addVoter(admin);

    this.roomRepository.save(room);
    this.voterRepository.save(admin);
    return { roomId: room.id, adminId: admin.id };
  }
}

module.exports = CreateRoom;