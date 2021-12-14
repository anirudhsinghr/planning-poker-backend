const { expect } = require("chai");

const Room = require("../lib/entities/room");
const Voter = require("../lib/entities/voter");

const RoomRepository = require("../lib/repositories/room.repository");
const VoterRepository = require("../lib/repositories/voter.repository");

const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const StubConnection = require("./stubs/stub-connection");

const RoomNotFoundError = require("../lib/errors/room-not-found");
const VoterNotFoundError = require("../lib/errors/voter-not-found");
const UserNotAdminError = require("../lib/errors/user-not-admin");

const ForceReveal = require("../lib/usecase/force-reveal");
const Admin = require("../lib/entities/admin");

describe("Force Reveal", function() {
  let roomRepository = null;
  let voterRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    voterRepository = new VoterRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("Admins can force reveal", function() {
    const useCase = createUseCase();
    
    const room = createRoom();
    const voter = createAdminVoter(room.id);

    room.addVoter(voter);

    useCase.execute({ roomId: room.id, voterId: voter.id });
    expect(eventBroadcaster.broadcastRevealWasCalledOnce()).to.be.true;
    expect(eventBroadcaster.broadcastRevealWasCalledWith({ room })).to.be.true;
  });

  it("Non Admins cannot force reveal", function() {
    const useCase = createUseCase();
    
    const room = createRoom();
    const voter = createVoter(room.id);

    room.addVoter(voter);

    expect(() => useCase.execute({ roomId: room.id, voterId: voter.id }))
      .to.throw(UserNotAdminError);
  });

  it("Invalid data causes errors", function() {
    const useCase = createUseCase();

    const room = createRoom();
    const voter = createAdminVoter(room.id);

    room.addVoter(voter);

    expect(() => useCase.execute({ roomId: 'invalid-room-id', voterId: voter.id }))
      .to.throw(RoomNotFoundError);

    expect(() => useCase.execute({ roomId: room.id, voterId: 'invalid-voter-id' }))
      .to.throw(VoterNotFoundError);
  });

  it("Admin not belonging to the room cannot cause reveal", function() {
    const useCase = createUseCase();

    const room = createRoom();
    const voter = createAdminVoter(room.id);

    expect(() => useCase.execute({ roomId: room.id, voterId: voter.id }))
      .to.throw(UserNotAdminError);
  });

  function createUseCase() {
    return new ForceReveal({ roomRepository, voterRepository, eventBroadcaster });;
  }

  function createRoom() {
    const room = new Room("new-room-id");
    roomRepository.save(room);
    return room;
  }

  function createAdminVoter(roomId) {
    const admin = new Admin("new-admin-id", roomId, new StubConnection());
    voterRepository.save(admin);
    return admin;
  }

  function createVoter(roomId) {
    const voter = new Voter("new-voter-id", roomId, new StubConnection());
    voterRepository.save(voter);
    return voter;
  }
});