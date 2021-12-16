const Voter = require("../../lib/entities/voter");
const StubConnection = require("../stubs/stub-connection");

function createVoter({ voterId, roomId, voterRepository }) {
  const connection = new StubConnection();
  const voter = new Voter(voterId, roomId, connection);
  voterRepository.save(voter);
  return voter;
}

function createVoterForRoom({ voterId, room, voterRepository }) {
  const voter = createVoter({ voterId, roomId: room.id, voterRepository })
  room.addVoter(voter);
  return voter;
}

module.exports = { createVoter, createVoterForRoom };