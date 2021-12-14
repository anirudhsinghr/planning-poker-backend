const expect = require("chai").expect;
const Room = require("../lib/entities/room");
const Voter = require("../lib/entities/voter");
const Admin = require("../lib/entities/admin");
const RoomRepository = require("../lib/repositories/room.repository");
const VoterRepository = require("../lib/repositories/voter.repository");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const StubConnection = require("./stubs/stub-connection");
const UserNotAdminError = require("../lib/errors/user-not-admin");

describe("Reset Votes", function() {

  let roomRepository = null;
  let voterRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    voterRepository = new VoterRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("An admin can reset all votes in the room", function() {
    const useCase = new ResetVotes({ roomRepository, voterRepository, eventBroadcaster });
    const v1 = new Admin("1", 'new-room-id', new StubConnection());
    const v2 = new Voter("2", 'new-room-id', new StubConnection()); 
    const v3 = new Voter("3", 'new-room-id', new StubConnection());
    const room = createRoomWithVoters({ roomId: 'new-room-id', voters: [v1, v2, v3] })
    v1.castVote("1");
    v2.castVote("1");
    v3.castVote("1");

    useCase.execute({ roomId: room.id, voterId: v1.id });

    expect(room.votes()).to.deep.equal([null, null, null]);
  });

  it("non admin canot reset all votes in the room", function() {
    const useCase = new ResetVotes({ roomRepository, voterRepository, eventBroadcaster });
    const v1 = new Voter("1", 'new-room-id', new StubConnection());
    const v2 = new Voter("2", 'new-room-id', new StubConnection()); 
    const v3 = new Voter("3", 'new-room-id', new StubConnection());
    const room = createRoomWithVoters({ roomId: 'new-room-id', voters: [v1, v2, v3] })
    v1.castVote("1");
    v2.castVote("1");
    v3.castVote("1");

    expect(() => useCase.execute({ roomId: room.id, voterId: v1.id }))
      .to.throw(UserNotAdminError);

  });


  function createRoomWithVoters({ roomId, voters }) {
    const room = new Room(roomId);
    voters.forEach(v => {
      voterRepository.save(v);
      room.addVoter(v)
    });
    roomRepository.save(room);
    return room;
  }
});

class ResetVotes {
  constructor({ roomRepository, voterRepository, eventBroadcaster }) {
    this.roomRepository = roomRepository;
    this.voterRepository = voterRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    const voter = this.voterRepository.findById(voterId);
    if (!voter.isAdminOf(roomId)) throw new UserNotAdminError();
    room.resetVotes();
  }
}