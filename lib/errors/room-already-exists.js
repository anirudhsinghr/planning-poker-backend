class RoomAlreadyExistsError extends Error {
  constructor() {
    super("Given room id is already in use");
    this.name = "RoomAlreadyExistsError";
  }
}

module.exports = RoomAlreadyExistsError;