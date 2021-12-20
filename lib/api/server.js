const express = require("express");
const app = express();
const cors = require("cors");
const { createRoom, joinRoom } = require("./adapters")

app.use(cors());

app.post("/room", function (request, response) {
  const result = createRoom();
  response.status(201).json(result).end();
});

app.get("/room/:id", function (request, response) {
  joinRoom({request, response});
});

const server = (() => {
  let connection = null;
  const defaultOptions = { port: 3000, callback: () => {} };
  
  start = ({ port, callback } = defaultOptions) => connection = app.listen(port, callback);
  stop = () => connection.close();
  return { start, stop };
})();

module.exports = server;