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

function joinRoom({ request, response }) {
  const { id } = request.params;
  const useCase = new JoinRoom({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
    eventBroadcaster: context.eventBroadcaster,
  });

  const input = {
    roomId: id, 
    voterId: context.generateRandomId(), 
    connection: context.createConnection(request, response) 
  }
  try {
    useCase.execute(input);
  } catch (error) {
    console.log(console.error(error))
    request.socket.destroy();
  }

  return input;
}

function leaveRoom({ roomId, voterId }) {

  const useCase = new LeaveRoom({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
    eventBroadcaster: context.eventBroadcaster,
  })

  useCase.execute({ roomId, voterId });
}

module.exports = { initializeContext, createRoom, joinRoom, leaveRoom };