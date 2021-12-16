const InvalidArgumentError = require("./invalid-argument");
const RoomAlreadyExistsError = require("./room-already-exists");
const RoomNotFoundError = require("./room-not-found");
const UserNotAdminError = require("./user-not-admin");
const VoterNotFoundError = require("./voter-not-found");

module.exports = { 
  RoomNotFoundError, 
  UserNotAdminError, 
  VoterNotFoundError,
  InvalidArgumentError, 
  RoomAlreadyExistsError
};
