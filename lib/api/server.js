const express = require("express");
const app = express();
const { createRoom } = require("./adapters")

app.post("/room", function (request, response) {
  const result = createRoom();
  response.status(201).json(result).end();
});

const server = (() => {
  let connection = null;
  const defaultOptions = { port: 3000, callback: () => {} };
  
  start = ({ port, callback } = defaultOptions) => connection = app.listen(port, callback);
  stop = () => connection.close();
  return { start, stop };
})();

module.exports = server;