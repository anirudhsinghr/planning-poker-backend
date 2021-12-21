const { CreateRoom, JoinRoom, LeaveRoom, SelectPack, CastVote, ResetVotes, ForceReveal } = require("../usecase");

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
  socket.on("pack.change", (data) => changePack(data));
  socket.on("vote.cast", (data) => castVote(data));
  socket.on("reset", (data) => resetVotes(data));
  socket.on("reveal", (data) => forceReveal(data));
}

function changePack(data) {
  const useCase = new SelectPack({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  });

  useCase.execute(data);
}

function resetVotes({ roomId, voterId }) {
  const useCase = new ResetVotes({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  });

  useCase.execute({roomId, voterId});
}

function forceReveal({ roomId, voterId }) {
  const useCase = new ForceReveal({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  });

  useCase.execute({roomId, voterId});
}

function castVote(data) {
  const useCase = new CastVote({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  });

  useCase.execute(data)
}

function leaveRoom({ roomId, voterId }) {

  const useCase = new LeaveRoom({
    roomRepository: context.roomRepository,
    voterRepository: context.voterRepository,
  });

  useCase.execute({ roomId, voterId });
}

module.exports = { initializeContext, createRoom, joinRoom, leaveRoom };