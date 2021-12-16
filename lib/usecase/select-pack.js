const Packs = require("../entities/packs");
const RoomNotFoundError = require("../errors/room-not-found");
const UserNotAdminError = require("../errors/user-not-admin");
const VoterNotFoundError = require("../errors/voter-not-found");

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