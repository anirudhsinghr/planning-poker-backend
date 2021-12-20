class SSEBroadcaster {
  addParticipant(room, voter) {
    room.voters.forEach((v) => {
      v.connection.send({ voterId: voter.id });
    });
  }
}

module.exports = SSEBroadcaster;