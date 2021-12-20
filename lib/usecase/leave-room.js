const { RoomNotFoundError } = require("../errors");

class LeaveRoom {
  constructor({roomRepository, voterRepository, eventBroadcaster}) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();
    
    const voter = this.voterRepository.findById(voterId);
    
    room.removeVoter(voterId);
    this.purgeRoom(room);
    
    if (!voter.isAdminOf(room)) this.voterRepository.remove(voterId);

    this.eventBroadcaster.broadcastState({ room, voter });
  }
  
  purgeRoom(room) {
    if (!room.isEmpty()) return;
    this.voterRepository.removeAllWithRoomId(room.id);
    this.roomRepository.remove(room.id);
  }
}

module.exports = LeaveRoom;