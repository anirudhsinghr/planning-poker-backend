const { Packs } = require("../entities");
const { RoomNotFoundError, UserNotAdminError, VoterNotFoundError } = require("../errors");

class SelectPack {
  constructor({ roomRepository, voterRepository, eventBroadcaster }) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId, packName }) {
    if (!Packs.has(packName)) return;

    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();
    
    const voter = this.voterRepository.findById(voterId);
    if (!voter) throw new VoterNotFoundError();

    if (!voter.isAdminOf(room)) throw new UserNotAdminError();
    
    room.changePack(packName);

    this.eventBroadcaster.broadcastPackChanged({ room, pack : Packs[packName] });
  }
}

module.exports = SelectPack;