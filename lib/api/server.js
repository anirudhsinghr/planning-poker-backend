const express = require("express");
const app = express();
const cors = require("cors");
const { createRoom, joinRoom, leaveRoom } = require("./adapters")

app.use(cors());

app.post("/room", function (request, response) {
  const result = createRoom();
  response.status(201).json(result).end();
});

app.get("/room/:id", function (request, response) {
  const { roomId, voterId } = joinRoom({request, response});

  request.on("close", () => {
    console.log("Leave Room")
    leaveRoom({ roomId, voterId })
  });
});

app.get("/leave", (rqe, res) => {
  console.log("Left")
  res.status(200).end();
})

const server = (() => {
  let connection = null;
  const defaultOptions = { port: 3000, callback: () => {} };
  
  start = ({ port, callback } = defaultOptions) => connection = app.listen(port, callback);
  stop = () => connection.close();
  return { start, stop };
})();

module.exports = server;