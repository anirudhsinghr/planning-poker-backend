const Packs = require("../entities/packs");
const RoomNotFoundError = require("../errors/room-not-found");

class SelectPack {
  constructor({ roomRepository, eventBroadcaster }) {
    this.roomRepository = roomRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, packName }) {
    if (!Packs.has(packName)) return;

    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();
    
    room.changePack(packName);
  }
}

module.exports = SelectPack;