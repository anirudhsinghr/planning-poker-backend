const { expect } = require("chai");

const Packs = require("../lib/entities/packs");

const RoomRepository = require("../lib/repositories/room.repository");
const VoterRepository = require("../lib/repositories/voter.repository");

const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");

const RoomNotFoundError = require("../lib/errors/room-not-found");
const UserNotAdminError = require("../lib/errors/user-not-admin");
const VoterNotFoundError = require("../lib/errors/voter-not-found");

const SelectPack = require("../lib/usecase/select-pack");

const { createRoom, createVoterForRoom, createAdminForRoom } = require("./fixtures");

describe("Select Pack", function() {
  let roomRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    voterRepository = new VoterRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("After creation a rooms pack can be changed by admin", function() {
    const room = createRoom({roomId: "new-room-id", roomRepository});
    const admin = createAdminForRoom({ room, adminId: "new-admin-id", voterRepository });

    const useCase = createUseCase();

    expect(room.pack).to.equal(Packs.fibonacci);
    
    useCase.execute({ roomId: room.id, voterId: admin.id ,packName: "sequential" });

    expect(room.pack).to.equal(Packs.sequential);
    expect(eventBroadcaster.broadCastPackChangeToHaveBeenCalledOnce()).to.be.true;
    expect(eventBroadcaster.broadCastPackChangeToHaveBeenCalledWith({ room, pack: Packs.sequential })).to.be.true;
  });

  it("After creation a rooms pack cannot be changed by non-admin voter", function() {
    const room = createRoom({roomId: "new-room-id", roomRepository});
    const voter = createVoterForRoom({ room, voterId: "new-voter-id", voterRepository });
    
    const useCase = createUseCase();

    expect(() => useCase.execute({ roomId: room.id, voterId: voter.id, packName: "sequential" }))
      .to.throw(UserNotAdminError);
    
    expect(room.pack).to.equal(Packs.fibonacci);
  });

  it("If room does not exist and raises an error", function() {
    const roomId = "new-room-id";
    const useCase = createUseCase();
    
    expect(
      () => useCase.execute({ roomId: roomId, voterId: "random-id", packName: "sequential" })
    ).to.throw(RoomNotFoundError);
  });

  it("If voter does not exist and raises an error", function() {
    const room = createRoom({roomId: "new-room-id", roomRepository});
    const useCase = createUseCase();
    
    expect(
      () => useCase.execute({ roomId: room.id, voterId: "invalid-voter-id", packName: "sequential" })
    ).to.throw(VoterNotFoundError);

    expect(room.pack).to.equal(Packs.fibonacci);
  });

  it("If pack does not exist then the pack remains the same", function() {
    const room = createRoom({roomId: "new-room-id", roomRepository});
    const useCase = createUseCase();
    
    expect(room.pack).to.equal(Packs.fibonacci);

    useCase.execute({ roomId: room.id, packName: "non-existant-pack" })
    
    expect(room.pack).to.equal(Packs.fibonacci);
  });

  function createUseCase() {
    return new SelectPack({ roomRepository, voterRepository, eventBroadcaster });
  }
});