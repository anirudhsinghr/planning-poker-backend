class MockEventBroadcaster {
  constructor() {
    this.calls = { 
      'reveal': [],
      'voter-left': [],
      'vote-casted': [],
      'pack-changed': [],
      'vote-uncasted': [],
      'add-participant': []
    };
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

  broadcastVoteCasted({ room, voterId, vote }) {
    this.calls['vote-casted'].push({room, voterId, vote})
  }

  broadcastUncastVote({ room, voterId }) {
    this.calls['vote-uncasted'].push({ room, voterId })
  }

  broadcastReveal({ room }) {
    this.calls['reveal'].push({ room });
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

  boradcastVoteCastedToHaveBeenCalledOnce() {
    return this.calls['vote-casted'].length == 1;
  }
  
  boradcastVoteCastedToHaveBeenCalledWith({ room, voterId, vote }) {
    const params = this.calls['vote-casted'][0];
    return room == params.room &&
      voterId == params.voterId &&
      vote == params.vote;
  }

  broadcastUncastVoteWasCalledOnced() {
    return this.calls['vote-uncasted'].length == 1;
  }
  
  broadcastRevealWasCalledOnce() {
    return this.calls['reveal'].length == 1;
  }

  broadcastRevealWasCalledWith({ room }) {
    const params = this.calls['reveal'][0];
    return room == params.room;
  }
}

module.exports = MockEventBroadcaster;