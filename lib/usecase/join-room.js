const { Voter, Admin } = require("../entities");
const { RoomNotFoundError } = require("../errors");

class JoinRoom {
  constructor({roomRepository, voterRepository}) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();

    let voter = this.createVoter({voterId, room});
    
    room.addVoter(voter);

    const result = { roomId: room.id, voters: room.voters, pack: room.pack, voterId: voter.id };
    this.voterRepository.save(voter);
    return result;
  }

  createVoter({ voterId, room }) {
    let voter = this.voterRepository.findById(voterId);
    if (voter) return voter;
    if (room.isEmpty()) return new Admin(voterId, room.id);
    return new Voter(voterId, room.id);
  }
}

module.exports = JoinRoom;