const { expect } = require("chai");

const { JoinRoom } = require("../../lib/usecase");
const { RoomRepository, VoterRepository } = require("../../lib/repositories");
const { RoomNotFoundError } = require("../../lib/errors");

const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const StubConnection = require("./stubs/stub-connection");

const { createRoom, createAdmin, createVoter, createAdminForRoom } = require("./fixtures");

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
    const room = createRoom({ roomId: "new-room-id", roomRepository });
    const input = createUseCaseInput({ roomId: room.id });
    const useCase = new createUsecase();
    
    useCase.execute(input);

    expect(voterRepository.findById(input.voterId)).to.not.undefined;
    expect(eventBroadcaster.broadcastAddParticipantCalledOnce()).to.be.true;
    expect(eventBroadcaster.addedParticipantsToCorrectRoom(input)).to.be.true;
    expect(room.voterCount()).to.equal(1);
  });

  it("First user joining a room is its admin", function() {
    const room = createRoom({ roomId: "new-room-id", roomRepository });
    const input = createUseCaseInput({ roomId: room.id });
    const useCase = new createUsecase();
    
    useCase.execute(input);

    expect(voterRepository.findById(input.voterId).isAdminOf(room)).to.be.true;
    expect(room.voterCount()).to.equal(1);
  });

  it("Only one user becomes the admin of the room", function() {
    const room = createRoom({ roomId: "new-room-id", roomRepository });
    const admin = createAdminForRoom({ adminId:"new-admin-id", room, voterRepository })
    const input = createUseCaseInput({ roomId: room.id });
    const useCase = new createUsecase();
    
    useCase.execute(input);

    expect(voterRepository.findById(input.voterId).isAdminOf(room)).to.be.false;
    expect(voterRepository.findById(admin.id).isAdminOf(room)).to.be.true;
    expect(room.voterCount()).to.equal(2);
  });

  it("Voter joining a non-existant room throws error", function() {
    const useCase = new createUsecase();
    const input = createUseCaseInput({ roomId: "non-existant" });
    
    expect(
      () => useCase.execute(input)
    ).to.throw(RoomNotFoundError);
  });

  it("Admins can join the same room again", function() {
    const room = createRoom({ roomId: "new-room-id", roomRepository });
    const admin = createAdmin({ roomId: room.id, adminId: "admin-id", voterRepository });
    const input = createUseCaseInput({ roomId: room.id, voterId: admin.id });
    const useCase = new createUsecase();
    
    useCase.execute(input);

    expect(room.admin()).to.equal(admin);
  });

  it("Voters can join the same room again", function() {
    const room = createRoom({ roomId: "new-room-id", roomRepository });
    const voter = createVoter({ roomId: room.id, voterId: "voter-id", voterRepository });
    const useCase = new createUsecase();
    const input = createUseCaseInput({ roomId: room.id, voterId: voter.id });
    
    useCase.execute(input);

    expect(room.voters).to.contain(voter);
  });

  function createUsecase() {
    return new JoinRoom({roomRepository, voterRepository, eventBroadcaster});
  }

  function createUseCaseInput(overrides) {
    return { roomId: "new-room-id", voterId: "new-voter-id", connection: new StubConnection(), ...overrides }
  }
});