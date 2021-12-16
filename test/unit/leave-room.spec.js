const expect = require("chai").expect;

const { LeaveRoom } = require("../../lib/usecase");
const {RoomRepository, VoterRepository} = require("../../lib/repositories");
const { RoomNotFoundError } = require("../../lib/errors");

const MockEventBroadcaster = require("./mocks/mock-event-broadcaster");

const { createRoom, createAdmin,createVoterForRoom, createAdminForRoom } = require("./fixtures");

describe("Leave Room", function() {
  let roomRepository = null;
  let voterRepository = null;
  let eventBroadcaster = null;

  beforeEach(function() {
    roomRepository = new RoomRepository();
    voterRepository = new VoterRepository();
    eventBroadcaster = new MockEventBroadcaster();
  });

  it("user gets removed from the room", function() {
    const room = createRoom({ roomId: "new-room-id", roomRepository });
    const v1 = createVoterForRoom({ voterId: "1", room, voterRepository });
    const v2 = createVoterForRoom({ voterId: "2", room, voterRepository });
    const input = { roomId: room.id, voterId: v1.id }
    const userCase = createUseCase();

    userCase.execute(input);

    expect(room.voterCount()).to.equal(1);
    expect(room.voters).to.contain(v2);
    expect(roomRepository.findById(room.id)).to.not.be.undefined;
    expect(voterRepository.findById(input.voterId)).to.be.undefined;
    expect(eventBroadcaster.voterLeftRoomWasCalledOnce()).to.be.true;
    expect(eventBroadcaster.voterLeftRoomWasCalledWithInput(input)).to.be.true;
  });

  it("admin is not removed from the storage", function() {
    const room = createRoom({ roomId: "new-room-id", roomRepository });
    const admin = createAdminForRoom({ adminId: "1", room, voterRepository });
    const voter = createVoterForRoom({ voterId: "2", room, voterRepository });
    const input = { roomId: room.id, voterId: admin.id }
    const userCase = createUseCase();

    userCase.execute(input);

    expect(room.voterCount()).to.equal(1);
    expect(room.voters).to.contain(voter);
    expect(room.voters).to.not.contain(admin);
    expect(voterRepository.findById(admin.id)).to.equal(admin);
  });

  it("given invalid room id will throw error", function() {
    const invlaidRoomId = "invalid-room-id";
    const userCase = createUseCase();
    const input = { roomId: invlaidRoomId, voterId: "1" }

    expect(
      () => userCase.execute(input)
    ).throws(RoomNotFoundError);
  });

  it("Room is deleted with voters and admin when last voter leaves", function() {
    const room = createRoom({ roomId: "new-room-id", roomRepository })
    const voter = createVoterForRoom({ voterId: "new-voter-id", room, voterRepository });
    const input = { roomId: room.id, voterId: voter.id }
    const userCase = createUseCase();
    
    userCase.execute(input);
    
    expect(roomRepository.findById(room.id)).to.be.undefined;
    expect(voterRepository.findById(voter.id)).to.be.undefined;
  });
  
  it("Room is deleted with admin when last voter leaves", function() {
    const room = createRoom({ roomId: "new-room-id", roomRepository })
    const admin = createAdmin({ adminId: "new-admin-id", roomId: room.id, voterRepository });
    const voter = createVoterForRoom({ voterId: "new-voter-id", room, voterRepository });
    const input = { roomId: room.id, voterId: voter.id }
    const userCase = createUseCase();
    
    userCase.execute(input);

    expect(room.isEmpty()).to.be.true;
    expect(roomRepository.findById(room.id)).to.be.undefined;
    expect(voterRepository.findById(admin.id)).to.be.undefined;
    expect(voterRepository.findById(voter.id)).to.be.undefined;
  });

  it("Empty room gets deleted without affecting other room voters ", function() {
    const firstRoom = createRoom({ roomId: "first-room-id", roomRepository })
    const secondRoom = createRoom({ roomId: "second-room-id", roomRepository })
    const firstRoomVoter = createVoterForRoom({ voterId: "new-voter-id", room: firstRoom, voterRepository });
    const secondRoomVoter = createVoterForRoom({ voterId: "new-voter-id", room: secondRoom, voterRepository });
    const input = { roomId: firstRoom.id, voterId: firstRoomVoter.id }
    const userCase = createUseCase();
    
    userCase.execute(input);

    expect(firstRoom.isEmpty()).to.be.true;
    expect(roomRepository.findById(firstRoom.id)).to.be.undefined;
    expect(voterRepository.findById(firstRoomVoter.id)).to.be.undefined;
    
    expect(secondRoom.isEmpty()).to.be.false;
    expect(roomRepository.findById(secondRoom.id)).to.not.be.undefined;
    expect(voterRepository.findById(secondRoomVoter.id)).to.be.undefined;
  });

  function createUseCase() {
    return new LeaveRoom({ roomRepository, voterRepository, eventBroadcaster });
  }
});