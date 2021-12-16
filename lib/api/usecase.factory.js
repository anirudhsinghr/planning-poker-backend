const { CreateRoom } = require("../usecase");
const { RoomRepository, VoterRepository } = require("../repositories");

const roomRepository = new RoomRepository();
const voterRepository = new VoterRepository();

function buildCreateRoom() {
  return new CreateRoom({ roomRepository, voterRepository });
}

module.exports = { buildCreateRoom };