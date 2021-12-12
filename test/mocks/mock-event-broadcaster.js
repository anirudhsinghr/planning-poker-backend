class MockEventBroadcaster {
  constructor() {
    this.calls = { 'add-participant': [], 'voter-left': [] };
  }

  addParticipant(room, voter) {
    this.calls['add-participant'].push({room, voter});
  }
  
  broadcastVoterLeft({ roomId, voterId }) {
    this.calls['voter-left'].push({roomId, voterId});
  }

  broadcastAddParticipantCalledOnce() {
    return this.calls['add-participant'].length == 1;
  }

  addedParticipantsToCorrectRoom(participantInfo) {
    const params = this.calls['add-participant'][0];

    return participantInfo.roomId == params.room.id &&
    participantInfo.voterId == params.voter.id;
  }

  voterLeftRoomWasCalledOnce() {
    return this.calls['voter-left'].length == 1;
  }

  voterLeftRoomWasCalledWithInput({ roomId, voterId }) {
    const params = this.calls['voter-left'][0];
    return params.roomId == roomId && params.voterId == voterId;
  }
}

module.exports = MockEventBroadcaster;