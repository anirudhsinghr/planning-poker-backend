const expect = require("chai").expect;
const Room = require("../lib/entities/room");
const Voter = require("../lib/entities/voter");
const RoomRepository = require("../lib/repositories/room.repository");
const RoomNotFoundError = require("../lib/errors/room-not-found");
const LeaveRoom = require("../lib/usecase/leave-room");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");

describe("Leave Room", function() {
  let roomRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("user gets removed from the room", function() {
    const room = createRoomWithVoterIds(["1", "2"]);
    const userCase = createUseCase();
    const input = { roomId: room.id, voterId: "1" }
    userCase.execute(input);

    expect(roomRepository.findById(room.id).voterCount()).to.equal(1);
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

  function createRoomWithVoterIds(votersIds = ["1"]) {
    const room = new Room("new-room-id");
    votersIds.forEach((id) => room.addVoter(new Voter(id)));
    roomRepository.save(room);
    return room;
  }

  function createUseCase() {
    return new LeaveRoom({ roomRepository, eventBroadcaster });
  }
});