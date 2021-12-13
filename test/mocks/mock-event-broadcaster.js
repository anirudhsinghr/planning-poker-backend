class MockEventBroadcaster {
  constructor() {
    this.calls = { 'add-participant': [], 'voter-left': [], 'pack-changed': [] };
  }

  addParticipant(room, voter) {
    this.calls['add-participant'].push({room, voter});
  }
  
  broadcastVoterLeft({ roomId, voterId }) {
    this.calls['voter-left'].push({roomId, voterId});
  }

  broadcastPackChanged({ room, pack }) {
    this.calls['pack-changed'].push({ room, pack });
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

  broadCastPackChangeToHaveBeenCalledOnce() {
    return this.calls["pack-changed"].length == 1;
  }

  broadCastPackChangeToHaveBeenCalledWith({ room, pack }) {
    const params = this.calls['pack-changed'][0];
    return params.room == room && params.pack == pack;
  }
}

module.exports = MockEventBroadcaster;