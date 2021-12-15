const Room = require("../lib/entities/room");
const Voter = require("../lib/entities/voter");
const Admin = require("../lib/entities/admin");
const JoinRoom = require("../lib/usecase/join-room");
const RoomRepository = require("../lib/repositories/room.repository");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const StubConnection = require("./stubs/stub-connection");
const RoomNotFoundError = require("../lib/errors/room-not-found");

const { expect } = require("chai");
const VoterRepository = require("../lib/repositories/voter.repository");

describe("Join Room", function() {

  let roomRepository = null;
  let voterRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    voterRepository = new VoterRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("Voter joining an existing room is broadcasted to all members in the room", function() {
    const room = createRoom("123456");
    const useCase = new createUsecase();
    const input = createUseCaseInput({ roomId: "123456" });
    
    useCase.execute(input);

    expect(voterRepository.findById(input.voterId)).to.not.undefined;
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

  it("Admins can join the same room again", function() {
    const room = createRoom("room-id");
    const admin = createAdmin({ roomId: room.id, adminId: "admin-id" });
    const useCase = new createUsecase();
    const input = createUseCaseInput({ roomId: room.id, voterId: admin.id });
    
    room.addVoter(admin);
    expect(room.admin()).to.equal(admin);
    
    room.removeVoter(admin.id);
    expect(room.admin()).to.equal(undefined);
    
    useCase.execute(input)
    expect(room.admin()).to.equal(admin);
  });

  function createRoom(id) {
    const room = new Room(id);
    roomRepository.save(room);
    return room;
  }

  function createAdmin({ roomId, adminId }) {
    const admin = new Admin(adminId, roomId, new StubConnection());
    voterRepository.save(admin);
    return admin;
  }

  function createUsecase() {
    return new JoinRoom({roomRepository, voterRepository, eventBroadcaster});
  }

  function createUseCaseInput(overrides) {
    return { roomId: "new-room-id", voterId: "new-voter-id", connection: new StubConnection(), ...overrides }
  }
});