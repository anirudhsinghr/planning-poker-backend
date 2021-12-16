const expect = require("chai").expect;

const { ResetVotes } = require("../lib/usecase");
const { RoomRepository, VoterRepository } = require("../lib/repositories");
const { UserNotAdminError, RoomNotFoundError, VoterNotFoundError } = require("../lib/errors/voter-not-found");

const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const { createRoom, createVoterForRoom, createAdminForRoom } = require("./fixtures");

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
    let room = createRoom({ roomId: 'new-room-id', roomRepository });
    const useCase = new ResetVotes({ roomRepository, voterRepository, eventBroadcaster });
    const v1 = createAdminForRoom({ adminId: "1", room, voterRepository });
    const v2 = createVoterForRoom({ voterId: "2", room, voterRepository });
    v1.castVote("1")
    v2.castVote("2");

    expect(room.votes()).to.have.all.members(["1", "2"]);

    useCase.execute({ roomId: room.id, voterId: "1"});

    expect(room.votes()).to.have.all.members([null, null]);
    expect(eventBroadcaster.broadcastResetVotesCalledOnce()).to.be.true;
    expect(eventBroadcaster.broadcastResetVotesCalledWith({ room })).to.be.true;
  });

  it("non admin canot reset all votes in the room", function() {
    const useCase = new ResetVotes({ roomRepository, voterRepository, eventBroadcaster });
    let room = createRoom({ roomId: 'new-room-id', roomRepository });
    const v1 = createAdminForRoom({ adminId: "1", room, voterRepository });
    const v2 = createVoterForRoom({ voterId: "2", room, voterRepository });
    v1.castVote("1")
    v2.castVote("2");

    expect(() => useCase.execute({ roomId: room.id, voterId: "2" }))
      .to.throw(UserNotAdminError);
  });

  it("if room is not found it throws and error", function() {
    const useCase = new ResetVotes({ roomRepository, voterRepository, eventBroadcaster });

    expect(() => useCase.execute({ roomId: "invalid-id", voterId: "2" }))
      .to.throw(RoomNotFoundError);
  });

  it("if voter is not found it throws and error", function() {
    const useCase = new ResetVotes({ roomRepository, voterRepository, eventBroadcaster });
    let room = createRoom({ roomId: 'new-room-id', roomRepository });

    expect(() => useCase.execute({ roomId: room.id, voterId: "2" }))
      .to.throw(VoterNotFoundError);
  });
});