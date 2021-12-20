class RoomRepository {
  constructor() {
    this.rooms = {};
  }

  save(room) {
    this.rooms[room.id] = room;
  }
  
  findById(id) {
    return this.rooms[id];
  }

  remove(roomId) {
    delete this.rooms[roomId];
  }
}

module.exports = RoomRepository;