class MockEventBroadcaster {
  constructor() {
    this.calls = { 'add-participant': [] };
  }

  addParticipant(participantInfo) {
    this.calls['add-participant'].push(participantInfo);
  }

  broadcastAddParticipantCalledOnce() {
    return this.calls['add-participant'].length == 1;
  }

  addedParticipantsToCorrectRoom(participantInfo) {
    const params = this.calls['add-participant'][0];

    return participantInfo.userId == params.userId &&
    participantInfo.roomId == params.roomId &&
    participantInfo.connection == params.connection;
  }
}

module.exports = MockEventBroadcaster;