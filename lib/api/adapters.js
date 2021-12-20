const { CreateRoom, JoinRoom, LeaveRoom } = require("../usecase");

let context = null;

function initializeContext(dependencies) {
  context = dependencies;
}

function createRoom() {
  const useCase = new CreateRoom({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  })
  
  return useCase.execute({ roomId: context.generateRandomId() });
}

function joinRoom(id) {
  const useCase = new JoinRoom({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  });

  const input = {
    roomId: id, 
    voterId: context.generateRandomId(), 
  }

  return useCase.execute(input);
}

function leaveRoom({ roomId, voterId }) {

  const useCase = new LeaveRoom({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  })

  return useCase.execute({ roomId, voterId });
}

module.exports = { initializeContext, createRoom, joinRoom, leaveRoom };