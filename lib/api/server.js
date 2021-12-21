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
  try {
    joinRoom(io, socket)
  } catch (error) {
    console.log(error)
    socket.emit("room.not_found");
    socket.disconnect();
  }
});


module.exports = (() => {
  const defaultOptions = { port: 3000, callback: () => {} };
  
  start = ({ port, callback } = defaultOptions) => server.listen(port, callback);
  stop = () => server.close();
  return { start, stop, io };
})();