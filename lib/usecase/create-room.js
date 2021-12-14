const Room = require("../entities/room");
const Voter = require("../entities/voter");
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
    
    const room = new Room(roomId);
    const voter = new Voter(voterId, roomId, connection);
    room.addVoter(voter);

    this.roomRepository.save(room);
    this.voterRepository.save(voter);
    this.eventBroadcaster.addParticipant(room, voter);
    return room;
  }
}

module.exports = CreateRoom;