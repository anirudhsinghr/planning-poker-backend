const { CreateRoom, JoinRoom } = require("../usecase");
const { RoomRepository, VoterRepository } = require("../repositories");
const { SSEBroadcaster } = require("./sse");

const roomRepository = new RoomRepository();
const voterRepository = new VoterRepository();
const eventBroadcaster = new SSEBroadcaster();

function buildCreateRoom() {
  return new CreateRoom({ roomRepository, voterRepository });
}

function buildJoinRoom() {
  return new JoinRoom({ roomRepository, voterRepository, eventBroadcaster });
}


module.exports = { buildCreateRoom, buildJoinRoom, roomRepository };