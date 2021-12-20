class Channel {
  constructor(id, io) {
    this.id = id;
    this.io = io;
  }

  broadcast(event, data) {
    this.io.to(this.id).emit(event, data)
  }
}

module.exports = Channel;