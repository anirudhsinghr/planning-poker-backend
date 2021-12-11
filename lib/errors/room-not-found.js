class RoomNotFoundError extends Error {
  constructor() {
    super("No room found with given id");
    this.name = "RoomNotFoundError";
  }
}

module.exports = RoomNotFoundError;