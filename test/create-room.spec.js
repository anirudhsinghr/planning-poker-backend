const expect = require("chai").expect;

const { CreateRoom, InvalidIdError, RoomAlreadyExistsError } = require("../lib/usecase/create-room");
const RoomRepository = require("../lib/repositories/room.repository");
const Room = require("../lib/entities/room");

describe("Chat Room", function() {

  let roomRepository = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
  });

  it("a new room can be created when valid id is given", function() {
    const useCase = createUseCase();
    const roomId = "123456";

    const room = useCase.execute({ id: roomId });

    expect(room).to.not.be.null;
    expect(roomRepository.findById(roomId)).to.equal(room);
  });

  it("throws error when a new room is created with no id", function() {
    const useCase = createUseCase();
    expect(() => useCase.execute()).to.throw(InvalidIdError);
  });

  it("throws error when a new room is created with id as empty string", function() {
    const useCase = createUseCase();
    expect(() => useCase.execute({ id: "" })).to.throw(InvalidIdError);
  });

  it("throws error when a new room is created with a non-unique id", function() {
    const id = "1234";
    roomRepository.save(new Room(id)); 
    const useCase = createUseCase();

    expect(() => useCase.execute({ id: id })).to.throw(RoomAlreadyExistsError);
  });

  function createUseCase() {
    return new CreateRoom(roomRepository);
  }
});