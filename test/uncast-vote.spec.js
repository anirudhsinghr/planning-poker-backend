const { expect } = require("chai");
const Room = require("../lib/entities/room");
const Voter = require("../lib/entities/voter");
const RoomNotFoundError = require("../lib/errors/room-not-found");
const VoterNotFoundError = require("../lib/errors/voter-not-found");
const RoomRepository = require("../lib/repositories/room.repository");
const VoterRepository = require("../lib/repositories/voter.repository");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const StubConnection = require("./stubs/stub-connection");
const UncastVote = require("../lib/usecase/uncast-vote");

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
    const room = createRoom("new-room-id");
    const voter = createVoter("new-voter-id", room.id);
    room.addVoter(voter);
    voter.castVote("1");
    const useCase = new UncastVote({ roomRepository, voterRepository, eventBroadcaster });
    
    expect(voter.vote).not.to.be.null;
    
    useCase.excute({ voterId: voter.id, roomId: room.id });
    
    expect(voterRepository.findById(voter.id).vote).to.be.null;
    expect(eventBroadcaster.broadcastUncastVoteWasCalledOnced()).to.be.true;
    expect(eventBroadcaster.broadcastUncastVoteWasCalledWith({ room, voterId: voter.id })).to.be.true;
  });

  it("if a voter is not found then error is thrown", function() {
    const room = createRoom("new-room-id");
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

  function createRoom(id) {
    const room = new Room(id);
    roomRepository.save(room);
    return room;
  }

  function createVoter(id, roomId) {
    const voter = new Voter("new-voter-id", roomId, new StubConnection());
    voterRepository.save(voter);
    return voter;
  }
});