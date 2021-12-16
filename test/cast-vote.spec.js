const expect = require("chai").expect;

const { CastVote } = require("../lib/usecase");

const { RoomRepository, VoterRepository } = require("../lib/repositories");

const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const { createRoom, createVoterForRoom } = require('./fixtures');

describe("Cast Vote", function() {
  let roomRepository = null;
  let voterRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    voterRepository = new VoterRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("A user can cast a vote", function() {
    const vote = "1";
    const roomId = "new-room-id";
    const voterId = "new-voter-id";
    const room = createRoom({roomId, roomRepository});
    const voter = createVoterForRoom({voterId, room, voterRepository});
    const useCase = new CastVote({roomRepository, voterRepository, eventBroadcaster});
    
    useCase.execute({ roomId: roomId, voterId: voterId, vote: vote });
    
    expect(voter.vote).to.equal(vote);
    expect(eventBroadcaster.boradcastVoteCastedToHaveBeenCalledOnce()).to.be.true;
    expect(eventBroadcaster.boradcastVoteCastedToHaveBeenCalledWith({ room, voterId, vote })).to.be.true;
  });
});