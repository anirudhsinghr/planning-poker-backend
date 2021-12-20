class Connection {
  constructor(roomId, socket) {
    this.socket = socket;
    this.roomId = roomId;
    this.socket.join(roomId);
  }

  disconnect() {
    this.socket.leave(this.roomId);
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }
}

module.exports = Connection;