const expect = require("chai").expect;

const Room = require("../lib/entities/room");
const Voter = require("../lib/entities/voter");
const Admin = require("../lib/entities/admin");

const RoomRepository = require("../lib/repositories/room.repository");
const VoterRepository = require("../lib/repositories/voter.repository");

const StubConnection = require("./stubs/stub-connection");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");

const ResetVotes = require("../lib/usecase/reset-votes");
const UserNotAdminError = require("../lib/errors/user-not-admin");
const RoomNotFoundError = require("../lib/errors/room-not-found");
const VoterNotFoundError = require("../lib/errors/voter-not-found");

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
    let room = createRoom({ roomId: 'new-room-id' });
    room = addVotersToRoom({ room, data: [{ voterId: "2", vote: "2" }, {voterId: "3", vote: "3"}] });
    room = addAdminToRoom({ room, adminId: "1", vote: "1" });

    expect(room.votes()).to.have.all.members(["1", "2", "3"]);

    useCase.execute({ roomId: room.id, voterId: "1"});

    expect(room.votes()).to.have.all.members([null, null, null]);
    expect(eventBroadcaster.broadcastResetVotesCalledOnce()).to.be.true;
    expect(eventBroadcaster.broadcastResetVotesCalledWith({ room })).to.be.true;
  });

  it("non admin canot reset all votes in the room", function() {
    const useCase = new ResetVotes({ roomRepository, voterRepository, eventBroadcaster });
    let room = createRoom({ roomId: 'new-room-id' });
    room = addVotersToRoom({ room, data: [{ voterId: "2", vote: "2" }, {voterId: "3", vote: "3"}] });
    room = addAdminToRoom({ room, adminId: "1", vote: "1" });

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
    let room = createRoom({ roomId: 'new-room-id' });

    expect(() => useCase.execute({ roomId: room.id, voterId: "2" }))
      .to.throw(VoterNotFoundError);
  });

  function createRoom({ roomId }) {
    const room = new Room(roomId);
    roomRepository.save(room);
    return room;
  }

  function addVotersToRoom({ room, data }) {
    data.forEach(({ voterId, vote }) => {
      const voter = new Voter(voterId, room.id, new StubConnection());
      voter.castVote(vote);
      voterRepository.save(voter);
      room.addVoter(voter);
    });
    return room;
  }

  function addAdminToRoom({ room, adminId, vote }) {
    const admin = new Admin(adminId, room.id, new StubConnection());
    admin.castVote(vote);
    voterRepository.save(admin);
    room.addVoter(admin);
    return room;
  }
});