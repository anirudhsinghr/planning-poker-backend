const expect = require("chai").expect;
const Room = require("../lib/entities/room");
const Voter = require("../lib/entities/voter");
const RoomRepository = require("../lib/repositories/room.repository");
const VoterRepository = require("../lib/repositories/voter.repository");
const RoomNotFoundError = require("../lib/errors/room-not-found");
const LeaveRoom = require("../lib/usecase/leave-room");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const StubConnection = require("./stubs/stub-connection");

describe("Leave Room", function() {
  let roomRepository = null;
  let voterRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    voterRepository = new VoterRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("user gets removed from the room", function() {
    const room = createRoomWithVoterIds(["1", "2"]);
    const userCase = createUseCase();
    const input = { roomId: room.id, voterId: "1" }
    
    userCase.execute(input);

    expect(roomRepository.findById(room.id).voterCount()).to.equal(1);
    expect(voterRepository.findById(input.voterId)).to.be.undefined;
    expect(eventBroadcaster.voterLeftRoomWasCalledOnce()).to.be.true;
    expect(eventBroadcaster.voterLeftRoomWasCalledWithInput(input)).to.be.true;
  });

  it("given invalid room id will throw error", function() {
    const invlaidRoomId = "invalid-room-id";
    const userCase = createUseCase();
    const input = { roomId: invlaidRoomId, voterId: "1" }

    expect(
      () => userCase.execute(input)
    ).throws(RoomNotFoundError);
  });

  it("Room is deleted with voters when last voter leaves", function() {
    const room = createRoomWithVoterIds(["1"]);
    const userCase = createUseCase();
    const input = { roomId: room.id, voterId: "1" }
    userCase.execute(input);
    
    expect(roomRepository.findById(room.id)).to.be.undefined;
    expect(voterRepository.findById("1")).to.be.undefined;
  });

  function createRoomWithVoterIds(votersIds = ["1"]) {
    const room = createVotersForRoom(new Room("new-room-id"), votersIds);
    roomRepository.save(room);
    return room;
  }

  function createVotersForRoom(room, voterIds) {
    voterIds.forEach((id) => {
      const voter = new Voter(id, room.id, new StubConnection());
      room.addVoter(voter)
      voterRepository.save(voter);
    });
    return room;
  }

  function createUseCase() {
    return new LeaveRoom({ roomRepository, voterRepository, eventBroadcaster });
  }
});