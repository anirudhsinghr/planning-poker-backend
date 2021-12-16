const Room = require("../../lib/entities/room");

function createRoom({roomId, roomRepository}) {
  const room = new Room(roomId);
  roomRepository.save(room);
  return room;
}

module.exports = { createRoom };