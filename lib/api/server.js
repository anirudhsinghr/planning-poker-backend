const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const cors = require("cors");
const { createRoom, joinRoom, leaveRoom } = require("./adapters")

app.use(cors());

app.post("/room", function (request, response) {
  const result = createRoom();
  response.status(201).json(result).end();
});

io.on("connection", function (socket) {
  const { roomId } = socket.handshake.query;
  let voterId = null;
  try {
    const result = joinRoom(roomId)
    voterId = result.voterId;
    delete result["voterId"];
    socket.join(result.roomId)
    io.to(result.roomId).emit('state_changed', result);
  } catch (error) {
    socket.emit("room_not_found")
    socket.disconnect();
  }
  socket.on("disconnect", () => {
    socket.leave(roomId);
    if (voterId) {
      const state = leaveRoom({ roomId, voterId })
      delete state['voterId']
      io.to(roomId).emit('state_changed', state);
    }
  })
})


module.exports = (() => {
  const defaultOptions = { port: 3000, callback: () => {} };
  
  start = ({ port, callback } = defaultOptions) => server.listen(port, callback);
  stop = () => server.close();
  return { start, stop };
})();