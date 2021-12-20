const { RoomNotFoundError } = require("../errors");

class LeaveRoom {
  constructor({roomRepository, voterRepository}) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();
    
    const voter = this.voterRepository.findById(voterId);
    
    room.removeVoter(voter);
    this.purgeRoom(room);
    
    if (!voter.isAdminOf(room)) this.voterRepository.remove(voterId);
    return { roomId: room.id, voters: room.voters, pack: room.pack, voterId: voter.id };

  }
  
  purgeRoom(room) {
    if (!room.isEmpty()) return;
    this.voterRepository.removeAllWithRoomId(room.id);
    this.roomRepository.remove(room.id);
  }
}

module.exports = LeaveRoom;