const Room = require("../lib/entities/room");
const JoinRoom = require("../lib/usecase/join-room");
const RoomRepository = require("../lib/repositories/room.repository");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const StubConnection = require("./stubs/stub-connection");
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
    const room = createRoom("123456");
    const useCase = new createUsecase();
    const input = createUseCaseInput({ roomId: "123456" });
    
    useCase.execute(input);

    expect(eventBroadcaster.broadcastAddParticipantCalledOnce()).to.be.true;
    expect(eventBroadcaster.addedParticipantsToCorrectRoom(input)).to.be.true;
    expect(room.voterCount()).to.equal(1);
  });

  it("Voter joining a non-existant room throws error", function() {
    const useCase = new createUsecase();
    const input = createUseCaseInput({ roomId: "non-existant" });
    expect(
      () => useCase.execute(input)
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

  function createUseCaseInput(overrides) {
    return { roomId: "new-room-id", voterId: "new-voter-id", connection: new StubConnection(), ...overrides }
  }
});