const expect = require("chai").expect;
const Voter = require("../lib/entities/voter");
const Room = require("../lib/entities/room");
const StubConnection = require("./stubs/stub-connection");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const RoomRepository = require("../lib/repositories/room.repository");
const VoterRepository = require("../lib/repositories/voter.repository");

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
    const room = createRoom(roomId);
    const voter = createVoter(voterId);
    room.addVoter(voterId);
    const useCase = new CastVote({roomRepository, voterRepository, eventBroadcaster});
    
    useCase.execute({ roomId: roomId, voterId: voterId, vote: vote });
    
    expect(voter.vote).to.equal(vote);
    expect(eventBroadcaster.boradcastVoteCastedToHaveBeenCalledOnce()).to.be.true;
  });

  function createRoom(roomId) {
    const room = new Room(roomId);
    roomRepository.save(room);
    return room;
  }
  
  function createVoter(voterId) {
    const voter = new Voter(voterId, new StubConnection());
    voterRepository.save(voter);
    return voter;
  }
});

class CastVote {
  constructor({ roomRepository, voterRepository, eventBroadcaster }) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId, vote }) {
    const room = this.roomRepository.findById(roomId);
    const voter = this.voterRepository.findById(voterId);
    voter.castVote(vote);
    this.eventBroadcaster.broadcastVoteCasted(room);
  }
}