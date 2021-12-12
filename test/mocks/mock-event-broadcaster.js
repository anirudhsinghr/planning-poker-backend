class MockEventBroadcaster {
  constructor() {
    this.calls = { 'add-participant': [] };
  }

  addParticipant(room, voter) {
    this.calls['add-participant'].push({room, voter});
  }

  broadcastAddParticipantCalledOnce() {
    return this.calls['add-participant'].length == 1;
  }

  addedParticipantsToCorrectRoom(participantInfo) {
    const params = this.calls['add-participant'][0];

    return participantInfo.roomId == params.room.id &&
    participantInfo.voterId == params.voter.id;
  }
}

module.exports = MockEventBroadcaster;