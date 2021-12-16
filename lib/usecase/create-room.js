const Room = require("../entities/room");
const Admin = require("../entities/admin");
const RoomAlreadyExistsError = require("../errors/room-already-exists");
const InvalidArgumentError = require("../errors/invalid-argument");

class CreateRoom{
  constructor({roomRepository, voterRepository, eventBroadcaster}) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
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
    this.eventBroadcaster.addParticipant(room, admin);
    return { roomId: room.id };
  }
}

module.exports = CreateRoom;