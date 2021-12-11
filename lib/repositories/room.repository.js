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
}

module.exports = RoomRepository;