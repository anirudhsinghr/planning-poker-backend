const expect = require("chai").expect;

const CreateRoom = require("../lib/usecase/create-room");
const InvalidArgumentError = require("../lib/errors/invalid-argument");
const RoomAlreadyExistsError = require("../lib/errors/room-already-exists");
const RoomRepository = require("../lib/repositories/room.repository");
const VoterRepository = require("../lib/repositories/voter.repository");
const Room = require("../lib/entities/room");
const Packs = require("../lib/entities/packs");

const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const StubConnection = require("./stubs/stub-connection");

describe("Create Room", function() {

  let roomRepository = null;
  let voterRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    voterRepository = new VoterRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("a new room can be created when valid id is given", function() {
    const useCase = createUseCase();
    const input = createUseCaseInput();

    const { roomId } = useCase.execute(input);

    expect(roomId).to.not.be.null;
    expect(roomRepository.findById(roomId).id).to.equal(input.roomId);
  });

  it("a new room is created with an admin", function() {
    const useCase = createUseCase();
    const input = createUseCaseInput();

    const { roomId } = useCase.execute(input);
    const room = roomRepository.findById(roomId);

    expect(room.admin()).to.not.be.undefined;
    expect(room.admin().id).to.equal(input.voterId);
  });

  it("a new room is created with a single user", function() {
    const useCase = createUseCase();
    const input = createUseCaseInput();

    useCase.execute(input);

    expect(eventBroadcaster.addedParticipantsToCorrectRoom(input)).to.be.true;
    expect(roomRepository.findById(input.roomId)).not.to.be.null;
    expect(voterRepository.findById(input.voterId)).not.be.undefined;
  });

  it("throws error when a new room is created with invalid data", function() {
    const useCase = createUseCase();

    expect(
      () => useCase.execute(createUseCaseInput({roomId: null}))
    ).to.throw(InvalidArgumentError);

    expect(
      () => useCase.execute(createUseCaseInput({voterId: null}))
    ).to.throw(InvalidArgumentError);

    expect(
      () => useCase.execute(createUseCaseInput({connection: null}))
    ).to.throw(InvalidArgumentError);
  });

  it("throws error when a new room is created with a non-unique id", function() {
    const useCase = createUseCase();
    const input = createUseCaseInput();
    roomRepository.save(new Room(input.roomId));

    expect(() => useCase.execute(input)).to.throw(RoomAlreadyExistsError);
  });

  it("A room is created with fobnacci pack", function() {
    const useCase = createUseCase();
    const input = createUseCaseInput();

    const { roomId}  = useCase.execute(input);
    const room = roomRepository.findById(roomId)

    expect(room.pack).to.equal(Packs.fibonacci);
  });

  function createUseCase() {
    return new CreateRoom({roomRepository, voterRepository, eventBroadcaster});
  }

  function createUseCaseInput(overrides) {
    return { roomId: "new-room-id", voterId: "new-voter-id", connection: new StubConnection(), ...overrides }
  }
});