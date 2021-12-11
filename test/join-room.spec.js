const Room = require("../lib/entities/room");
const JoinRoom = require("../lib/usecase/join-room");
const RoomRepository = require("../lib/repositories/room.repository");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const RoomNotFoundError = require("../lib/errors/room-not-found");

const { expect } = require("chai");

describe("Join Room", function() {

  let roomRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("Voter joining an existing room is broadcasted to all members in the room", function() {
    const useCase = new createUsecase();
    const room = createRoom("123456");

    useCase.execute({ roomId: room.id, voterId: "new-user-id" });

    expect(eventBroadcaster.broadcastNewJoinerCalledOnce()).to.be.true;
    expect(eventBroadcaster.broadcastedNewJoinerToRoom(room)).to.be.true;
    expect(room.voterCount()).to.equal(1);
  });

  it("Voter joining a non-existant room throws error", function() {
    const useCase = new createUsecase();

    expect(
      () => useCase.execute({ roomId: "invalid-room-id", voterId: "new-user-id" })
    ).to.throw(RoomNotFoundError);
  });

  function createRoom(id) {
    const room = new Room(id);
    roomRepository.save(room);
    return room;
  }

  function createUsecase() {
    return new JoinRoom(roomRepository, eventBroadcaster);
  }
});