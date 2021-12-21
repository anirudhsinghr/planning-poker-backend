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
  const roomId = context.generateRandomId();
  return useCase.execute({ roomId, channel: context.createChannel(roomId) });
}

function joinRoom(io, socket) {
  const { roomId, voterId } = socket.handshake.query;

  const useCase = new JoinRoom({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  });
  
  const input = {
    roomId,
    voterId: voterId || context.generateRandomId(), 
    connection: context.createConnection(roomId, socket)
  }
  useCase.execute(input);
  socket.on("disconnect", () => leaveRoom({ roomId, voterId: input.voterId }));
}

function leaveRoom({ roomId, voterId }) {

  const useCase = new LeaveRoom({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  });

  return useCase.execute({ roomId, voterId });
}

module.exports = { initializeContext, createRoom, joinRoom, leaveRoom };