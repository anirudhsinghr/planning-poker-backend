const { Room } = require("../../../lib/entities");

function createRoom({roomId, roomRepository}) {
  const room = new Room(roomId);
  roomRepository.save(room);
  return room;
}

module.exports = { createRoom };