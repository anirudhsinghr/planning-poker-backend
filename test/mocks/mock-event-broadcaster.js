class MockEventBroadcaster {
  constructor() {
    this.calls = { 'broadcast-join': [], 'add-participant': [] };
  }

  broadcastNewJoinerToRoom(room) {
    this.calls['broadcast-join'].push({ room: room });
  }

  addParticipant(participantInfo) {
    this.calls['add-participant'].push(participantInfo);
  }

  broadcastNewJoinerCalledOnce() {
    return this.calls['broadcast-join'].length == 1;
  }

  broadcastedNewJoinerToRoom(room) {
    return this.calls['broadcast-join'][0].room == room;
  }

  addedParticipantsToCorrectRoom(participantInfo) {
    const params = this.calls['add-participant'][0];
    
    return participantInfo.userId == params.userId &&
    participantInfo.roomId == params.roomId &&
    participantInfo.connection == params.connection;
  }
}

module.exports = MockEventBroadcaster;