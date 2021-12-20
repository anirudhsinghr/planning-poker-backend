const { CreateRoom, JoinRoom } = require("../usecase");

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

function joinRoom({request, response}) {
  const { id } = request.params;
  const useCase = new JoinRoom({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
    eventBroadcaster: context.eventBroadcaster,
  });

  try {
    useCase.execute({ 
      roomId: id, 
      voterId: context.generateRandomId(), 
      connection: context.createConnection(request, response) 
    });
  } catch (error) {
    request.socket.destroy();
  }
}

module.exports = { initializeContext, createRoom, joinRoom };