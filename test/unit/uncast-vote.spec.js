const expect = require("chai").expect;

const { UncastVote } = require("../../lib/usecase");
const { RoomRepository, VoterRepository } = require("../../lib/repositories");
const { RoomNotFoundError, VoterNotFoundError } = require("../../lib/errors");

const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");

const { createRoom, createVoterForRoom } = require("./fixtures");

describe("Uncast Vote", function() {

  let roomRepository = null;
  let voterRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    voterRepository = new VoterRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("a use can uncast a vote", function() {
    const room = createRoom({roomId: "new-room-id", roomRepository});
    const voter = createVoterForRoom({voterId: "new-voter-id", room, voterRepository});
    const useCase = new UncastVote({ roomRepository, voterRepository, eventBroadcaster });
    voter.castVote("1");
    
    expect(voter.vote).not.to.be.null;
    
    useCase.excute({ voterId: voter.id, roomId: room.id });
    
    expect(voterRepository.findById(voter.id).vote).to.be.null;
    expect(eventBroadcaster.broadcastUncastVoteWasCalledOnced()).to.be.true;
    expect(eventBroadcaster.broadcastUncastVoteWasCalledWith({ room, voterId: voter.id })).to.be.true;
  });

  it("if a voter is not found then error is thrown", function() {
    const room = createRoom({roomId: "new-room-id", roomRepository});
    const useCase = new UncastVote({ roomRepository, voterRepository, eventBroadcaster });
    
    expect(
      () => useCase.excute({ voterId: 'invalid-voter-id', roomId: room.id })
    ).to.throw(VoterNotFoundError);
  });

  it("if a room is not found then error is thrown", function() {
    const useCase = new UncastVote({ roomRepository, voterRepository, eventBroadcaster });
    
    expect(
      () => useCase.excute({ voterId: 'invalid-voter-id', roomId: 'invalid-room-id' })
    ).to.throw(RoomNotFoundError);
  });
});