const { Voter } = require("../entities");
const { RoomNotFoundError } = require("../errors");

class JoinRoom {
  constructor({roomRepository, voterRepository, eventBroadcaster}) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId, connection }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();

    let voter = this.createVoter({voterId, roomId, connection});
    
    room.addVoter(voter);

    this.voterRepository.save(voter);
    this.eventBroadcaster.addParticipant(room, voter);
  }

  createVoter({ voterId, roomId, connection }) {
    let voter = this.voterRepository.findById(voterId);
    return voter !== undefined ? voter : new Voter(voterId, roomId, connection)
  }
}

module.exports = JoinRoom;