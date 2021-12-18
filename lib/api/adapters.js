const { CreateRoom } = require("../usecase");

let context = null;

function initializeContext(overrides) {
  context = { ...context, ...overrides };
}

function createRoom() {
  const useCase = new CreateRoom({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  })
  
  return useCase.execute({ roomId: context.generateRandomId() });
}

module.exports = { initializeContext, createRoom };