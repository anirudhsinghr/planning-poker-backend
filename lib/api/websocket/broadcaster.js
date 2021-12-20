class Broadcaster {
  broadcastState({room, voter}) {
    room.voters.forEach((v) => {
      v.connection.send(this.toState({ room, voter }));
    });
  }

  toState({room, voter}) {
    const voters = [];
    room.voters.forEach(v => voters.push({ voterId: v.id, vote: v.vote, isAdmin: v.admin }));
    return {
      roomId: room.id,
      targetVoterId: voter.id,
      voters: voters,
      pack: room.pack
    }
  }
}

module.exports = Broadcaster;