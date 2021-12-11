const RoomRepository = require("../lib/repositories/room.repository");
const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");
const Room = require("../lib/entities/room");
const Voter = require("../lib/entities/voter");

const { expect } = require("chai");

describe("Join Room", function() {

  let roomRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("Voter joining an existing room is broadcasted to all members in the room", function() {
    const useCase = new JoinRoom(roomRepository, eventBroadcaster);
    const room = createRoom("123456");

    useCase.execute({ roomId: room.id, voterId: "new-user-id" });

    expect(eventBroadcaster.broadcastNewJoinerCalledOnce()).to.be.true;
    expect(eventBroadcaster.broadcastedNewJoinerToRoom(room)).to.be.true;
    expect(room.voterCount()).to.equal(1);
  });

  function createRoom(id) {
    const room = new Room(id);
    roomRepository.save(room);
    return room;
  }
});

class JoinRoom {
  constructor(roomRepository, eventBroadcaster) {
    this.roomRepository = roomRepository;
    this.eventBroadcaster = eventBroadcaster;
  }

  execute({ roomId, voterId }) {
    const room = this.roomRepository.findById(roomId);
    room.addVoter(new Voter(voterId));
    this.eventBroadcaster.broadcastNewJoinerToRoom(room);
  }
}