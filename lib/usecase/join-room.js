const { Voter, Admin } = require("../entities");
const { RoomNotFoundError } = require("../errors");

class JoinRoom {
  constructor({roomRepository, voterRepository}) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
  }

  execute({ roomId, voterId, connection }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();

    let voter = this.createVoter({voterId, room, connection});
    voter.notify({ event: 'joined', data: {roomId: room.id, voterId: voter.id} });
    room.addVoter(voter);

    const result = { roomId: room.id, voters: room.voters, pack: room.pack, voterId: voter.id };
    this.voterRepository.save(voter);
    return result;
  }

  createVoter({ voterId, room, connection }) {
    let voter = this.voterRepository.findById(voterId);
    if (voter) {
      voter.changeConnection(connection);
      return voter;
    }
    if (room.isEmpty()) return new Admin(voterId, room.id, connection);
    return new Voter(voterId, room.id, connection);
  }
}

module.exports = JoinRoom;