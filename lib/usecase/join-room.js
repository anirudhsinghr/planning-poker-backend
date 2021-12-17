const { Voter, Admin } = require("../entities");
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

    let voter = this.createVoter({voterId, room, connection});
    
    room.addVoter(voter);

    this.voterRepository.save(voter);
    this.eventBroadcaster.addParticipant(room, voter);
  }

  createVoter({ voterId, room, connection }) {
    let voter = this.voterRepository.findById(voterId);
    if (voter) return voter;
    if (room.isEmpty()) return new Admin(voterId, room.id, connection);
    return new Voter(voterId, room.id, connection);
  }
}

module.exports = JoinRoom;