class SSEBroadcaster {
  addParticipant(room, voter) {
    room.voters.forEach((voter) => {
      voter.connection.send({ event: 'room.joined', id: voter.id });
    });
  }
}

module.exports = SSEBroadcaster;