const { expect } = require("chai");
const Room = require("../lib/entities/room");
const Packs = require("../lib/entities/packs");
const RoomRepository = require("../lib/repositories/room.repository");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const RoomNotFoundError = require("../lib/errors/room-not-found");
const SelectPack = require("../lib/usecase/select-pack");

describe("Select Pack", function() {
  let roomRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("After creation a rooms pack can be changed", function() {
    const room = createRoom("new-room-id");
    const useCase = createUseCase();

    expect(room.pack).to.equal(Packs.fibonacci);
    
    useCase.execute({ roomId: room.id, packName: "sequential" });

    expect(room.pack).to.equal(Packs.sequential);
  });

  it("If room does not exist and raises and error", function() {
    const roomId = "new-room-id";
    const useCase = createUseCase();
    
    expect(
      () => useCase.execute({ roomId: roomId, packName: "sequential" })
    ).to.throw(RoomNotFoundError);
  });

  it("If pack does not exist then the pack remains the same", function() {
    const room = createRoom("new-room-id");
    const useCase = createUseCase();
    
    expect(room.pack).to.equal(Packs.fibonacci);

    useCase.execute({ roomId: room.id, packName: "non-existant-pack" })
    
    expect(room.pack).to.equal(Packs.fibonacci);
  });

  function createRoom(id) {
    const room = new Room(id);
    roomRepository.save(room);
    return room;
  }

  function createUseCase() {
    return new SelectPack({ roomRepository, eventBroadcaster });
  }
});