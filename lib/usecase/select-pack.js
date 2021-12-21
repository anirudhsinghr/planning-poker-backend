const { Packs } = require("../entities");
const { RoomNotFoundError, UserNotAdminError, VoterNotFoundError } = require("../errors");

class SelectPack {
  constructor({ roomRepository, voterRepository }) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
  }

  execute({ roomId, voterId, packName }) {
    if (!Packs.has(packName)) return;

    const room = this.roomRepository.findById(roomId);
    if (!room) throw new RoomNotFoundError();
    
    const voter = this.voterRepository.findById(voterId);
    if (!voter) throw new VoterNotFoundError();

    if (!voter.isAdminOf(room)) throw new UserNotAdminError();
    
    room.changePack(packName);
  }
}

module.exports = SelectPack;